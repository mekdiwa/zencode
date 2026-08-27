'use client';

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ShoppingBag, Terminal, ShieldCheck, Zap, Code, Bot, Wallet, CreditCard, Download, CheckCircle, AlertCircle, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [voucherInput, setVoucherInput] = useState<string>("");
  const [topupStatus, setTopupStatus] = useState<{ type: 'success' | 'error' | ''; msg: string }>({ type: '', msg: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [purchasedLink, setPurchasedLink] = useState<{ name: string; url: string } | null>(null);

  // ตรวจสอบการล็อกอิน และดึงยอดเงินจาก Supabase DB
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchBalance(session.user.id);
      }
    };

    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchBalance(session.user.id);
      } else {
        setBalance(0);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchBalance = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('balance').eq('id', userId).single();
    if (data) {
      setBalance(Number(data.balance));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBalance(0);
  };

  const products = [
    {
      id: "1",
      title: "Fullstack Web Dashboard V2",
      description: "ระบบหลังบ้านมินิมอล รองรับระบบสมาชิก ชำระเงิน และการจัดการสิทธิ์",
      price: 350,
      category: "Web App",
      badge: "ยอดนิยม",
      icon: Code,
    },
    {
      id: "2",
      title: "Discord Auto-Manage Bot",
      description: "บอท Discord จัดการยศ แจ้งเตือนยอดขาย และเชื่อมต่อ Webhook อัตโนมัติ",
      price: 290,
      category: "Discord Bot",
      badge: "ขายดี",
      icon: Bot,
    },
    {
      id: "3",
      title: "File & Image Optimizer Suite",
      description: "ซอฟต์แวร์ช่วยบีบอัดรูปและจัดหมวดหมู่โค้ดอัตโนมัติ สำหรับนักพัฒนา",
      price: 199,
      category: "Software",
      badge: "มาใหม่",
      icon: Zap,
    },
  ];

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนทำการเติมเงิน");
      return;
    }
    if (!voucherInput) return;
    setLoading(true);
    setTopupStatus({ type: '', msg: '' });

    try {
      const res = await fetch('/api/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherUrl: voucherInput, userId: user.id })
      });
      const data = await res.json();

      if (data.success) {
        setBalance(data.newBalance);
        setTopupStatus({ type: 'success', msg: data.message });
        setVoucherInput("");
      } else {
        setTopupStatus({ type: 'error', msg: data.message });
      }
    } catch (err) {
      setTopupStatus({ type: 'error', msg: 'ทำรายการไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' });
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (productId: string) => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนสั่งซื้อสินค้า");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userId: user.id })
      });
      const data = await res.json();

      if (data.success) {
        setBalance(data.newBalance);
        setPurchasedLink({ name: data.message, url: data.downloadLink });
        alert(`${data.message}\nคลิกตกลงเพื่อรับลิงก์ดาวน์โหลด`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการซื้อสินค้า');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-wide">
              MEK<span className="text-blue-500">.store</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-zinc-400">เครดิต:</span>
                  <span className="text-sm font-bold text-blue-400">฿{balance}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white px-3 py-2 rounded-xl transition flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-xs bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 px-4 py-2 rounded-xl font-medium transition flex items-center gap-1">
                  <UserIcon className="w-3.5 h-3.5" /> เข้าสู่ระบบ
                </Link>
                <Link href="/register" className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-medium transition shadow-md shadow-blue-600/20">
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main App Container */}
      <main className="max-w-6xl mx-auto px-4 py-10 w-full flex-1">
        <div className="text-center py-6 mb-8">
          <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/20 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> ระบบสมาชิก + ฐานข้อมูล Supabase + ตัดเงินอัตโนมัติ 24 ชม.
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 text-zinc-100">
            MEK.store Fullstack Platform
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm">
            ระบบล็อกอิน สมัครสมาชิก เติมเงินด้วยซองอั่งเปา TrueWallet และสั่งซื้อสคริปต์สมบูรณ์แบบ
          </p>
        </div>

        {/* Topup Section */}
        <section id="topup" className="max-w-xl mx-auto bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 mb-12 shadow-xl">
          <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-100 mb-2">
            <CreditCard className="w-5 h-5 text-blue-500" /> ระบบเติมเงิน TrueWallet ซองอั่งเปา
          </h2>
          <p className="text-xs text-zinc-400 mb-4">
            {user ? "สร้างซองอั่งเปา TrueMoney แล้วนำลิงก์มาวางเพื่อเติมเครดิตเข้าสู่บัญชีของคุณ" : "กรุณาล็อกอินเข้าสู่ระบบก่อนทำการเติมเงิน"}
          </p>

          <form onSubmit={handleTopup} className="space-y-3">
            <input
              type="text"
              disabled={!user}
              placeholder={user ? "https://gift.truemoney.com/v1/?v=xxxxx" : "กรุณาเข้าสู่ระบบก่อนเติมเงิน"}
              value={voucherInput}
              onChange={(e) => setVoucherInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
              required
            />
            <button
              type="submit"
              disabled={loading || !user}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs transition disabled:opacity-50"
            >
              {loading ? "กำลังตรวจสอบ..." : "ยืนยันการเติมเงิน"}
            </button>
          </form>

          {topupStatus.msg && (
            <div className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 ${topupStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {topupStatus.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {topupStatus.msg}
            </div>
          )}
        </section>

        {/* Download Alert Area if Purchased */}
        {purchasedLink && (
          <div className="max-w-xl mx-auto mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-400 font-semibold">{purchasedLink.name}</p>
              <p className="text-[11px] text-zinc-400">ไฟล์พร้อมสำหรับการดาวน์โหลดแล้ว</p>
            </div>
            <a href={purchasedLink.url} target="_blank" className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition">
              <Download className="w-3.5 h-3.5" /> ดาวน์โหลดไฟล์
            </a>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition flex flex-col justify-between group">
                <div>
                  <div className="h-40 bg-zinc-900 flex items-center justify-center relative border-b border-zinc-800/60">
                    <Icon className="w-10 h-10 text-zinc-500 group-hover:scale-110 group-hover:text-blue-400 transition duration-300" />
                    <span className="absolute top-3 right-3 bg-blue-500/10 text-blue-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-500/20">
                      {item.badge}
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold">{item.category}</span>
                    <h3 className="font-bold text-base text-zinc-100 group-hover:text-blue-400 transition mt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-zinc-800/50 mt-2">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">ราคา</span>
                    <span className="text-base font-bold text-blue-400">฿{item.price}</span>
                  </div>
                  <button
                    onClick={() => handleBuy(item.id)}
                    disabled={loading}
                    className="flex items-center gap-1.5 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold text-xs px-3.5 py-2 rounded-xl transition disabled:opacity-50"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> ซื้อสินค้า
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
          <div>© 2026 MEK.store Fullstack Supabase Auth & DB.</div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-zinc-300">ข้อกำหนด</a>
            <a href="#" className="hover:text-zinc-300">นโยบาย</a>
          </div>
        </div>
      </footer>
    </>
  );
}
