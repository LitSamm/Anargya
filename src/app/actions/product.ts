'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    // Map to frontend-friendly structure
    const formatted = products.map((p) => ({
      ...p,
      image: p.imageUrl || '',
      sizes: p.sizes ? p.sizes.split(',').filter(Boolean) : [],
    }))

    return { success: true, data: formatted }
  } catch (error: any) {
    console.error('Failed to fetch products:', error)
    return { success: false, error: error?.message || 'Failed to fetch products' }
  }
}

export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    })
    if (!product) return { success: false, error: 'Product not found' }
    return {
      success: true,
      data: {
        ...product,
        image: product.imageUrl || '',
        sizes: product.sizes ? product.sizes.split(',').filter(Boolean) : [],
      }
    }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to fetch product' }
  }
}

export async function createProduct(input: CreateProductInput) {
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
      }
    })
    revalidatePath('/store')
    revalidatePath('/admin')
    return {
      success: true,
      data: {
        ...product,
        image: product.imageUrl || '',
        sizes: product.sizes ? product.sizes.split(',').filter(Boolean) : [],
      }
    }
  } catch (error: any) {
    console.error('Failed to create product:', error)
    return { success: false, error: error?.message || 'Failed to create product' }
  }
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  try {
    const dataToUpdate: any = { ...input }
    if (input.imageUrl !== undefined) {
      dataToUpdate.imageUrl = input.imageUrl
    }
    if (input.sizes !== undefined) {
      dataToUpdate.sizes = input.sizes && input.sizes.length > 0 ? input.sizes.join(',') : null
    }

    const product = await prisma.product.update({
      where: { id },
      data: dataToUpdate
    })
    revalidatePath('/store')
    revalidatePath('/admin')
    return {
      success: true,
      data: {
        ...product,
        image: product.imageUrl || '',
        sizes: product.sizes ? product.sizes.split(',').filter(Boolean) : [],
      }
    }
  } catch (error: any) {
    console.error('Failed to update product:', error)
    return { success: false, error: error?.message || 'Failed to update product' }
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    })
    revalidatePath('/store')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error('Failed to delete product:', error)
    return { success: false, error: error?.message || 'Failed to delete product' }
  }
}
