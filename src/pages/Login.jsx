import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            if (data.user) {
                const { data: userData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();

                localStorage.setItem("user", JSON.stringify(userData));
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                    <label>EMAIL</label>
                    <input
                        type="email"
                        placeholder="Masukkan email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>PASSWORD</label>
                    <input
                        type="password"
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "LOGIN"}
                </button>
                
                <div className="login-footer">
                    <p>
                        Belum punya akun? 
                        <Link to="/register">Daftar disini</Link>
                    </p>
                </div>
                
                <div className="copyright">
                    © 2026 Toko Buku
                </div>
            </form>
        </div>
    );
}

export default Login;