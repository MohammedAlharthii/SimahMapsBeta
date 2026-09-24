import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const propertyCreateSchema = z.object({
  title: z.string().min(1),
  titleAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  type: z.enum(["APARTMENT", "VILLA", "LAND", "OFFICE", "SHOP", "BUILDING", "WAREHOUSE", "FARM", "COMPOUND", "TOWER"]),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD", "RENTED", "UNDER_CONSTRUCTION", "OFF_MARKET"]).default("AVAILABLE"),
  purpose: z.enum(["SALE", "RENT", "INVESTMENT"]),
  price: z.number().positive(),
  priceNegotiable: z.boolean().default(false),
  area: z.number().positive(),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  floors: z.number().int().optional(),
  yearBuilt: z.number().int().optional(),
  furnished: z.boolean().default(false),
  amenities: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional(),
  addressAr: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  country: z.string().default("SA"),
  ownerId: z.string().optional(),
  createdById: z.string().optional(),
  images: z.array(z.object({ url: z.string(), alt: z.string().optional() })).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "12"));
    const skip = (page - 1) * limit;

    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const purpose = searchParams.get("purpose");
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");

    const where: any = {
      deletedAt: null,
    };

    if (type) where.type = type;
    if (status) where.status = status;
    if (purpose) where.purpose = purpose;
    if (city) where.city = { contains: city };

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { titleAr: { contains: search } },
        { address: { contains: search } },
        { city: { contains: search } },
        { district: { contains: search } },
      ];
    }

    const [total, properties] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          images: {
            orderBy: { order: "asc" },
          },
          owner: {
            select: { id: true, name: true, phone: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      properties,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/properties error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = propertyCreateSchema.parse(body);

    const { images, ...propertyData } = data;

    // Default creator if not provided
    let createdById = propertyData.createdById;
    if (!createdById) {
      const defaultUser = await prisma.user.findFirst();
      createdById = defaultUser?.id || "";
    }

    const property = await prisma.property.create({
      data: {
        ...propertyData,
        createdById: createdById!,
        amenities: propertyData.amenities ? propertyData.amenities : undefined,
        images: images && images.length > 0 ? {
          create: images.map((img, idx) => ({
            url: img.url,
            alt: img.alt || propertyData.title,
            order: idx + 1,
          })),
        } : undefined,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ message: "Property created successfully", property }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    console.error("POST /api/properties error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
