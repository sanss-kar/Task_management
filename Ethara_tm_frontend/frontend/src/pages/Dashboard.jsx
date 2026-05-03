import { useEffect, useState } from "react";
import API from "../api/axios";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/tasks/dashboard/");
      setDashboard(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load dashboard");
    }
  };

  if (!dashboard) return <h4>Loading dashboard...</h4>;

  return (
    <div>
      <h2 className="mb-4">
        {dashboard.role === "admin" ? "Team Dashboard" : "My Dashboard"}
      </h2>

      <div className="row mb-4">
        <div className="col-md-2">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>Total Tasks</h6>
              <h2>{dashboard.total_tasks}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-2">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>To Do</h6>
              <h2>{dashboard.todo}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-2">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>In Progress</h6>
              <h2>{dashboard.in_progress}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-2">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>Done</h6>
              <h2>{dashboard.done}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-2">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>Overdue</h6>
              <h2>{dashboard.overdue_tasks}</h2>
            </div>
          </div>
        </div>
      </div>

      {dashboard.role === "admin" ? (
        <div className="card shadow-sm">
          <div className="card-header">Member Task Activity</div>

          <div className="card-body">
            {dashboard.member_activity?.length === 0 ? (
              <p>No activity available</p>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Project</th>
                    <th>Total Tasks</th>
                    <th>Completed</th>
                    <th>Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.member_activity?.map((member, index) => (
                    <tr key={index}>
                      <td>{member.assigned_to__username}</td>
                      <td>{member.project__name}</td>
                      <td>{member.total_tasks}</td>
                      <td>{member.completed}</td>
                      <td>{member.pending}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-header">My Assigned Tasks</div>

          <div className="card-body">
            {dashboard.my_tasks?.length === 0 ? (
              <p>No tasks assigned</p>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.my_tasks?.map((task, index) => (
                    <tr key={index}>
                      <td>{task.title}</td>
                      <td>{task.project__name}</td>
                      <td>{task.status}</td>
                      <td>{task.priority}</td>
                      <td>{task.due_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;