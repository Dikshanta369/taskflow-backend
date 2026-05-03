const express = require("express");
const router = express.Router();

const { createProject, getProjects } = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const Project = require("../models/Project");

// ================= EXISTING ROUTES =================

// Create project (Admin only)
router.post("/", protect, authorizeRoles("Admin"), createProject);

// Get user projects
router.get("/", protect, getProjects);

// ================= NEW ROUTES =================

// 🔥 Add member to project (Admin only)
router.put("/:projectId/add-member", protect, authorizeRoles("Admin"), async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Prevent duplicates
    if (!project.members.includes(userId)) {
      project.members.push(userId);
    }

    await project.save();

    res.json({ message: "Member added successfully", project });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔥 Remove member from project (Admin only)
router.put("/:projectId/remove-member", protect, authorizeRoles("Admin"), async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.members = project.members.filter(
      member => member.toString() !== userId
    );

    await project.save();

    res.json({ message: "Member removed successfully", project });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;