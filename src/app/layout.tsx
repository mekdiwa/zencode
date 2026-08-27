import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEK.store - คลังสคริปต์และซอฟต์แวร์ระบบสมาชิกเต็มรูปแบบ",
  description: "ระบบร้านค้าขายสคริปต์ ล็อกอิน เติมเงิน TrueWallet ซื้อและดาวน์โหลดได้ทันที",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="dark">
      <body className="min-h-screen flex flex-col justify-between bg-zinc-950 text-zinc-100">
        {children}
      </body>
    </html>
  );
}
