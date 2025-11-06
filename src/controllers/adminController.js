import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import pool from "../../config/db.js";

import {
  parseStudentImport,
  parseTeacherImport,
  upsertStudents,
  upsertTeachers,
  upsertMappings,
  getRecentImportActivity,
} from "../services/adminService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

function ensureImportSession(req) {
  if (!req.session.importQueue) {
    req.session.importQueue = {
      students: [],
      teachers: [],
    };
  }
  return req.session.importQueue;
}

export async function handleStudentImport(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Upload file is required" });
    }

    const students = parseStudentImport(req.file.path).filter(
      (row) => row.studentId
    );
    const queue = ensureImportSession(req);
    queue.students = students;

    return res.json({
      message: "Student file processed successfully",
      total: students.length,
      preview: students.slice(0, 5),
    });
  } catch (error) {
    return next(error);
  } finally {
    if (req.file) {
      fs.rm(req.file.path, { force: true }, () => {});
    }
  }
}

export async function handleTeacherImport(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Upload file is required" });
    }

    const teachers = parseTeacherImport(req.file.path).filter(
      (row) => row.teacherId
    );
    const queue = ensureImportSession(req);
    queue.teachers = teachers;

    return res.json({
      message: "Teacher file processed successfully",
      total: teachers.length,
      preview: teachers.slice(0, 5),
    });
  } catch (error) {
    return next(error);
  } finally {
    if (req.file) {
      fs.rm(req.file.path, { force: true }, () => {});
    }
  }
}

export async function confirmImport(req, res, next) {
  try {
    const queue = ensureImportSession(req);
    const { mappings = [] } = req.body;

    const results = {
      students: { inserted: 0 },
      teachers: { inserted: 0 },
      mappings: { inserted: 0 },
    };

    if (queue.students.length) {
      results.students = await upsertStudents(
        queue.students,
        req.session.user.id
      );
    }

    if (queue.teachers.length) {
      results.teachers = await upsertTeachers(
        queue.teachers,
        req.session.user.id
      );
    }

    if (Array.isArray(mappings) && mappings.length) {
      results.mappings = await upsertMappings(mappings, req.session.user.id);
    }

    req.session.importQueue = { students: [], teachers: [] };

    return res.json({
      message: "Import confirmed successfully",
      results,
    });
  } catch (error) {
    return next(error);
  }
}

export function getImportPreview(req, res) {
  const queue = ensureImportSession(req);
  return res.json({
    students: queue.students.slice(0, 10),
    teachers: queue.teachers.slice(0, 10),
  });
}

export async function fetchImportActivity(req, res, next) {
  try {
    const activity = await getRecentImportActivity();
    return res.json({ activity });
  } catch (error) {
    return next(error);
  }
}

export async function fetchDashboardStats(req, res, next) {
  try {
    const [[studentRow]] = await pool.query(
      "SELECT COUNT(*) AS total FROM student_details_db"
    );
    const [[teacherRow]] = await pool.query(
      "SELECT COUNT(*) AS total FROM teacher_details_db"
    );

    const [streams] = await pool.query(
      `SELECT stream, division, COUNT(*) AS students
       FROM student_details_db
       GROUP BY stream, division`
    );

    return res.json({
      students: studentRow.total,
      teachers: teacherRow.total,
      streams,
    });
  } catch (error) {
    return next(error);
  }
}

export function downloadTemplate(req, res) {
  const { type } = req.params;
  const allowed = ["students", "teachers"];

  if (!allowed.includes(type)) {
    return res.status(404).json({ message: "Template not found" });
  }

  const templatePath = path.join(
    rootDir,
    "public",
    "templates",
    `${type}_template.csv`
  );
  return res.download(templatePath);
}
