import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UsersManagement from './pages/UsersManagement';
import ProductManagement from './pages/ProductManagement';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import TransactionsHistory from './pages/TransactionsHistory';

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<UsersManagement />} />
                    <Route path="/products" element={<ProductManagement />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/transactions" element={<TransactionsHistory />} />
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
}

export default App;