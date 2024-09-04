import "./home.css";

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <header className="header">
        <h1>Welcome to Admin Dashboard</h1>
        <p>Manage all your movies, bookings, and users in one place!</p>
      </header>

      <div className="dashboard-cards">
        <Link to="/admin/movies">
        <div className="card">
          <i className="fas fa-film fa-3x icon"></i>
          <h2>Manage Movies</h2>
          <p>Add, update, or remove movies from the collection.</p>
        </div>
        </Link>

        <Link to="/admin/users">
        <div className="card">
          <i className="fas fa-user-cog fa-3x icon"></i>
          <h2>Manage Users</h2>
          <p>View user profiles, block, or give special permissions.</p>
        </div>
        </Link>

        <Link to="/admin/orders">
  <div className="card">
    <i className="fas fa-ticket-alt fa-3x icon"></i>
    <h2>Get All Tickets</h2>
    <p>View and manage all ticket bookings and sales.</p>
  </div>
</Link>
      </div>

    </div>
  );
}
