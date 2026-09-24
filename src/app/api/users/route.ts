import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  role: z.string(),
  phone: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = userSchema.parse(body);

    const user = await prisma.user.create({
      data: {
        email: data.email.trim().toLowerCase(),
        name: data.name,
        role: data.role as any,
        phone: data.phone,
        isActive: true,
      },
    });

    return NextResponse.json({ message: "تم إنشاء المستخدم بنجاح", user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    console.error("POST /api/users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
