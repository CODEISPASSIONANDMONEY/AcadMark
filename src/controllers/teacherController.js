import pool from "../../config/db.js";
import {
  getMappedStudents,
  createAttendanceSession,
  finalizeAttendanceSession,
  getTeacherStats,
  logAttendanceToAggregate,
} from "../services/attendanceService.js";

function buildActivityPayload(action, teacherId, meta = {}) {
  return pool.query(
    "INSERT INTO activity_logs (actor_role, actor_id, action, details) VALUES (?, ?, ?, ?)",
    ["teacher", teacherId, action, JSON.stringify(meta)]
  );
}

export async function teacherDashboard(req, res, next) {
  try {
    const teacherId = req.session.user.id;

    // Get teacher details including subject and stream
    const [teacherRows] = await pool.query(
      "SELECT teacher_id, name, subject, stream FROM teacher_details_db WHERE teacher_id = ? LIMIT 1",
      [teacherId]
    );

    const teacherInfo = teacherRows[0] || {};
    const stats = await getTeacherStats(teacherId);

    // Get unique streams from database
    const [streamRows] = await pool.query(
      "SELECT DISTINCT stream FROM student_details_db WHERE stream IS NOT NULL ORDER BY stream"
    );

    // Get unique divisions from database
    const [divisionRows] = await pool.query(
      "SELECT DISTINCT division FROM student_details_db WHERE division IS NOT NULL ORDER BY division"
    );

    return res.json({
      ...stats,
      teacherInfo: {
        id: teacherInfo.teacher_id,
        name: teacherInfo.name,
        subject: teacherInfo.subject,
        stream: teacherInfo.stream,
      },
      streams: streamRows.map((row) => row.stream),
      divisions: divisionRows.map((row) => row.division),
    });
  } catch (error) {
    return next(error);
  }
}

export async function mappedStudents(req, res, next) {
  try {
    const teacherId = req.session.user.id;
    const students = await getMappedStudents(teacherId);
    return res.json({ students });
  } catch (error) {
    return next(error);
  }
}

export async function startAttendance(req, res, next) {
  try {
    const teacherId = req.session.user.id;
    const { subject, division, stream } = req.body;

    if (!subject || !division || !stream) {
      return res
        .status(400)
        .json({ message: "Subject, division, and stream are required" });
    }

    const students = await getMappedStudents(teacherId);
    if (!students.length) {
      return res
        .status(404)
        .json({ message: "No students mapped to this teacher yet" });
    }

    const sessionId = await createAttendanceSession({
      teacherId,
      subject,
      division,
      stream,
    });

    await buildActivityPayload("START_ATTENDANCE", teacherId, {
      sessionId,
      subject,
      division,
      stream,
    });

    return res.json({
      message: "Attendance session started",
      sessionId,
      students,
    });
  } catch (error) {
    return next(error);
  }
}

export async function endAttendance(req, res, next) {
  try {
    const teacherId = req.session.user.id;
    const { sessionId, subject, stream, division, attendance } = req.body;

    if (!sessionId || !Array.isArray(attendance) || !attendance.length) {
      return res
        .status(400)
        .json({ message: "Session ID and attendance list are required" });
    }

    const formatted = attendance.map((item) => ({
      studentId: item.studentId,
      status: item.status === "P" ? "P" : "A",
    }));

    const summary = await finalizeAttendanceSession(
      sessionId,
      teacherId,
      formatted
    );

    await logAttendanceToAggregate(formatted, {
      sessionId,
      teacherId,
      subject,
      stream,
      division,
      sessionDate: new Date(),
    });

    await buildActivityPayload("END_ATTENDANCE", teacherId, {
      sessionId,
      subject,
      division,
      stream,
      present: summary.present,
      absent: summary.absent,
    });

    return res.json({
      message: "Attendance recorded",
      summary,
    });
  } catch (error) {
    return next(error);
  }
}

export async function manualAttendance(req, res, next) {
  try {
    const teacherId = req.session.user.id;
    const { studentId, status, reason } = req.body;

    if (!studentId || !status) {
      return res
        .status(400)
        .json({ message: "Student ID and status are required" });
    }

    await pool.query(
      `INSERT INTO manual_attendance_overrides (teacher_id, student_id, status, reason)
       VALUES (?, ?, ?, ?)`,
      [teacherId, studentId, status === "P" ? "P" : "A", reason || null]
    );

    await buildActivityPayload("MANUAL_OVERRIDE", teacherId, {
      studentId,
      status,
      reason,
    });

    return res.json({ message: "Manual attendance override saved" });
  } catch (error) {
    return next(error);
  }
}

export async function teacherActivityLog(req, res, next) {
  try {
    const teacherId = req.session.user.id;
    const [rows] = await pool.query(
      `SELECT action, details, created_at
       FROM activity_logs
       WHERE actor_role = 'teacher' AND actor_id = ?
       ORDER BY created_at DESC
       LIMIT 20`,
      [teacherId]
    );

    return res.json({ activity: rows });
  } catch (error) {
    return next(error);
  }
}
