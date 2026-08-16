import { useSelector } from "react-redux";
import "./Dashboard.css";

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="container dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-card">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>
    </div>
  );
}
