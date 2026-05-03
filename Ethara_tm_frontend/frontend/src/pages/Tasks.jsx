import { useEffect, useState } from "react";
import API from "../api/axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
    project: "",
    assigned_to: "",
  });

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects/");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMembers = async (projectId) => {
    try {
      const res = await API.get(`/projects/${projectId}/members/`);
      setMembers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
      ...(name === "project" && { assigned_to: "" }),
    });

    if (name === "project" && value) {
      fetchMembers(value);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await API.post("/tasks/", formData);

      setFormData({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
        project: "",
        assigned_to: "",
      });

      setMembers([]);
      fetchTasks();
      alert("Task created");
    } catch (err) {
      console.log(err);
      alert("Error creating task");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/tasks/${id}/`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.log(err);
      alert("Error updating status");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Tasks</h2>

      {role === "admin" && (
        <div className="card p-3 mb-4 shadow-sm">
          <h5>Create Task</h5>

          <form onSubmit={handleCreate}>
            <input
              className="form-control mb-2"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <input
              className="form-control mb-2"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <select
              className="form-control mb-2"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              type="date"
              className="form-control mb-2"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
            />

            <select
              className="form-control mb-2"
              name="project"
              value={formData.project}
              onChange={handleChange}
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              className="form-control mb-2"
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              required
              disabled={!formData.project}
            >
              <option value="">Select Member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.username} {m.role === "admin" ? "(admin)" : ""}
                </option>
              ))}
            </select>

            <button className="btn btn-primary">Create Task</button>
          </form>
        </div>
      )}

      <div className="row">
        {tasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          tasks.map((task) => (
            <div className="col-md-4" key={task.id}>
              <div className="card mb-3 shadow-sm">
                <div className="card-body">
                  <h5>{task.title}</h5>
                  <p>{task.description}</p>

                  <p>
                    <strong>Priority:</strong> {task.priority}
                  </p>

                  <p>
                    <strong>Due Date:</strong> {task.due_date || "N/A"}
                  </p>

                  <p>
                    <strong>Status:</strong>
                  </p>

                  <select
                    className="form-control"
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value)
                    }
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Tasks;