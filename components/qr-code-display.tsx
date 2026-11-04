'use client'

import React, { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface QRCodeDisplayProps {
  data: string
  size?: number
}

export function QRCodeDisplay({ data, size = 200 }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, data, {
        errorCorrectionLevel: 'H',
        width: size,
        margin: 2,
        color: {
          dark: '#0a0e27',
          light: '#f5f7fa',
        },
      })
    }
  }, [data, size])

  return (
    <div className="flex items-center justify-center p-4 glassmorphism rounded-lg">
      <canvas
        ref={canvasRef}
        style={{
          filter: 'drop-shadow(0 0 16px rgba(220, 38, 38, 0.3))',
        }}
      />
    </div>
  )
}
