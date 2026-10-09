import { NextResponse } from 'next/server';
import { initDuckDb, query } from '@/lib/duckdb';
import { Product } from '@/types';

interface ProductDbRow {
  id: string;
  name: string;
  category: Product['category'];
  price: number;
  original_price: number | null;
  stock: number;
  description: string | null;
  image_url: string | null;
  badge: Product['badge'] | null;
  sizes: string | null;
  rating: number | null;
  reviews_count: number | null;
  in_stock: boolean;
}

export async function GET() {
  try {
    await initDuckDb();

    const rows = await query<ProductDbRow>(
      'SELECT id, name, category, price, original_price, stock, description, image_url, badge, sizes, rating, reviews_count, in_stock FROM products ORDER BY created_at DESC'
    );

    const products: Product[] = rows.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      price: row.price,
      originalPrice: row.original_price ?? undefined,
      stock: row.stock,
      description: row.description ?? '',
      image: row.image_url ?? '',
      badge: row.badge ?? undefined,
      sizes: row.sizes ? row.sizes.split(',') : undefined,
      rating: row.rating ?? 5.0,
      reviewsCount: row.reviews_count ?? 0,
      inStock: Boolean(row.in_stock),
    }));

    return NextResponse.json({ products });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed fetching products';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
