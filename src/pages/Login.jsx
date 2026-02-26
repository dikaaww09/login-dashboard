import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:3001/auth/login", {
                username,
                password
            });

            console.log("Response:", response.data);

            if (response.data.success) {
                // Simpan data user ke localStorage
                localStorage.setItem("token", response.data.token || "dummy-token");
                localStorage.setItem("user", JSON.stringify(response.data.user));

                // Redirect ke dashboard
                navigate("/dashboard");
            } else {
                setError(response.data.message || "Login gagal");
            }

        } catch (err) {
            console.error("Error:", err);
            setError(err.response?.data?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>

                {error && <div className="error-message">{error}</div>}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;