import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { voucherUrl, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' }, { status: 401 });
    }

    if (!voucherUrl) {
      return NextResponse.json({ success: false, message: 'กรุณากรอกลิงก์ซองอั่งเปา' }, { status: 400 });
    }

    const voucherCode = voucherUrl.split('v=')[1] || voucherUrl;

    // จำลองการตรวจสอบยิง API TrueWallet ซองอั่งเปา (ยึดตามยอดสุ่มหรือดึงตามจริง)
    const mockAmount = 100;

    // ดึงโปรไฟล์เดิมเพื่ออัปเดต balance
    const { data: profile } = await supabase.from('profiles').select('balance').eq('id', userId).single();
    const currentBalance = profile ? Number(profile.balance) : 0;
    const newBalance = currentBalance + mockAmount;

    // 1. อัปเดต Balance ใน Database Supabase
    await supabase.from('profiles').update({ balance: newBalance }).eq('id', userId);

    // 2. บันทึกประวัติการเติมเงิน
    await supabase.from('topups').insert({
      user_id: userId,
      amount: mockAmount,
      voucher_code: voucherCode
    });

    return NextResponse.json({
      success: true,
      message: `เติมเงินสำเร็จจำนวน ${mockAmount} บาท`,
      amount: mockAmount,
      newBalance: newBalance
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดในการเชื่อมต่อระบบเติมเงิน' }, { status: 500 });
  }
}
