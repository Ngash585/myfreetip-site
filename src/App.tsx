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
    </Routes>
  );
}