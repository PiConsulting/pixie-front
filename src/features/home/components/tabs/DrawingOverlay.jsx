const WHEEL_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
]
const SEGMENTS = 8

const DrawingOverlay = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60">
    <style>{`
      @keyframes wheelSpin {
        from { transform: rotate(0deg) }
        to   { transform: rotate(360deg) }
      }
      @keyframes pointerWiggle {
        0%, 100% { transform: translateX(-50%) rotate(-20deg) }
        50%       { transform: translateX(-50%) rotate(20deg) }
      }
      @keyframes dotPulse {
        0%, 80%, 100% { opacity: 0.3; transform: scale(0.75) }
        40%           { opacity: 1;   transform: scale(1.3)  }
      }
    `}</style>

    {/* Ruleta */}
    <div className="relative" style={{width: 220, height: 220}}>
      {/* Puntero arriba */}
      <div
        className="absolute top-0 left-1/2 z-10"
        style={{
          width: 0,
          height: 0,
          borderLeft: '14px solid transparent',
          borderRight: '14px solid transparent',
          borderTop: '28px solid #fbbf24',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
          animation: 'pointerWiggle 0.25s ease-in-out infinite',
          transformOrigin: 'top center',
        }}
      />

      {/* Rueda que gira */}
      <div
        className="rounded-full overflow-hidden border-4 border-white shadow-2xl"
        style={{
          width: 220,
          height: 220,
          background: `conic-gradient(${WHEEL_COLORS.map(
            (c, i) => `${c} ${(i / SEGMENTS) * 360}deg ${((i + 1) / SEGMENTS) * 360}deg`,
          ).join(', ')})`,
          animation: 'wheelSpin 0.45s linear infinite',
        }}
      >
        {/* Líneas divisorias */}
        {Array.from({length: SEGMENTS}).map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 origin-left"
            style={{
              width: '50%',
              height: 2,
              background: 'rgba(255,255,255,0.4)',
              transform: `rotate(${(i / SEGMENTS) * 360}deg)`,
            }}
          />
        ))}
      </div>

      {/* Centro */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg"
        style={{width: 40, height: 40}}
      />
    </div>

    {/* Texto */}
    <p className="mt-7 text-white text-2xl font-bold tracking-wide flex items-center gap-0.5">
      Sorteando
      <span style={{animation: 'dotPulse 1s ease-in-out infinite', animationDelay: '0s'}}>.</span>
      <span style={{animation: 'dotPulse 1s ease-in-out infinite', animationDelay: '0.18s'}}>
        .
      </span>
      <span style={{animation: 'dotPulse 1s ease-in-out infinite', animationDelay: '0.36s'}}>
        .
      </span>
    </p>
  </div>
)

export default DrawingOverlay
