const Task = require("../models/Task");

const getDashboard = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId });

    const totalTasks = tasks.length;

    const status = {
      todo: tasks.filter(t => t.status === "To Do").length,
      inProgress: tasks.filter(t => t.status === "In Progress").length,
      done: tasks.filter(t => t.status === "Done").length
    };

    const overdueTasks = tasks.filter(
      t => t.dueDate && new Date(t.dueDate) < new Date()
    ).length;

    const tasksPerUser = {};

    tasks.forEach(task => {
      if (task.assignedTo) {
        const id = task.assignedTo.toString();
        tasksPerUser[id] = (tasksPerUser[id] || 0) + 1;
      }
    });

    res.json({
      totalTasks,
      status,
      overdueTasks,
      tasksPerUser
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboard };