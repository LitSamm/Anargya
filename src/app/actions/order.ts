'use server'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'

export interface CreateOrderInput {
  orderNumber?: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress?: string
  courier?: string
  paymentMethod?: string
  totalAmount: number
  items: {
    productId: string
    productName: string
    productPrice: number
    productImage?: string
    selectedSize?: string
    quantity: number
  }[]
}

export type StoredOrderItem = {
  id: string
  orderId: string
  productId: string
  productName: string
  productPrice: number
  productImage: string | null
  selectedSize: string | null
  quantity: number
  createdAt: Date
}

export type StoredOrder = {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  shippingAddress: string | null
  courier: string | null
  paymentMethod: string | null
  totalAmount: number
  status: string
  createdAt: Date
  updatedAt: Date
  items: StoredOrderItem[]
}

const LOCAL_ORDERS_PATH = path.join(process.cwd(), 'src', 'data', 'orders.json')

function readLocalOrders(): StoredOrder[] {
  try {
    if (fs.existsSync(LOCAL_ORDERS_PATH)) {
      const data = fs.readFileSync(LOCAL_ORDERS_PATH, 'utf-8')
      const parsed = JSON.parse(data)
      return parsed.map((o: any) => ({
        ...o,
        createdAt: new Date(o.createdAt),
        updatedAt: new Date(o.updatedAt),
        items: (o.items || []).map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt || o.createdAt),
        })),
      }))
    }
  } catch (err) {
    console.error('Failed reading local orders JSON:', err)
  }
  return []
}

function writeLocalOrders(orders: StoredOrder[]) {
  try {
    fs.writeFileSync(LOCAL_ORDERS_PATH, JSON.stringify(orders, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed writing local orders JSON:', err)
  }
}

function safeRevalidate(pathStr: string) {
  try {
    revalidatePath(pathStr)
  } catch {}
}

export type CreateOrderResult =
  | { success: true; data: StoredOrder; error?: never }
  | { success: false; error: string; data?: never }

export async function createOrder(data: CreateOrderInput): Promise<CreateOrderResult> {
  const orderNumber =
    data.orderNumber ||
    `ARG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`

  try {
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        courier: data.courier,
        paymentMethod: data.paymentMethod,
        totalAmount: data.totalAmount,
        status: 'Pending',
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productPrice: item.productPrice,
            productImage: item.productImage,
            selectedSize: item.selectedSize,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    })

    safeRevalidate('/admin')
    return { success: true, data: order }
  } catch (error: any) {
    try {
      // If PostgreSQL is unreachable or fails credentials, fall back to persistent local storage
      const local = readLocalOrders()
      const orderId = `ord-${Date.now()}`
      const now = new Date()

      const newOrder: StoredOrder = {
        id: orderId,
        orderNumber,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone ?? null,
        shippingAddress: data.shippingAddress ?? null,
        courier: data.courier ?? null,
        paymentMethod: data.paymentMethod ?? null,
        totalAmount: data.totalAmount,
        status: 'Pending',
        createdAt: now,
        updatedAt: now,
        items: data.items.map((item, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          orderId,
          productId: item.productId,
          productName: item.productName,
          productPrice: item.productPrice,
          productImage: item.productImage ?? null,
          selectedSize: item.selectedSize ?? null,
          quantity: item.quantity,
          createdAt: now,
        })),
      }

      local.unshift(newOrder)
      writeLocalOrders(local)
      safeRevalidate('/admin')
      return { success: true, data: newOrder }
    } catch (fallbackError: any) {
      console.error('Failed creating order in fallback:', fallbackError)
      return {
        success: false,
        error: fallbackError?.message || error?.message || 'Failed to create order',
      }
    }
  }
}

export async function getOrders() {
  const admin = await requireAdmin()
  if (!admin.ok) return { success: false, error: admin.error }

  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: orders }
  } catch {
    const local = readLocalOrders()
    return { success: true, data: local }
  }
}

export async function updateOrderStatus(id: string, status: string) {
  const admin = await requireAdmin()
  if (!admin.ok) return { success: false, error: admin.error }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    })
    safeRevalidate('/admin')
    return { success: true, data: order }
  } catch {
    const local = readLocalOrders()
    const index = local.findIndex((o) => o.id === id)
    if (index !== -1) {
      local[index].status = status
      local[index].updatedAt = new Date()
      writeLocalOrders(local)
      safeRevalidate('/admin')
      return { success: true, data: local[index] }
    }
    return { success: false, error: 'Order not found' }
  }
}

export async function deleteOrder(id: string) {
  const admin = await requireAdmin()
  if (!admin.ok) return { success: false, error: admin.error }

  try {
    await prisma.order.delete({ where: { id } })
    safeRevalidate('/admin')
    return { success: true }
  } catch {
    const local = readLocalOrders()
    const filtered = local.filter((o) => o.id !== id)
    writeLocalOrders(filtered)
    safeRevalidate('/admin')
    return { success: true }
  }
}
