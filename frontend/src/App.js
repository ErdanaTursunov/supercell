import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LayoutBrawlStars from './pages/LayoutBrawlStars';
import LayoutClashOfClans from './pages/LayoutClashOfClans';
import LayoutClashRoyale from './pages/LayoutClashRoyale';
import Header_Store from './components/Header_Store';
import Footer from './components/Footer';
import BrawlStarsAllNews from './pages/BrawlStarsAllNews';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminNewsPage from './admin_panel/adminPages/AdminNewsPage';
import AdminDashboard from './admin_panel/adminPages/AdminDashboard'; // Import for main admin panel
import withAuth from './WithAuth/WithAuth';
import ClashOfClans from './admin_panel/adminPages/ClashOfClans';
import ClashRoyale from './admin_panel/adminPages/ClashRoyale';
import GameItemsManagement from './admin_panel/adminPages/BrawlStars';
import Profile from './pages/Profile';
import PaymentPage from './pages/PaymentPage';

function App() {
  return (
    <>
      {/* Main routes */}
      <Routes>
        {/* Home page: header + button + Home + footer */}
        <Route
          path="/"
          element={
            <>
              <Header_Store />
              <Home />
              <Footer />
            </>
          }
        />

        {/* Other pages: Layout + footer (individual headers inside Layout) */}
        <Route
          path="/brawl-stars/*"
          element={
            <>
              <LayoutBrawlStars />
              <Footer />
            </>
          }
        />

        <Route
          path="/clash-of-clans/*"
          element={
            <>
              <LayoutClashOfClans />
              <Footer />
            </>
          }
        />

        <Route
          path="/clash-royale/*"
          element={
            <>
              <LayoutClashRoyale />
              <Footer />
            </>
          }
        />

        <Route path="/allnews" element={<BrawlStarsAllNews />} />

        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/profile"
          element={
            <>
              <Header_Store />
              <Profile />
              <Footer />
            </>
          }
        />

        <Route
          path="/checkout"
          element={
            <>
              <Header_Store />
              <PaymentPage />
              <Footer />
            </>
          }
        />

        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </>
  );
}

// Separate component for admin routes with authentication
function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedAdminDashboard />} />
      <Route path="/news" element={<ProtectedAdminNewsPage />} />
      <Route path="/BrawlStars" element={<ProtectedAdminBrawlStarsPage />} />
      <Route path="/ClashOfClans" element={<ProtectedAdminClashOfClansPage />} />
      <Route path="/ClashRoyale" element={<ProtectedAdminClashRoyalePage />} />
    </Routes>
  );
}

// Protected components using withAuth HOC
const ProtectedAdminDashboard = withAuth(AdminDashboard, ['admin']);
const ProtectedAdminNewsPage = withAuth(AdminNewsPage, ['admin']);

const ProtectedAdminBrawlStarsPage = withAuth(GameItemsManagement, ['admin']);
const ProtectedAdminClashOfClansPage = withAuth(ClashOfClans, ['admin']);
const ProtectedAdminClashRoyalePage = withAuth(ClashRoyale, ['admin']);

export default App;