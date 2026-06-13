import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.getAll("ids");

  if (!ids || ids.length === 0) {
    return NextResponse.json({ products: [] });
  }

  // Cap at 50 to prevent abuse
  const safeIds = ids.slice(0, 50);

  const products = await prisma.product.findMany({
    where: {
      id: { in: safeIds },
      isPublished: true,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      nameAr: true,
      price: true,
      images: {
        select: { url: true, isPrimary: true },
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
        take: 1,
      },
      artisan: { select: { shopName: true, slug: true } },
      category: { select: { name: true, nameAr: true } },
    },
  });

  return NextResponse.json({ products });
}
