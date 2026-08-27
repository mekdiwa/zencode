import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { productId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' }, { status: 401 });
    }

    const products: Record<string, { name: string; price: number; downloadLink: string }> = {
      "1": { name: "Fullstack Web Dashboard V2", price: 350, downloadLink: "https://mek.store/download/script-v2.zip" },
      "2": { name: "Discord Auto-Manage Bot", price: 290, downloadLink: "https://mek.store/download/bot-discord.zip" },
      "3": { name: "File & Image Optimizer Suite", price: 199, downloadLink: "https://mek.store/download/optimizer.zip" }
    };

    const product = products[productId];
    if (!product) {
      return NextResponse.json({ success: false, message: 'ไม่พบรายการสินค้านี้' }, { status: 404 });
    }

    // ดึงยอดเงินจริงจาก Supabase
    const { data: profile } = await supabase.from('profiles').select('balance').eq('id', userId).single();
    const currentBalance = profile ? Number(profile.balance) : 0;

    if (currentBalance < product.price) {
      return NextResponse.json({ success: false, message: 'ยอดเงินคงเหลือไม่พอ กรุณาเติมเงินก่อนสั่งซื้อ' }, { status: 400 });
    }

    const newBalance = currentBalance - product.price;

    // 1. ตัดยอดเงินผู้ใช้ใน Supabase
    await supabase.from('profiles').update({ balance: newBalance }).eq('id', userId);

    // 2. บันทึกคำสั่งซื้อใน DB
    await supabase.from('orders').insert({
      user_id: userId,
      product_id: productId,
      product_name: product.name,
      amount: product.price,
      download_link: product.downloadLink
    });

    return NextResponse.json({
      success: true,
      message: `สั่งซื้อ ${product.name} สำเร็จ!`,
      downloadLink: product.downloadLink,
      newBalance: newBalance
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดในการทำรายการ' }, { status: 500 });
  }
}
