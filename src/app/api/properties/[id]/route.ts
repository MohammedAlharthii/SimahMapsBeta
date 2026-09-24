import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        documents: true,
        owner: {
          select: { id: true, name: true, phone: true, email: true },
        },
        project: true,
        createdBy: {
          select: { id: true, name: true, phone: true },
        },
      },
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error("GET /api/properties/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();
    const property = await prisma.property.update({
      where: { id },
      data: body,
      include: { images: true },
    });
    return NextResponse.json({ message: "Property updated successfully", property });
  } catch (error) {
    console.error("PUT /api/properties/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await prisma.property.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return NextResponse.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/properties/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
