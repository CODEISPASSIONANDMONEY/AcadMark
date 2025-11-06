import pool from "../../config/db.js";

const MONTH_TABLE_PREFIX = "attendance_backup_";

function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}_${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
}

async function ensureMonthlyTable(connection, monthKey) {
  const tableName = `${MONTH_TABLE_PREFIX}${monthKey}`;

  const createSql = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      session_id VARCHAR(100) NOT NULL,
      teacher_id VARCHAR(64) NOT NULL,
      student_id VARCHAR(64) NOT NULL,
      status ENUM('P','A') NOT NULL,
      marked_at DATETIME NOT NULL,
      PRIMARY KEY (id),
      KEY idx_session (session_id),
      KEY idx_teacher (teacher_id),
      KEY idx_student (student_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  await connection.query(createSql);
  return tableName;
}

export async function getMappedStudents(teacherId) {
  const [rows] = await pool.query(
    `SELECT s.student_id, s.student_name, s.roll_no, s.stream, s.division, s.year
     FROM teacher_student_map m
     INNER JOIN student_details_db s ON s.student_id = m.student_id
     WHERE m.teacher_id = ?
     ORDER BY s.roll_no;`,
    [teacherId]
  );
  return rows;
}

export async function createAttendanceSession({
  teacherId,
  subject,
  division,
  stream,
}) {
  // Generate unique session ID
  const sessionId = `SES_${teacherId}_${Date.now()}`;

  await pool.query(
    `INSERT INTO attendance_sessions (session_id, teacher_id, subject, division, stream, started_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [sessionId, teacherId, subject, division, stream]
  );
  return sessionId;
}

export async function finalizeAttendanceSession(
  sessionId,
  teacherId,
  attendanceRecords
) {
  if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
    throw new Error("Attendance records are required to finalize session");
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Update session end time and summary
    const present = attendanceRecords.filter(
      (record) => record.status === "P"
    ).length;
    const absent = attendanceRecords.length - present;

    await connection.query(
      `UPDATE attendance_sessions
       SET ended_at = NOW(), present_count = ?, absent_count = ?, status = 'completed'
       WHERE session_id = ? AND teacher_id = ?`,
      [present, absent, sessionId, teacherId]
    );

    const monthKey = getMonthKey();
    const tableName = await ensureMonthlyTable(connection, monthKey);

    const values = attendanceRecords.map((record) => [
      sessionId,
      teacherId,
      record.studentId,
      record.status,
      new Date(),
    ]);

    await connection.query(
      `INSERT INTO ${tableName} (session_id, teacher_id, student_id, status, marked_at)
       VALUES ?`,
      [values]
    );

    await connection.commit();
    return { present, absent, monthKey };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getTeacherStats(teacherId) {
  const [[summary]] = await pool.query(
    `SELECT
       COUNT(*) AS sessions,
       COALESCE(SUM(present_count), 0) AS total_present,
       COALESCE(SUM(absent_count), 0) AS total_absent
     FROM attendance_sessions
     WHERE teacher_id = ?`,
    [teacherId]
  );

  const [recentSessions] = await pool.query(
    `SELECT session_id, subject, division, started_at, present_count, absent_count
     FROM attendance_sessions
     WHERE teacher_id = ?
     ORDER BY started_at DESC
     LIMIT 10`,
    [teacherId]
  );

  const total = summary.total_present + summary.total_absent;
  const average = total ? Math.round((summary.total_present / total) * 100) : 0;

  return {
    summary: {
      sessions: summary.sessions,
      totalPresent: summary.total_present,
      totalAbsent: summary.total_absent,
      averagePercentage: average,
    },
    recentSessions,
  };
}

export async function getStudentStats(studentId) {
  const [totals] = await pool.query(
    `SELECT
       SUM(CASE WHEN status = 'P' THEN 1 ELSE 0 END) AS present,
       SUM(CASE WHEN status = 'A' THEN 1 ELSE 0 END) AS absent
     FROM attendance_backup_aggregate
     WHERE student_id = ?`,
    [studentId]
  );

  const present = totals[0]?.present || 0;
  const absent = totals[0]?.absent || 0;
  const total = present + absent;
  const percentage = total ? Math.round((present / total) * 100) : 0;

  const [recentSessions] = await pool.query(
    `SELECT session_date, subject, status
     FROM attendance_backup_aggregate
     WHERE student_id = ?
     ORDER BY session_date DESC
     LIMIT 10`,
    [studentId]
  );

  const [subjectBreakdown] = await pool.query(
    `SELECT subject,
            SUM(CASE WHEN status = 'P' THEN 1 ELSE 0 END) AS present,
            COUNT(*) AS total
     FROM attendance_backup_aggregate
     WHERE student_id = ?
     GROUP BY subject`,
    [studentId]
  );

  return {
    present,
    absent,
    total,
    percentage,
    recentSessions,
    subjectBreakdown,
  };
}

export async function logAttendanceToAggregate(records, sessionMeta) {
  if (!records?.length) return;

  const values = records.map((record) => [
    sessionMeta.sessionId,
    sessionMeta.teacherId,
    record.studentId,
    sessionMeta.subject,
    sessionMeta.stream,
    sessionMeta.division,
    record.status,
    sessionMeta.sessionDate,
  ]);

  await pool.query(
    `INSERT INTO attendance_backup_aggregate
      (session_id, teacher_id, student_id, subject, stream, division, status, session_date)
     VALUES ?`,
    [values]
  );
}
