import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { createTask, deleteTask, getTasks, updateTask } from '../services/taskService.js';

function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    status: 'pending'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadTasks() {
    try {
      setLoading(true);
      setError('');
      const data = await getTasks();
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreateTask(e) {
    e.preventDefault();
    setError('');

    if (!title || !description) {
      setError('Title and description are required');
      return;
    }

    try {
      await createTask({ title, description });
      setTitle('');
      setDescription('');
      await loadTasks();
    } catch (err) {
      setError(err.message || 'Failed to create task');
    }
  }

  async function handleToggleStatus(task) {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';

    try {
      await updateTask(task._id, { status: nextStatus });
      await loadTasks();
    } catch (err) {
      setError(err.message || 'Failed to update task');
    }
  }

  function startEdit(task) {
    setEditingTaskId(task._id);
    setEditForm({
      title: task.title,
      description: task.description,
      status: task.status
    });
  }

  function cancelEdit() {
    setEditingTaskId(null);
    setEditForm({
      title: '',
      description: '',
      status: 'pending'
    });
  }

  async function handleSaveEdit(id) {
    if (!editForm.title || !editForm.description) {
      setError('Title and description are required');
      return;
    }

    try {
      setError('');
      await updateTask(id, editForm);
      cancelEdit();
      await loadTasks();
    } catch (err) {
      setError(err.message || 'Failed to update task');
    }
  }

  async function handleDeleteTask(id) {
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  }

  return (
    <main className="page-shell">
      <header className="top-bar">
        <div>
          <h1>Task Dashboard</h1>
          <p className="muted">Welcome, {user?.name || 'User'}</p>
        </div>
        <div className="actions-row">
          {user?.role === 'admin' && (
            <Link className="outline-btn" to="/admin">Admin Panel</Link>
          )}
          <button className="outline-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="card">
        <h2>Create Task</h2>
        <form className="auth-form" onSubmit={handleCreateTask}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>
      </section>

      <section className="card">
        <h2>Your Tasks</h2>
        {error && <p className="error-text">{error}</p>}
        {loading ? <p className="muted">Loading tasks...</p> : null}
        {!loading && tasks.length === 0 ? <p className="muted">No tasks yet.</p> : null}

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              {editingTaskId === task._id ? (
                <>
                  <div className="auth-form">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Task title"
                    />
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Task description"
                    />
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="pending">pending</option>
                      <option value="in-progress">in-progress</option>
                      <option value="completed">completed</option>
                    </select>
                  </div>
                  <div className="actions-row">
                    <button className="small-btn" onClick={() => handleSaveEdit(task._id)}>
                      Save
                    </button>
                    <button className="small-btn danger" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="task-title">{task.title}</p>
                    <p className="muted">{task.description}</p>
                    <p className="status">Status: {task.status}</p>
                  </div>
                  <div className="actions-row">
                    <button className="small-btn" onClick={() => startEdit(task)}>
                      Edit
                    </button>
                    <button className="small-btn" onClick={() => handleToggleStatus(task)}>
                      Toggle
                    </button>
                    <button className="small-btn danger" onClick={() => handleDeleteTask(task._id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Dashboard;
