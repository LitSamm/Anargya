'use server'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import type { Product } from '@/types'
import fs from 'fs'
import path from 'path'
import os from 'os'
import defaultProducts from '@/data/products.json'

export interface CreateProductInput {
  name: string
  category: string
  price: number
  originalPrice?: number
  stock: number
  description?: string
  imageUrl?: string
  badge?: string
  sizes?: string[]
  inStock?: boolean
}

export interface UpdateProductInput {
  name?: string
  category?: string
  price?: number
  originalPrice?: number
  stock?: number
  description?: string
  imageUrl?: string
  badge?: string
  sizes?: string[]
  inStock?: boolean
}

type ProductRow = {
  id: string
  name: string
  category: string
  price: number
  originalPrice: number | null
  stock: number
  description: string | null
  imageUrl: string | null
  badge: string | null
  sizes: string | null
  rating: number
  reviewsCount: number
  inStock: boolean
}

const LOCAL_PRODUCTS_PATH = path.join(process.cwd(), 'src', 'data', 'products.json')
const TMP_PRODUCTS_PATH = path.join(os.tmpdir(), 'anargya_products.json')

let memoryProducts: Product[] | null = null

function readLocalProducts(): Product[] {
  // 1. Check temporary writable file (persists across serverless lambdas in /tmp)
  try {
    if (fs.existsSync(TMP_PRODUCTS_PATH)) {
      const data = fs.readFileSync(TMP_PRODUCTS_PATH, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {}

  // 2. Check local workspace file (local dev)
  try {
    if (fs.existsSync(LOCAL_PRODUCTS_PATH)) {
      const data = fs.readFileSync(LOCAL_PRODUCTS_PATH, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {}

  // 3. Fallback to memory or bundled default products
  if (memoryProducts && memoryProducts.length > 0) {
    return memoryProducts
  }

  return (defaultProducts as Product[]) || []
}

function writeLocalProducts(products: Product[]) {
  memoryProducts = [...products]
  try {
    fs.writeFileSync(LOCAL_PRODUCTS_PATH, JSON.stringify(products, null, 2), 'utf-8')
  } catch {
    // In serverless environments (EROFS), write to writable /tmp
    try {
      fs.writeFileSync(TMP_PRODUCTS_PATH, JSON.stringify(products, null, 2), 'utf-8')
    } catch (err) {
      console.error('Failed writing tmp products JSON:', err)
    }
  }
}

function safeRevalidate(pathStr: string) {
  try {
    revalidatePath(pathStr)
  } catch {}
}

function toProduct(row: ProductRow): Product {
  return {
    ...row,
    description: row.description ?? '',
    category: row.category as Product['category'],
    badge: (row.badge ?? undefined) as Product['badge'],
    originalPrice: row.originalPrice ?? undefined,
    image: row.imageUrl || '',
    sizes: row.sizes ? row.sizes.split(',').filter(Boolean) : undefined,
  }
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: products.map(toProduct) }
  } catch {
    // If DB is unreachable, fall back to persistent local storage
    const local = readLocalProducts()
    return { success: true, data: local }
  }
}

export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({ where: { id } })
    if (product) return { success: true, data: toProduct(product) }
  } catch {
    // Fall back to local products
  }

  const local = readLocalProducts()
  const found = local.find((p) => p.id === id)
  if (found) return { success: true, data: found }
  return { success: false, error: 'Product not found' }
}

export async function createProduct(input: CreateProductInput) {
  const admin = await requireAdmin()
  if (!admin.ok) return { success: false, error: admin.error }

  try {
    const product = await prisma.product.create({
      data: {
        name: input.name,
        category: input.category,
        price: input.price,
        originalPrice: input.originalPrice,
        stock: input.stock,
        description: input.description,
        imageUrl: input.imageUrl,
        badge: input.badge,
        sizes: input.sizes && input.sizes.length > 0 ? input.sizes.join(',') : null,
        inStock: input.inStock ?? input.stock > 0,
      },
    })
    safeRevalidate('/store')
    safeRevalidate('/admin')
    return { success: true, data: toProduct(product) }
  } catch {
    // Save to local products store
    const local = readLocalProducts()
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: input.name,
      category: input.category as Product['category'],
      price: input.price,
      originalPrice: input.originalPrice,
      stock: input.stock,
      description: input.description ?? '',
      image: input.imageUrl || '/images/Tee.webp',
      badge: input.badge as Product['badge'],
      sizes: input.sizes,
      inStock: input.inStock ?? input.stock > 0,
      rating: 5.0,
      reviewsCount: 0,
    }
    local.unshift(newProduct)
    writeLocalProducts(local)
    safeRevalidate('/store')
    safeRevalidate('/admin')
    return { success: true, data: newProduct }
  }
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const admin = await requireAdmin()
  if (!admin.ok) return { success: false, error: admin.error }

  try {
    const dataToUpdate: Record<string, unknown> = { ...input }
    if (input.sizes !== undefined) {
      dataToUpdate.sizes = input.sizes.length > 0 ? input.sizes.join(',') : null
    }

    const product = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
    })
    safeRevalidate('/store')
    safeRevalidate('/admin')
    return { success: true, data: toProduct(product) }
  } catch {
    const local = readLocalProducts()
    const index = local.findIndex((p) => p.id === id)
    if (index !== -1) {
      local[index] = {
        ...local[index],
        ...input,
        image: input.imageUrl ?? local[index].image,
        category: (input.category as Product['category']) ?? local[index].category,
        badge: (input.badge as Product['badge']) ?? local[index].badge,
      }
      writeLocalProducts(local)
      safeRevalidate('/store')
      safeRevalidate('/admin')
      return { success: true, data: local[index] }
    }
    return { success: false, error: 'Product not found' }
  }
}

export async function deleteProduct(id: string) {
  const admin = await requireAdmin()
  if (!admin.ok) return { success: false, error: admin.error }

  try {
    await prisma.product.delete({ where: { id } })
    safeRevalidate('/store')
    safeRevalidate('/admin')
    return { success: true }
  } catch {
    const local = readLocalProducts()
    const filtered = local.filter((p) => p.id !== id)
    writeLocalProducts(filtered)
    safeRevalidate('/store')
    safeRevalidate('/admin')
    return { success: true }
  }
}
