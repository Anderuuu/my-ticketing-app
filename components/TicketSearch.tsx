'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, QrCode, Trash2, Search } from 'lucide-react'
import Link from 'next/link'
import { deleteTicket } from '@/app/actions'
import { format } from 'date-fns'

export default function TicketSearch({ tickets, eventId }: { tickets: any[], eventId: string }) {
  const [search, setSearch] = useState('')

  const filtered = tickets.filter(t => 
    t.ownerName?.toLowerCase().includes(search.toLowerCase()) || 
    t.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Tickets</h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or ID..."
            className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-sm border-b">
            <th className="p-4">Status</th>
            <th className="p-4">Owner Name</th>
            <th className="p-4">Ticket ID</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filtered.map(ticket => (
            <tr key={ticket.id} className="hover:bg-gray-50">
              <td className="p-4">
                {ticket.isScanned ? (
                  <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-bold">USED</span>
                ) : (
                  <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-bold">PENDING</span>
                )}
              </td>
              <td className="p-4 font-medium">{ticket.ownerName || 'Anonymous'}</td>
              <td className="p-4 font-mono text-sm">{ticket.id.split('-')[0]}...</td>
              <td className="p-4 text-right flex justify-end gap-2">
                <Link href={`/ticket/${ticket.id}`} className="text-blue-600 bg-blue-50 p-2 rounded-lg"><QrCode size={16}/></Link>
                <form action={deleteTicket}>
                  <input type="hidden" name="ticketId" value={ticket.id} />
                  <input type="hidden" name="eventId" value={eventId} />
                  <button type="submit" className="text-red-500 bg-red-50 p-2 rounded-lg"><Trash2 size={16}/></button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}