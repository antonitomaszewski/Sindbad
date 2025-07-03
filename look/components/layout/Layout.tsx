import Navbar from "./Navbar";
import Footer from "./Footer";
import "@/styles/layout.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-root">
      <Navbar />
      <main className="layout-main">
        {children}
      </main>
      <Footer />
    </div>
  );
}