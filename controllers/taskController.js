const Task = require("../models/Task");

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, project, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      project,
      assignedTo
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET TASKS (by project)
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE TASK STATUS
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status },
      { new: true }
    );

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DASHBOARD DATA
const getDashboard = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();

    const todoTasks = await Task.countDocuments({ status: "To Do" });
    const inProgressTasks = await Task.countDocuments({ status: "In Progress" });
    const doneTasks = await Task.countDocuments({ status: "Done" });

    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "Done" }
    });

    res.json({
      totalTasks,
      status: {
        todoTasks,
        inProgressTasks,
        doneTasks
      },
      overdueTasks
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
  getDashboard
};