'use client'

import { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { toPng } from 'html-to-image'
import { Download } from 'lucide-react'
import { format } from 'date-fns'
import BackButton from '@/components/BackButton'

export default function TicketClient({ ticket, event }: { ticket: any, event: any }) {
  const ticketRef = useRef<HTMLDivElement>(null)

  const downloadTicket = async () => {
    if (!ticketRef.current) return
    try {
      const dataUrl = await toPng(ticketRef.current, { quality: 1, pixelRatio: 2 })
      const link = document.createElement('a')
      const fileName = ticket.ownerName ? `${event.name}-${ticket.ownerName}.png` : `${event.name}-Ticket.png`
      link.download = fileName.replace(/\s+/g, '-')
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to download image', err)
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 space-y-6">
      <BackButton />
      <div ref={ticketRef} className="bg-white w-full max-w-sm rounded-2xl shadow-xl border overflow-hidden">
        <div className="bg-zinc-900 p-6 text-center text-white">
          <h2 className="text-2xl font-bold truncate">{event.name}</h2>
          <p className="text-zinc-400 mt-2">{format(new Date(event.date), 'MMMM do, yyyy')}</p>
          <p className="text-zinc-400 text-sm">{format(new Date(event.date), 'h:mm a')}</p>
        </div>
        <div className="p-8 flex flex-col items-center bg-white">
          {ticket.ownerName && (
            <div className="mb-6 text-center border-b pb-4 w-full">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admit One</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{ticket.ownerName}</p>
            </div>
          )}
          <QRCodeSVG value={ticket.id} size={200} level="H" includeMargin={true} />
          <p className="mt-4 text-xs font-mono text-gray-400 break-all text-center">{ticket.id}</p>
        </div>
      </div>
      <button onClick={downloadTicket} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg">
        <Download size={20} /> Download Ticket
      </button>
    </div>
  )
}