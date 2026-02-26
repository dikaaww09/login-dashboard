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
    database: 'data1',     // nama database Anda
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

app.listen(3001, () => {
    console.log("Server berjalan di http://localhost:3001");
});