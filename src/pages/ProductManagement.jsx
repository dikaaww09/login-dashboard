import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./Dashboard.css";

function ProductManagement() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        category_id: "",
        price: "",
        stock: "",
        description: "",
        cover_image: "",
        isbn: ""
    });
    const [isAdding, setIsAdding] = useState(false);
    
    // STATE UNTUK MODAL EDIT
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

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

        fetchCategories();
        fetchProducts();
    }, [navigate]);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error("Gagal ambil kategori:", error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, categories(name)')
                .order('id', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error("Gagal ambil produk:", error);
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

    const handleAddNew = () => {
        setIsAdding(true);
        setFormData({
            title: "",
            author: "",
            category_id: "",
            price: "",
            stock: "",
            description: "",
            cover_image: "",
            isbn: ""
        });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        
        if (!formData.category_id) {
            alert("Pilih kategori terlebih dahulu!");
            return;
        }

        try {
            const { error } = await supabase
                .from('products')
                .insert([
                    {
                        title: formData.title,
                        author: formData.author,
                        category_id: parseInt(formData.category_id),
                        price: parseFloat(formData.price),
                        stock: parseInt(formData.stock),
                        description: formData.description,
                        cover_image: formData.cover_image || "https://via.placeholder.com/200x150?text=Buku",
                        isbn: formData.isbn
                    }
                ]);

            if (error) throw error;

            alert("Produk berhasil ditambahkan!");
            setIsAdding(false);
            fetchProducts();
        } catch (error) {
            console.error("Gagal tambah produk:", error);
            alert("Gagal tambah produk: " + error.message);
        }
    };

    // FUNGSI EDIT UNTUK MODAL
    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title,
            author: product.author,
            category_id: product.category_id || "",
            price: product.price,
            stock: product.stock,
            description: product.description || "",
            cover_image: product.cover_image || "",
            isbn: product.isbn || ""
        });
        setShowEditModal(true);
    };

    const handleUpdate = async (id) => {
        if (!formData.category_id) {
            alert("Pilih kategori terlebih dahulu!");
            return;
        }

        try {
            const { error } = await supabase
                .from('products')
                .update({
                    title: formData.title,
                    author: formData.author,
                    category_id: parseInt(formData.category_id),
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock),
                    description: formData.description,
                    cover_image: formData.cover_image,
                    isbn: formData.isbn
                })
                .eq('id', id);

            if (error) throw error;

            alert("Produk berhasil diupdate!");
            setShowEditModal(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            console.error("Gagal update produk:", error);
            alert("Gagal update produk: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus produk ini?")) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert("Produk berhasil dihapus!");
            fetchProducts();
        } catch (error) {
            console.error("Gagal hapus produk:", error);
            alert("Gagal hapus produk: " + error.message);
        }
    };

    if (loading) return <div className="loading">Loading produk...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>📚 Manajemen Produk</h1>
                <div>
                    <button onClick={() => navigate("/dashboard")} className="back-btn">
                        ← Kembali ke Dashboard
                    </button>
                    <button onClick={handleAddNew} className="add-btn">
                        + Tambah Produk Baru
                    </button>
                </div>
            </div>

            {/* Form Tambah Produk */}
            {isAdding && (
                <div className="product-form">
                    <h3>Tambah Produk Baru</h3>
                    <form onSubmit={handleCreate}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Judul Buku *"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="author"
                            placeholder="Penulis *"
                            value={formData.author}
                            onChange={handleInputChange}
                            required
                        />
                        
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Pilih Kategori</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        
                        <input
                            type="number"
                            name="price"
                            placeholder="Harga *"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="stock"
                            placeholder="Stok *"
                            value={formData.stock}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="isbn"
                            placeholder="ISBN (opsional)"
                            value={formData.isbn}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="cover_image"
                            placeholder="URL Gambar (opsional)"
                            value={formData.cover_image}
                            onChange={handleInputChange}
                        />
                        <textarea
                            name="description"
                            placeholder="Deskripsi (opsional)"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                        ></textarea>
                        <div className="form-actions">
                            <button type="submit">💾 Simpan</button>
                            <button type="button" onClick={() => setIsAdding(false)}>❌ Batal</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabel Produk */}
            <div className="products-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Gambar</th>
                            <th>Judul</th>
                            <th>Penulis</th>
                            <th>Kategori</th>
                            <th>Harga</th>
                            <th>Stok</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>
                                    <img 
                                        src={product.cover_image || "https://via.placeholder.com/50x50?text=Buku"} 
                                        alt={product.title} 
                                        style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px'}} 
                                    />
                                </td>
                                <td>{product.title}</td>
                                <td>{product.author}</td>
                                <td>{product.categories?.name || '-'}</td>
                                <td>Rp {product.price?.toLocaleString()}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <button onClick={() => handleEdit(product)}>✏️</button>
                                    <button onClick={() => handleDelete(product.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL EDIT PRODUK */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Edit Produk</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdate(editingProduct.id);
                        }}>
                            <input
                                type="text"
                                name="title"
                                placeholder="Judul Buku *"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="author"
                                placeholder="Penulis *"
                                value={formData.author}
                                onChange={handleInputChange}
                                required
                            />
                            
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            
                            <input
                                type="number"
                                name="price"
                                placeholder="Harga *"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="number"
                                name="stock"
                                placeholder="Stok *"
                                value={formData.stock}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="isbn"
                                placeholder="ISBN (opsional)"
                                value={formData.isbn}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="cover_image"
                                placeholder="URL Gambar (opsional)"
                                value={formData.cover_image}
                                onChange={handleInputChange}
                            />
                            <textarea
                                name="description"
                                placeholder="Deskripsi (opsional)"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                            ></textarea>
                            
                            <div className="form-actions">
                                <button type="submit">💾 Simpan Perubahan</button>
                                <button type="button" onClick={() => setShowEditModal(false)}>❌ Batal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductManagement;