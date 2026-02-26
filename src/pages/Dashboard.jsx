import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>Selamat datang, Admin</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;