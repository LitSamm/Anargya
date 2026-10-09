import { NextResponse } from 'next/server';
import { initDuckDb, run } from '@/lib/duckdb';
import { isRequestAuthenticatedAdmin } from '@/lib/auth';
import { Product } from '@/types';

export async function POST(request: Request) {
  try {
    const isAuth = isRequestAuthenticatedAdmin(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
    }

    await initDuckDb();

    const body = (await request.json()) as unknown;
    if (
      !body ||
      typeof body !== 'object' ||
      !('name' in body) ||
      !('category' in body) ||
      !('price' in body) ||
      typeof body.name !== 'string' ||
      typeof body.category !== 'string' ||
      typeof body.price !== 'number'
    ) {
      return NextResponse.json({ error: 'Valid name, category, and price are required' }, { status: 400 });
    }

    const id = 'prod-' + Date.now();
    const name = body.name;
    const category = body.category as Product['category'];
    const price = body.price;
    const originalPrice = 'originalPrice' in body && typeof body.originalPrice === 'number' ? body.originalPrice : null;
    const stock = 'stock' in body && typeof body.stock === 'number' ? body.stock : 0;
    const description = 'description' in body && typeof body.description === 'string' ? body.description : '';
    const image = 'image' in body && typeof body.image === 'string' ? body.image : '';
    const badge = 'badge' in body && typeof body.badge === 'string' ? body.badge : null;
    const sizes = 'sizes' in body && Array.isArray(body.sizes) ? body.sizes.join(',') : null;
    const inStock = stock > 0;

    await run(
      `INSERT INTO products (
        id, name, category, price, original_price, stock, description,
        image_url, badge, sizes, rating, reviews_count, in_stock
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        category,
        price,
        originalPrice,
        stock,
        description,
        image,
        badge,
        sizes,
        5.0,
        0,
        inStock,
      ]
    );

    const product: Product = {
      id,
      name,
      category,
      price,
      originalPrice: originalPrice ?? undefined,
      stock,
      description,
      image,
      badge: (badge as Product['badge']) ?? undefined,
      sizes: sizes ? sizes.split(',') : undefined,
      rating: 5.0,
      reviewsCount: 0,
      inStock,
    };

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed creating product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
