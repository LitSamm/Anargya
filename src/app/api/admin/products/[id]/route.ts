import { NextResponse } from 'next/server';
import { initDuckDb, run, query } from '@/lib/duckdb';
import { isRequestAuthenticatedAdmin } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = isRequestAuthenticatedAdmin(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
    }
    const { id } = await params;
    await initDuckDb();

    const body = (await request.json()) as Record<string, unknown>;
    
    // Check if product exists
    const existing = await query<{ id: string }>('SELECT id FROM products WHERE id = ?', [id]);
    if (!existing.length) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const name = typeof body.name === 'string' ? body.name : undefined;
    const category = typeof body.category === 'string' ? body.category : undefined;
    const price = typeof body.price === 'number' ? body.price : undefined;
    const originalPrice = typeof body.originalPrice === 'number' ? body.originalPrice : null;
    const stock = typeof body.stock === 'number' ? body.stock : undefined;
    const description = typeof body.description === 'string' ? body.description : undefined;
    const image = typeof body.image === 'string' ? body.image : undefined;
    const badge = typeof body.badge === 'string' ? body.badge : null;
    const sizes = Array.isArray(body.sizes) ? body.sizes.join(',') : null;
    const inStock = stock !== undefined ? stock > 0 : undefined;

    await run(
      `UPDATE products SET
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        price = COALESCE(?, price),
        original_price = ?,
        stock = COALESCE(?, stock),
        description = COALESCE(?, description),
        image_url = COALESCE(?, image_url),
        badge = ?,
        sizes = COALESCE(?, sizes),
        in_stock = COALESCE(?, in_stock),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        name ?? null,
        category ?? null,
        price ?? null,
        originalPrice,
        stock ?? null,
        description ?? null,
        image ?? null,
        badge,
        sizes,
        inStock ?? null,
        id,
      ]
    );

    return NextResponse.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed updating product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = isRequestAuthenticatedAdmin(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
    }

    const { id } = await params;
    await initDuckDb();

    await run('DELETE FROM products WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed deleting product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
