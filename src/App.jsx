import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UsersManagement from './pages/UsersManagement';
import ProductManagement from './pages/ProductManagement';
import ProductDetail from './pages/ProductDetail'; // <-- TAMBAH IMPORT

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UsersManagement />} />
                <Route path="/products" element={<ProductManagement />} />
                <Route path="/product/:id" element={<ProductDetail />} /> {/* <-- TAMBAH RUTE INI */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;