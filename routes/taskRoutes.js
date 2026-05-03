const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTaskStatus,
  getDashboard
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

// Create Task
router.post("/", protect, createTask);

// Get Tasks by Project
router.get("/:projectId", protect, getTasks);

// Update Task Status
router.put("/:taskId", protect, updateTaskStatus);

// Dashboard Route
router.get("/dashboard/summary", protect, getDashboard);

module.exports = router;