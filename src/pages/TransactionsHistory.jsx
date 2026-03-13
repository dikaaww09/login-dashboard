import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./TransactionsHistory.css";

function TransactionsHistory() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            navigate("/login");
            return;
        }

        const parsedUser = JSON.parse(userData);

        // Cek apakah user adalah admin
        if (parsedUser.role !== 'admin') {
            alert("Akses ditolak! Halaman ini hanya untuk admin.");
            navigate("/dashboard");
            return;
        }

        fetchTransactions();
    }, [navigate]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTransactions(data || []);
        } catch (error) {
            console.error("Gagal ambil riwayat transaksi:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        if (!price) return "0";
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const viewTransactionDetail = (transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailModal(true);
    };

    if (loading) return <div className="loading">Loading riwayat transaksi...</div>;

    return (
        <div className="transactions-container">
            <div className="transactions-header">
                <h1>📋 Riwayat Transaksi</h1>
                <div className="header-actions">
                    <button onClick={() => navigate("/dashboard")} className="back-btn">
                         Kembali ke Dashboard
                    </button>
                </div>
            </div>

            <div className="transactions-stats">
                <div className="stat-card">
                    <h3>Total Transaksi</h3>
                    <p className="stat-number">{transactions.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Pendapatan</h3>
                    <p className="stat-number">
                        Rp {formatPrice(transactions.reduce((sum, t) => sum + parseFloat(t.total_amount), 0))}
                    </p>
                </div>
                <div className="stat-card">
                    <h3>Total Item Terjual</h3>
                    <p className="stat-number">
                        {transactions.reduce((sum, t) => sum + t.total_items, 0)}
                    </p>
                </div>
            </div>

            <div className="transactions-table">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Kode Transaksi</th>
                            <th>Tanggal</th>
                            <th>Pembeli</th>
                            <th>Email</th>
                            <th>Total Item</th>
                            <th>Total Harga</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map((trx, index) => (
                                <tr key={trx.id}>
                                    <td>{index + 1}</td>
                                    <td className="trx-code">{trx.transaction_code}</td>
                                    <td>{formatDate(trx.created_at)}</td>
                                    <td>{trx.user_name}</td>
                                    <td>{trx.user_email}</td>
                                    <td className="text-center">{trx.total_items}</td>
                                    <td className="price">Rp {formatPrice(trx.total_amount)}</td>
                                    <td>
                                        <button 
                                            className="view-btn"
                                            onClick={() => viewTransactionDetail(trx)}
                                        >
                                            👁️ Detail
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="no-data">
                                    Belum ada transaksi
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL DETAIL TRANSAKSI */}
            {showDetailModal && selectedTransaction && (
                <div className="modal-overlay">
                    <div className="modal-content transaction-modal">
                        <h3>📄 Detail Transaksi</h3>
                        
                        <div className="transaction-info">
                            <div className="info-row">
                                <span className="info-label">Kode Transaksi:</span>
                                <span className="info-value trx-code">{selectedTransaction.transaction_code}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Tanggal:</span>
                                <span className="info-value">{formatDate(selectedTransaction.created_at)}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Pembeli:</span>
                                <span className="info-value">{selectedTransaction.user_name}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{selectedTransaction.user_email}</span>
                            </div>
                        </div>

                        <h4>Item yang Dibeli:</h4>
                        <div className="transaction-items">
                            {selectedTransaction.items && selectedTransaction.items.length > 0 ? (
                                selectedTransaction.items.map((item, idx) => (
                                    <div key={idx} className="transaction-item">
                                        <div className="item-name">{item.title} x{item.quantity}</div>
                                        <div className="item-subtotal">Rp {formatPrice(item.subtotal)}</div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-items">Tidak ada detail item</p>
                            )}
                        </div>

                        <div className="transaction-total">
                            <span>Total:</span>
                            <span className="total-price">Rp {formatPrice(selectedTransaction.total_amount)}</span>
                        </div>

                        <div className="modal-actions">
                            <button 
                                className="close-btn"
                                onClick={() => setShowDetailModal(false)}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TransactionsHistory;