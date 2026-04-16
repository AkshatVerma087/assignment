import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
    const {login} = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function handleChange(e){
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e){
        e.preventDefault();
        setError('');

        if(!form.email || !form.password){
            setError('Email and password are required');
            return;
        }

        try{
            setLoading(true);
            await login(form);
            navigate('/dashboard');
        }catch(err){
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <h1>Login</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
                <input 
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                />
                {error && <p className="error-text">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p>
                No account? <Link to="/register">Register here</Link>
            </p>
        </main>
    )
}

export default Login;