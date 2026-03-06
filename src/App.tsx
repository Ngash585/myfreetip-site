import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Layout from "@/components/Layout";

// Home loads eagerly — it is the most common landing page
import Home from "@/pages/Home";

// All other public pages are lazy-loaded — only fetched when the user navigates there
const Predictions      = lazy(() => import("@/pages/Predictions"));
const SportsNews       = lazy(() => import("@/pages/SportsNews"));
const SportsNewsArticle = lazy(() => import("@/pages/SportsNewsArticle"));
const About            = lazy(() => import("@/pages/About"));
const Contact          = lazy(() => import("@/pages/Contact"));
const Privacy          = lazy(() => import("@/pages/Privacy"));
const Terms            = lazy(() => import("@/pages/Terms"));

// Admin — separate lazy chunk; never loaded by public visitors
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
const AdminLogin     = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const TipsList       = lazy(() => import("@/pages/admin/tips/TipsList"));
const TipForm        = lazy(() => import("@/pages/admin/tips/TipForm"));
const NewsList       = lazy(() => import("@/pages/admin/news/NewsList"));
const NewsForm       = lazy(() => import("@/pages/admin/news/NewsForm"));
const StatsEditor    = lazy(() => import("@/pages/admin/stats/StatsEditor"));

export default function App() {
  return (
    <>
      <Analytics />
      <Suspense fallback={null}>
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
      </Suspense>
    </>
  );
}
