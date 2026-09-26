import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { loadCustomCatalog, removeCustomProduct, saveCustomCatalog, upsertCustomProduct } from "@/lib/catalog-file";
import type { CatalogOverlay } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export const runtime = "nodejs";

const forbidden = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function GET() {
  return NextResponse.json(loadCustomCatalog());
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return forbidden();
  const body = (await request.json()) as { product?: Product };
  if (!body.product?.id || !body.product.name || !body.product.price) {
    return NextResponse.json({ error: "Name and price are required." }, { status: 400 });
  }
  if (!body.product.images?.length) {
    return NextResponse.json({ error: "Please upload at least one photo." }, { status: 400 });
  }
  return NextResponse.json(upsertCustomProduct(body.product));
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return forbidden();
  const body = (await request.json()) as Partial<CatalogOverlay> & { product?: Product };
  const data = loadCustomCatalog();
  if (body.product) {
    return NextResponse.json(upsertCustomProduct(body.product));
  }
  if (body.overrides) data.overrides = { ...data.overrides, ...body.overrides };
  if (body.custom) data.custom = body.custom;
  saveCustomCatalog(data);
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return forbidden();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  return NextResponse.json(removeCustomProduct(id));
}
