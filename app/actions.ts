'use server'

import prisma from '../lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEvent(formData: FormData) {
  const name = formData.get('name') as string
  const date = formData.get('date') as string

  if (!name || !date) {
    throw new Error('Name and date are required')
  }

  await prisma.event.create({
    data: {
      name,
      date: new Date(date),
    },
  })

  revalidatePath('/')
}

// NEW: Delete an event and all its tickets
export async function deleteEvent(formData: FormData) {
  const eventId = formData.get('eventId') as string

  if (!eventId) throw new Error('Event ID is required')

  await prisma.event.delete({
    where: { id: eventId }
  })

  revalidatePath('/')
}

// UPDATED: Now accepts ownerName
export async function generateTicket(formData: FormData) {
  const eventId = formData.get('eventId') as string
  const ownerName = formData.get('ownerName') as string

  if (!eventId) {
    throw new Error('Event ID is required')
  }

  const ticket = await prisma.ticket.create({
    data: { 
      eventId,
      ownerName: ownerName || null // Save the name if provided
    },
  })
  
  redirect(`/ticket/${ticket.id}`)
}

export async function validateTicket(ticketId: string) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { event: true }
    })

    if (!ticket) return { success: false, message: 'INVALID TICKET: Not found' }
    if (ticket.isScanned) return { success: false, message: 'TICKET ALREADY USED' }

    await prisma.ticket.update({
      where: { id: ticketId },
      data: { isScanned: true, scannedAt: new Date() }
    })

    return { success: true, message: 'Access Granted' }
  } catch (error) {
    return { success: false, message: 'Server error processing ticket' }
  }

  
}
// NEW: Delete a specific ticket
export async function deleteTicket(formData: FormData) {
  const ticketId = formData.get('ticketId') as string
  const eventId = formData.get('eventId') as string

  if (!ticketId) throw new Error('Ticket ID is required')

  await prisma.ticket.delete({
    where: { id: ticketId }
  })

  // Instantly refresh the Event History page so the ticket disappears from the table
  revalidatePath(`/event/${eventId}`)
}