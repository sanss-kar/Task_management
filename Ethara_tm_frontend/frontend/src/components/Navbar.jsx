import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!token) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4">
      <Link className="navbar-brand fw-bold" to="/">
        Team Task Manager
      </Link>

      <div className="ms-auto d-flex align-items-center gap-3">
        <Link className="nav-link" to="/">
          Dashboard
        </Link>

        <Link className="nav-link" to="/projects">
          Projects
        </Link>

        <Link className="nav-link" to="/tasks">
          Tasks
        </Link>

        <span className="badge bg-secondary">
          {username} | {role}
        </span>

        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;