import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import HeaderNav from "../components/HeaderNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "TradeBoard — Service Request Board",
  description: "Post and find local trade service requests",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#F4F3EF] font-sans">
        <AuthProvider>
          <HeaderNav />
          <main className="max-w-5xl mx-auto px-5 py-10">{children}</main>
          <footer className="border-t border-stone-200 mt-16 py-6 text-center text-sm text-stone-400">
            TradeBoard &copy; {new Date().getFullYear()} — Connecting trades with people who need them
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}