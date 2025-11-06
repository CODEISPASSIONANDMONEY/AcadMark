import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";
import {
  teacherDashboard,
  mappedStudents,
  startAttendance,
  endAttendance,
  manualAttendance,
  teacherActivityLog,
} from "../controllers/teacherController.js";

const router = Router();

router.use(requireAuth, requireRole("teacher"));

router.get("/dashboard", teacherDashboard);
router.get("/students", mappedStudents);
router.post("/attendance/start", startAttendance);
router.post("/attendance/end", endAttendance);
router.post("/attendance/manual", manualAttendance);
router.get("/activity", teacherActivityLog);

export default router;
