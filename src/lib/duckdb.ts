import duckdb from 'duckdb';
import path from 'path';
import fs from 'fs';
import { INITIAL_PRODUCTS } from '../data/mockData';

// Ensure data directory exists
const DB_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'anargya.duckdb');

// Database singleton
let dbInstance: duckdb.Database | null = null;
let initialized = false;

function getDb(): duckdb.Database {
  if (!dbInstance) {
    dbInstance = new duckdb.Database(DB_PATH);
  }
  return dbInstance;
}

export function query<T = Record<string, unknown>>(
  sql: string,
  params: (string | number | boolean | null)[] = []
): Promise<T[]> {
  const db = getDb();
  const { promise, resolve, reject } = Promise.withResolvers<T[]>();
  db.all(sql, ...params, (err: Error | null, rows: duckdb.TableData) => {
    if (err) reject(err);
    else resolve(rows as unknown as T[]);
  });
  return promise;
}

export function run(
  sql: string,
  params: (string | number | boolean | null)[] = []
): Promise<void> {
  const db = getDb();
  const { promise, resolve, reject } = Promise.withResolvers<void>();
  db.run(sql, ...params, (err: Error | null) => {
    if (err) reject(err);
    else resolve();
  });
  return promise;
}

export async function initDuckDb(): Promise<void> {
  if (initialized) return;

  // Create products table
  await run(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      category VARCHAR NOT NULL,
      price DOUBLE NOT NULL,
      original_price DOUBLE,
      stock INTEGER NOT NULL DEFAULT 0,
      description TEXT,
      image_url TEXT,
      badge VARCHAR,
      sizes VARCHAR,
      rating DOUBLE DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 0,
      in_stock BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create orders table
  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR PRIMARY KEY,
      order_number VARCHAR UNIQUE,
      customer_name VARCHAR,
      customer_email VARCHAR,
      customer_phone VARCHAR,
      shipping_address TEXT,
      courier VARCHAR,
      payment_method VARCHAR,
      total_amount DOUBLE,
      status VARCHAR DEFAULT 'Pending',
      items_json TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if products exist; if empty, seed with INITIAL_PRODUCTS
  const rows = await query<{ count: number }>('SELECT count(*)::INT as count FROM products');
  if (rows && rows[0] && rows[0].count === 0) {
    for (const prod of INITIAL_PRODUCTS) {
      await run(
        `INSERT INTO products (
          id, name, category, price, original_price, stock, description,
          image_url, badge, sizes, rating, reviews_count, in_stock
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prod.id,
          prod.name,
          prod.category,
          prod.price,
          prod.originalPrice || null,
          prod.stock,
          prod.description,
          prod.image,
          prod.badge || null,
          prod.sizes ? prod.sizes.join(',') : null,
          prod.rating || 5.0,
          prod.reviewsCount || 0,
          prod.inStock ? true : false,
        ]
      );
    }
  }

  initialized = true;
}
