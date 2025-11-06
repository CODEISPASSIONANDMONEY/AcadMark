import pool from "../../config/db.js";
import { parseExcel } from "../utils/excelParser.js";

const studentColumnMap = {
  year: ["year", "academic_year"],
  stream: ["stream", "course_stream"],
  division: ["division", "class_division"],
  rollNo: ["roll_no", "roll", "roll_number"],
  studentName: ["student_name", "name", "full_name"],
  studentId: ["student_id", "id", "enrollment_id"],
};

const teacherColumnMap = {
  teacherId: ["teacher_id", "id"],
  name: ["name", "teacher_name", "full_name"],
  subject: ["subject", "course"],
  stream: ["stream", "course_stream"],
};

export function parseStudentImport(filePath) {
  return parseExcel(filePath, studentColumnMap);
}

export function parseTeacherImport(filePath) {
  return parseExcel(filePath, teacherColumnMap);
}

export async function upsertStudents(students, actorId) {
  if (!Array.isArray(students) || students.length === 0) {
    return { inserted: 0 };
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const values = students.map((student) => [
      student.studentId?.toString().trim(),
      student.studentName?.toString().trim(),
      student.rollNo?.toString().trim(),
      student.year?.toString().trim(),
      student.stream?.toString().trim(),
      student.division?.toString().trim(),
    ]);

    const query = `
      INSERT INTO student_details_db (student_id, student_name, roll_no, year, stream, division)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        student_name = VALUES(student_name),
        roll_no = VALUES(roll_no),
        year = VALUES(year),
        stream = VALUES(stream),
        division = VALUES(division);
    `;

    const [result] = await connection.query(query, [values]);

    await logActivity(connection, "admin", actorId, "IMPORT_STUDENTS", {
      total: students.length,
      inserted: result.affectedRows,
    });

    await connection.commit();
    return { inserted: result.affectedRows };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function upsertTeachers(teachers, actorId) {
  if (!Array.isArray(teachers) || teachers.length === 0) {
    return { inserted: 0 };
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const values = teachers.map((teacher) => [
      teacher.teacherId?.toString().trim(),
      teacher.name?.toString().trim(),
      teacher.subject?.toString().trim(),
      teacher.stream?.toString().trim(),
    ]);

    const query = `
      INSERT INTO teacher_details_db (teacher_id, name, subject, stream)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        subject = VALUES(subject),
        stream = VALUES(stream);
    `;

    const [result] = await connection.query(query, [values]);

    await logActivity(connection, "admin", actorId, "IMPORT_TEACHERS", {
      total: teachers.length,
      inserted: result.affectedRows,
    });

    await connection.commit();
    return { inserted: result.affectedRows };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function upsertMappings(mappings, actorId) {
  if (!Array.isArray(mappings) || mappings.length === 0) {
    return { inserted: 0 };
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const values = mappings.map((item) => [item.teacherId, item.studentId]);

    const query = `
      INSERT INTO teacher_student_map (teacher_id, student_id)
      VALUES ?
      ON DUPLICATE KEY UPDATE teacher_id = VALUES(teacher_id);
    `;

    await connection.query(query, [values]);

    await logActivity(connection, "admin", actorId, "CONFIRM_MAPPING", {
      total: mappings.length,
    });

    await connection.commit();
    return { inserted: mappings.length };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getRecentImportActivity(limit = 10) {
  const [rows] = await pool.query(
    "SELECT id, actor_role, action, created_at, details FROM activity_logs ORDER BY created_at DESC LIMIT ?",
    [limit]
  );
  return rows;
}

async function logActivity(
  connection,
  actorRole,
  actorId,
  action,
  details = {}
) {
  await connection.query(
    "INSERT INTO activity_logs (actor_role, actor_id, action, details) VALUES (?, ?, ?, ?)",
    [actorRole, actorId, action, JSON.stringify(details)]
  );
}
