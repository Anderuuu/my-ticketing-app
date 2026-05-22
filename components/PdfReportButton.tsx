'use client'

import { FileDown } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'

export default function PdfReportButton({ event, tickets }: { event: any, tickets: any[] }) {
  const [isGenerating, setIsGenerating] = useState(false)
  
  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      // Lazy-load to prevent Next.js from hanging on page load
      const jsPDF = (await import('jspdf')).default
      const autoTable = (await import('jspdf-autotable')).default

      const doc = new jsPDF()
      
      const scannedCount = tickets.filter(t => t.isScanned).length
      const totalCount = tickets.length

      // Header
      doc.setFontSize(22)
      doc.text(`Event Report: ${event.name}`, 14, 20)
      doc.setFontSize(12)
      doc.text(`Date: ${format(new Date(event.date), 'PPP p')}`, 14, 30)
      
      // Stats Summary
      doc.setFontSize(14)
      doc.setTextColor(0, 102, 204)
      doc.text(`Total Tickets: ${totalCount}`, 14, 45)
      doc.setTextColor(0, 153, 51)
      doc.text(`Successfully Scanned: ${scannedCount}`, 14, 52)
      doc.setTextColor(204, 0, 0)
      doc.text(`Unscanned / Pending: ${totalCount - scannedCount}`, 14, 59)

      // 1. ADD THE OWNER NAME TO THE ROW DATA
      const tableData = tickets.map((ticket, index) => [
        index + 1,
        ticket.ownerName ? ticket.ownerName : 'Anonymous', // Fallback if no name
        ticket.id.split('-')[0], // Shortened ID for the PDF
        ticket.isScanned ? 'Used' : 'Pending',
        ticket.scannedAt ? format(new Date(ticket.scannedAt), 'MMM dd, h:mm:ss a') : '-'
      ])

      autoTable(doc, {
        startY: 70,
        // 2. ADD "Owner Name" TO THE PDF TABLE HEADERS
        head: [['#', 'Owner Name', 'Ticket ID', 'Status', 'Time Scanned']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59] },
        willDrawCell: (data) => {
          // Color logic for the "Status" column (Column index 3)
          if (data.section === 'body' && data.column.index === 3) {
            if (data.cell.raw === 'Used') doc.setTextColor(0, 153, 51)
            else doc.setTextColor(204, 0, 0)
          }
        }
      })

      doc.save(`${event.name.replace(/\s+/g, '-')}-Report.pdf`)
      
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      alert("Failed to generate PDF.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button 
      onClick={handleGeneratePDF}
      disabled={isGenerating}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition shadow-sm font-medium text-white
        ${isGenerating ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
    >
      <FileDown size={18} className={isGenerating ? 'animate-bounce' : ''} />
      {isGenerating ? 'Generating...' : 'Download PDF Report'}
    </button>
  )
}