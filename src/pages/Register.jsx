import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./Login.css";

function Register() {
    const [namaLengkap, setNamaLengkap] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // Validasi password match
        if (password !== confirmPassword) {
            setError("Password tidak cocok!");
            setLoading(false);
            return;
        }

        // Validasi panjang password
        if (password.length < 6) {
            setError("Password minimal 6 karakter!");
            setLoading(false);
            return;
        }

        try {
            // Daftar ke Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: namaLengkap,
                        username: email.split('@')[0]
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                // TIDAK PERLU INSERT MANUAL! Trigger otomatis akan insert
                // const { error: profileError } = await supabase...
                
                setSuccess("Registrasi berhasil! Silakan login.");
                
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleRegister}>
                <h2>Daftar Akun</h2>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <div className="form-group">
                    <label>NAMA LENGKAP</label>
                    <input
                        type="text"
                        placeholder="Masukkan nama lengkap"
                        value={namaLengkap}
                        onChange={(e) => setNamaLengkap(e.target.value)}
                        required
                    />
                </div>
                
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
                        placeholder="Minimal 6 karakter"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>KONFIRMASI PASSWORD</label>
                    <input
                        type="password"
                        placeholder="Ulangi password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "DAFTAR"}
                </button>
                
                <div className="login-footer">
                    <p>
                        Sudah punya akun? 
                        <Link to="/login">Login disini</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Register;