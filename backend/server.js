const express = require("express");
const cors = require("cors");
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

// Koneksi ke database
const pool = new Pool({
    user: 'postgres',      // username PostgreSQL Anda
    host: 'localhost',
    database: 'ukt',     // nama database Anda
    password: 'postgres',   // password PostgreSQL Anda
    port: 5432,
});

// Test route
app.get("/", (req, res) => {
    res.json({ message: "Server berjalan dengan baik" });
});

// API Login
app.post("/auth/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log("Mencoba login:", username);

        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1 AND password = $2",
            [username, password]
        );

        if (result.rows.length > 0) {
            res.json({
                success: true,
                message: "Login berhasil",
                user: result.rows[0]
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Username atau password salah"
            });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// API GET PRODUCTS - ambil dari database ukt
app.get("/api/products", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                id, 
                title,           -- judul buku
                author,          -- penulis
                publisher,       -- penerbit
                price,           -- harga
                stock,           -- stok
                description,     -- deskripsi
                cover_image,     -- gambar sampul
                isbn,
                category_id,
                publication_year
            FROM products 
            WHERE stock > 0 
            ORDER BY id DESC
        `);

        console.log(`📦 ${result.rows.length} produk ditemukan`);

        res.json({
            success: true,
            data: result.rows,
            total: result.rows.length
        });

    } catch (error) {
        console.error("❌ Error ambil produk:", error);
        res.status(500).json({
            success: false,
            message: "Gagal ambil data produk",
            error: error.message
        });
    }
});

// API GET SINGLE PRODUCT (opsional)
app.get("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT * FROM products WHERE id = $1",
            [id]
        );

        if (result.rows.length > 0) {
            res.json({
                success: true,
                data: result.rows[0]
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Produk tidak ditemukan"
            });
        }
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.listen(3001, () => {
    console.log("Server berjalan di http://localhost:3001");
});