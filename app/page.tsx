import prisma from '@/lib/prisma'
import { generateTicket, deleteEvent } from '@/app/actions'
import { format } from 'date-fns'
import Link from 'next/link'
import BackButton from '@/components/BackButton'
import CreateEventForm from '@/components/CreateEventsForm'
import { Calendar, TicketIcon, Trash2 } from 'lucide-react'
import { Event } from '@prisma/client'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { tickets: true } } }
  })

  return (
    <main className="min-h-screen max-w-5xl mx-auto p-6 pt-12 space-y-8 bg-gray-50">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Event Dashboard</h1>
        <Link href="/scanner" className="bg-zinc-900 text-white px-5 py-2.5 rounded-lg hover:bg-zinc-800 transition font-medium">
          Open Scanner
        </Link>
      </div>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Create New Event</h2>
        <CreateEventForm />
      </section>

      <section className="space-y-4">
        {events.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No events created yet.</p>
        ) : (
          events.map((event) => (
    <div key={event.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-blue-300 transition gap-4">
              
              <Link href={`/event/${event.id}`} className="flex-1 block group">
                <h3 className="text-xl font-bold group-hover:text-blue-600 transition text-gray-900">{event.name}</h3>
                <div className="flex items-center gap-6 text-sm text-gray-500 mt-2 font-medium">
                  <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <Calendar size={16} className="text-gray-400" /> 
                    {format(event.date, 'PPP p')}
                  </span>
                  <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <TicketIcon size={16} className="text-gray-400" /> 
                    {event._count.tickets} Tickets
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-3">
                <form action={deleteEvent}>
                  <input type="hidden" name="eventId" value={event.id} />
                  <button type="submit" className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete Event">
                    <Trash2 size={20} />
                  </button>
                </form>

                <form action={generateTicket} className="flex items-center gap-2">
                  <input type="hidden" name="eventId" value={event.id} />
                  <input type="text" name="ownerName" placeholder="Holder Name (Optional)" className="border rounded-md p-2 text-sm w-48" />
                  <button type="submit" className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition font-medium whitespace-nowrap">
                    Generate
                  </button>
                </form>
              </div>

            </div>
          ))
        )}
      </section>
    </main>
  )
}