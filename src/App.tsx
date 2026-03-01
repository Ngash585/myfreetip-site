import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";

import Home from "@/pages/Home";
import Predictions from "@/pages/Predictions";
import SportsNews from "@/pages/SportsNews";
import SportsNewsArticle from "@/pages/SportsNewsArticle";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";

// Admin
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import TipsList from "@/pages/admin/tips/TipsList";
import TipForm from "@/pages/admin/tips/TipForm";
import NewsList from "@/pages/admin/news/NewsList";
import NewsForm from "@/pages/admin/news/NewsForm";
import StatsEditor from "@/pages/admin/stats/StatsEditor";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/sports-news" element={<SportsNews />} />
        <Route path="/sports-news/:slug" element={<SportsNewsArticle />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      {/* Admin — separate layout, no public header/footer */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="tips" element={<TipsList />} />
        <Route path="tips/new" element={<TipForm />} />
        <Route path="tips/:id" element={<TipForm />} />
        <Route path="news" element={<NewsList />} />
        <Route path="news/new" element={<NewsForm />} />
        <Route path="news/:id" element={<NewsForm />} />
        <Route path="stats" element={<StatsEditor />} />
      </Route>
    </Routes>
  );
}