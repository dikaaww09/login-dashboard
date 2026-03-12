import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./Dashboard.css";

function UsersManagement() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        full_name: "",
        role: "user",
        is_active: true
    });

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            navigate("/login");
            return;
        }
        
        const user = JSON.parse(userData);
        if (user.role !== 'admin') {
            alert("Akses ditolak! Halaman ini hanya untuk admin.");
            navigate("/dashboard");
            return;
        }

        fetchUsers();
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('id', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error("Gagal ambil users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const startEdit = (user) => {
        setEditingUser(user.id);
        setFormData({
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            is_active: user.is_active
        });
    };

    const handleUpdate = async (id) => {
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    username: formData.username,
                    email: formData.email,
                    full_name: formData.full_name,
                    role: formData.role,
                    is_active: formData.is_active
                })
                .eq('id', id);

            if (error) throw error;

            alert("User berhasil diupdate");
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error("Gagal update user:", error);
            alert("Gagal update user: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus user ini?")) return;

        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert("User berhasil dihapus");
            fetchUsers();
        } catch (error) {
            console.error("Gagal hapus user:", error);
            alert("Gagal hapus user: " + error.message);
        }
    };

    const toggleActive = async (id, currentStatus) => {
        try {
            const { error } = await supabase
                .from('users')
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            fetchUsers();
        } catch (error) {
            console.error("Gagal ubah status:", error);
        }
    };

    if (loading) return <div className="loading">Loading users...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Manajemen Users</h1>
                <button onClick={() => navigate("/dashboard")} className="back-btn">
                     Kembali ke Dashboard
                </button>
            </div>

            <div className="products-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Nama Lengkap</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                {editingUser === user.id ? (
                                    // Mode Edit
                                    <>
                                        <td>{user.id}</td>
                                        <td><input name="username" value={formData.username} onChange={handleInputChange} /></td>
                                        <td><input name="email" value={formData.email} onChange={handleInputChange} /></td>
                                        <td><input name="full_name" value={formData.full_name} onChange={handleInputChange} /></td>
                                        <td>
                                            <select name="role" value={formData.role} onChange={handleInputChange}>
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                                <option value="kasir">Kasir</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select name="is_active" value={formData.is_active} onChange={handleInputChange}>
                                                <option value={true}>Aktif</option>
                                                <option value={false}>Nonaktif</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button onClick={() => handleUpdate(user.id)}>💾 Simpan</button>
                                            <button onClick={() => setEditingUser(null)}>❌ Batal</button>
                                        </td>
                                    </>
                                ) : (
                                    // Mode Tampil
                                    <>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.full_name}</td>
                                        <td>
                                            <span className={`role-badge role-${user.role}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span 
                                                className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}
                                                onClick={() => toggleActive(user.id, user.is_active)}
                                                style={{cursor: 'pointer'}}
                                            >
                                                {user.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td>
                                            <button onClick={() => startEdit(user)}>✏️ Edit</button>
                                            <button onClick={() => handleDelete(user.id)}>🗑️ Hapus</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UsersManagement;