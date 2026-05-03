import { useEffect, useState } from "react";
import API from "../api/axios";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState({});
  const [selectedUsers, setSelectedUsers] = useState({});

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects/");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users/");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await API.post("/projects/", { name, description });
      setName("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      alert("Error creating project");
    }
  };

  const fetchMembers = async (projectId) => {
    try {
      const res = await API.get(`/projects/${projectId}/members/`);
      setMembers((prev) => ({
        ...prev,
        [projectId]: res.data,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const addMember = async (projectId) => {
  const userId = selectedUsers[projectId];

  if (!userId) {
    alert("Please select a user");
    return;
  }

  try {
    await API.post(`/projects/${projectId}/add-member/`, {
      user_id: userId,
      role: "member",
    });

    setSelectedUsers((prev) => ({
      ...prev,
      [projectId]: "",
    }));

    fetchMembers(projectId);
    alert("Member added");
  } catch (err) {
    console.log(err.response?.data);
    alert(err.response?.data?.error || "Error adding member");
  }
};

  const removeMember = async (projectId, userId) => {
    try {
      await API.delete(`/projects/${projectId}/members/${userId}/`);
      fetchMembers(projectId);
    } catch (err) {
      alert("Error removing member");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Projects</h2>

      {role === "admin" && (
        <div className="card mb-4 p-3 shadow-sm">
          <h5>Create Project</h5>

          <form onSubmit={handleCreate}>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              className="form-control mb-2"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <button className="btn btn-primary">Create</button>
          </form>
        </div>
      )}

      <div className="row">
        {projects.length === 0 ? (
          <p>No projects found</p>
        ) : (
          projects.map((project) => (
            <div className="col-md-4" key={project.id}>
              <div className="card mb-3 shadow-sm">
                <div className="card-body">
                  <h5>{project.name}</h5>
                  <p>{project.description}</p>

                  {role === "admin" && (
                    <div className="d-flex gap-2 mb-2">
                      <select
                        className="form-control"
                        value={selectedUsers[project.id] || ""}
                        onChange={(e) =>
                          setSelectedUsers({
                            ...selectedUsers,
                            [project.id]: e.target.value,
                          })
                        }
                      >
                        <option value="">Select user</option>

                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.username} {u.role === "admin" ? "(admin)" : ""}
                          </option>
                        ))}
                      </select>

                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => addMember(project.id)}
                      >
                        Add
                      </button>
                    </div>
                  )}

                  <button
                    className="btn btn-sm btn-secondary mb-2"
                    onClick={() => fetchMembers(project.id)}
                  >
                    Show Members
                  </button>

                  <ul className="list-group">
                    {members[project.id]?.map((m) => (
                      <li
                        key={m.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>
                          {m.username} {m.role === "admin" ? "(admin)" : ""}
                        </span>

                        {role === "admin" && m.role !== "admin" && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => removeMember(project.id, m.id)}
                          >
                            Remove
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Projects;