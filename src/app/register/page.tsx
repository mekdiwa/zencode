'use client';

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Terminal, Lock, Mail, UserPlus } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message || "ไม่สามารถสมัครสมาชิกได้");
      setLoading(false);
    } else {
      alert("สมัครสมาชิกสำเร็จ! สามารถเข้าสู่ระบบได้ทันที");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6 justify-center">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
            <Terminal className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-wide">
            MEK<span className="text-blue-500">.store</span>
          </span>
        </div>

        <h2 className="text-xl font-bold text-center mb-1 text-zinc-100">สมัครสมาชิกใหม่</h2>
        <p className="text-xs text-zinc-400 text-center mb-6">สร้างบัญชีเพื่อเข้าถึงคลังสคริปต์และระบบเติมเงิน</p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">อีเมล (Email)</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">รหัสผ่าน (Password)</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "กำลังสร้างบัญชี..." : <>สมัครสมาชิก <UserPlus className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-xs text-center text-zinc-400 mt-6">
          มีบัญชีผู้ใช้อยู่แล้ว?{" "}
          <Link href="/login" className="text-blue-400 hover:underline font-semibold">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
