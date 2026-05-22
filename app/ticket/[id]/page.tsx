import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import TicketClient from './TicketClient'

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const ticket = await prisma.ticket.findUnique({
    where: { id: resolvedParams.id },
    include: { event: true }
  })

  if (!ticket) notFound()

  return <TicketClient ticket={ticket} event={ticket.event} />
}