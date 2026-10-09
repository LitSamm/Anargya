'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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

export async function createOrder(data: CreateOrderInput) {
  try {
    const orderNumber = data.orderNumber || `ARG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
    
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
          }))
        }
      },
      include: {
        items: true
      }
    })

    revalidatePath('/admin')
    return { success: true, data: order }
  } catch (error: any) {
    console.error('Error creating order:', error)
    return { success: false, error: error?.message || 'Failed to create order' }
  }
}

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, data: orders }
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return { success: false, error: error?.message || 'Failed to fetch orders' }
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    })
    revalidatePath('/admin')
    return { success: true, data: order }
  } catch (error: any) {
    console.error('Error updating order:', error)
    return { success: false, error: error?.message || 'Failed to update order' }
  }
}

export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({
      where: { id }
    })
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting order:', error)
    return { success: false, error: error?.message || 'Failed to delete order' }
  }
}
