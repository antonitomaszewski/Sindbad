import Navbar from "./Navbar";
import Footer from "./Footer";
import { DEFAULT_LOCALE } from "@/look/constants";
import "@/look/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body>
        <div className="flex flex-col min-h-screen bg-white text-grey">
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}