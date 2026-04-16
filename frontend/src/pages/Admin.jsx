import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../services/adminService.js';

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadUsers() {
      try {
        setError('');
        const data = await getAllUsers();
        setUsers(data.users || []);
      } catch (err) {
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  return (
    <main className="page-shell">
      <header className="top-bar">
        <div>
          <h1>Admin Panel</h1>
          <p className="muted">View all users in the system</p>
        </div>
        <Link className="outline-btn" to="/dashboard">Back to Dashboard</Link>
      </header>

      <section className="card">
        <h2>Users</h2>
        {error && <p className="error-text">{error}</p>}
        {loading ? <p className="muted">Loading users...</p> : null}

        {!loading && users.length === 0 ? <p className="muted">No users found.</p> : null}

        <ul className="task-list">
          {users.map((u) => (
            <li key={u._id} className="task-item">
              <div>
                <p className="task-title">{u.name}</p>
                <p className="muted">{u.email}</p>
              </div>
              <span className="badge">{u.role}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Admin;
