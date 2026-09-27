import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ clients, total: clients.length });
  } catch (error) {
    console.error("GET /api/clients error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, budget, notes, status, source, preferredCity, preferredType } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "الاسم ورقم الجوال مطلوبان" }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        name,
        nameAr: name,
        phone,
        email: email || null,
        budget: budget ? Number(budget) : null,
        notes: notes || null,
        status: status || "NEW",
        source: source || "WEBSITE",
        preferredCity: preferredCity || "الرياض",
        preferredType: preferredType || undefined,
      },
    });

    return NextResponse.json({ message: "Client created successfully", client }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "رقم الجوال مسجل مسبقاً لعميل آخر" }, { status: 400 });
    }
    console.error("POST /api/clients error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
