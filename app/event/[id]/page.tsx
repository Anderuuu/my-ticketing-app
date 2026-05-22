import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import BackButton from '@/components/BackButton'
import PdfReportButton from '@/components/PdfReportButton'
import { deleteTicket } from '@/app/actions'
import { format } from 'date-fns'
import { CheckCircle2, Clock, QrCode, Trash2 } from 'lucide-react'
import Link from 'next/link'
import TicketSearch from '@/components/TicketSearch'// New Component

export default async function EventHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const event = await prisma.event.findUnique({
    where: { id: resolvedParams.id },
    include: { tickets: { orderBy: { createdAt: 'desc' } } }
  })

  if (!event) notFound()

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
      <BackButton />
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{event.name}</h1>
            <p className="text-gray-500 mt-2">{format(new Date(event.date), 'PPP')}</p>
          </div>
          <PdfReportButton event={event} tickets={event.tickets} />
        </div>

        {/* This component handles the searching logic */}
        <TicketSearch tickets={event.tickets} eventId={event.id} />
      </div>
    </main>
  )
}