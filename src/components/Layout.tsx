import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import { VipProvider } from "@/context/VipContext";
import { SocialPopup } from "@/components/SocialPopup";

export default function Layout() {
  return (
    <VipProvider>
      <div className="flex flex-col min-h-screen" style={{ background: '#F8F4EF' }}>
        <Header />
        {/* pb-[90px] on mobile keeps content above the floating tab bar (bar height + 12px gap + safe area) */}
        <main className="flex-1 pb-[90px] md:pb-0">
          <Outlet />
        </main>
        <Footer />
        <BottomTabBar />
        <SocialPopup />
      </div>
    </VipProvider>
  );
}
