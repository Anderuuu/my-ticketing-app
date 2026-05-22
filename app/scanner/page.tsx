'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { validateTicket } from '@/app/actions'
import { CheckCircle2, XCircle, ScanLine, CameraOff } from 'lucide-react'
import BackButton from '@/components/BackButton'

type ScanResult = { success: boolean; message: string } | null

export default function ScannerKiosk() {
  const [result, setResult] = useState<ScanResult>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [permissionError, setPermissionError] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    const scanner = new Html5Qrcode("reader")
    scannerRef.current = scanner

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 300, height: 300 } },
          async (decodedText) => {
            if (isProcessing) return
            setIsProcessing(true)
            await scanner.pause(true) 
            const validation = await validateTicket(decodedText)
            setResult(validation)

            setTimeout(() => {
              setResult(null)
              setIsProcessing(false)
              if (scannerRef.current?.getState() === 2) { 
                scannerRef.current.resume()
              }
            }, 2500)
          },
          (error) => { /* ignore constant read errors */ }
        )
      } catch (err: any) {
        if (err?.name === 'NotAllowedError' || err?.message?.includes('Permission denied')) {
          setPermissionError(true)
        }
      }
    }

    startScanner()

    return () => {
      if (scanner.isScanning) {
        scanner.stop().catch(console.error)
      }
    }
  }, [isProcessing])

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <BackButton />

      {permissionError ? (
        <div className="flex flex-col items-center text-center text-white max-w-md p-6">
          <CameraOff size={64} className="text-red-500 mb-4" />
          <h2 className="text-3xl font-bold mb-2">Camera Blocked</h2>
          <p className="text-gray-400">
            Please allow camera access. If testing on mobile, ensure you are using a secure HTTPS connection or have allowed your IP in next.config.mjs.
          </p>
        </div>
      ) : (
        <>
          <div id="reader" className={`w-full h-full object-cover ${result ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}></div>
          {!result && (
            <div className="absolute bottom-12 flex flex-col items-center animate-pulse text-white drop-shadow-lg">
              <ScanLine size={48} className="mb-4 opacity-80" />
              <h2 className="text-2xl font-bold tracking-widest uppercase">Ready to Scan</h2>
            </div>
          )}
          {result && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-8 text-center animate-in fade-in zoom-in duration-200">
              {result.success ? <CheckCircle2 size={120} className="text-green-500 mb-6" /> : <XCircle size={120} className="text-red-500 mb-6" />}
              <h1 className={`text-5xl font-black uppercase tracking-tight ${result.success ? 'text-green-500' : 'text-red-500'}`}>
                {result.message}
              </h1>
            </div>
          )}
        </>
      )}
    </div>
  )
}