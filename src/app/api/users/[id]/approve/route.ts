import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: true },
    });
    return NextResponse.json({ message: "تم تفعيل المستخدم بنجاح", user: { id: user.id, email: user.email, isActive: user.isActive } });
  } catch (error) {
    console.error("Approve user error:", error);
    return NextResponse.json({ error: "فشل تفعيل المستخدم" }, { status: 500 });
  }
}
