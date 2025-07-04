import Navbar from "./Navbar";
import Footer from "./Footer";
import "@/look/styles/layout.css";
import { DEFAULT_LOCALE } from "@/look/constants";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body>
        <div className="layout-root">
          <Navbar />
          <main className="layout-main">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}