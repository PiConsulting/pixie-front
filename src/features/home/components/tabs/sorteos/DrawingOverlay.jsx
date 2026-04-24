import {useEffect, useRef, useState} from 'react'

// ── Slot machine config ────────────────────────────────────────────────────────
const VISIBLE   = 7          // rows visible (must be odd)
const HALF      = Math.floor(VISIBLE / 2)
const MIN_SPIN_MS = 2500     // min time before decelerating
const INITIAL_VEL = 24       // names/sec at start
const DECEL       = 4        // names/sec² — controls how long the slowdown lasts

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

const DrawingOverlay = ({participants, pendingWinner, onComplete}) => {
  const [slots, setSlots]       = useState([])
  const [finished, setFinished] = useState(false)

  const pendingWinnerRef = useRef(pendingWinner)
  const onCompleteRef    = useRef(onComplete)

  useEffect(() => { pendingWinnerRef.current = pendingWinner }, [pendingWinner])
  useEffect(() => { onCompleteRef.current    = onComplete    }, [onComplete])

  useEffect(() => {
    const rawNames = participants
      .map((p) => `${p.name ?? ''} ${p.last_name ?? ''}`.trim())
      .filter(Boolean)
    if (rawNames.length === 0) return

    // Build a large pool (5 shuffled copies) so we never run out of names
    const pool = [
      ...shuffle(rawNames),
      ...shuffle(rawNames),
      ...shuffle(rawNames),
      ...shuffle(rawNames),
      ...shuffle(rawNames),
    ]

    // Animation state (mutable ref object, not React state)
    const s = {
      floatIdx:      HALF,
      vel:           INITIAL_VEL,
      decelerating:  false,
      targetIdx:     null,
      decelStartTs:  null,
      decelStartIdx: null,
      decelDuration: null,
      done:          false,
      lastTs:        null,
    }

    const getSlice = (fi) => {
      const ci = Math.round(fi)
      return Array.from({length: VISIBLE}, (_, k) => {
        const offset = k - HALF
        const idx    = Math.max(0, Math.min(pool.length - 1, ci + offset))
        return {name: pool[idx], offset}
      })
    }

    let rafId

    const loop = (ts) => {
      if (s.done) return
      if (s.lastTs === null) s.lastTs = ts
      const dt = Math.min((ts - s.lastTs) / 1000, 0.05)
      s.lastTs = ts

      const pw      = pendingWinnerRef.current
      const elapsed = ts - (ts - s.lastTs) // use performance.now()-based startTime below

      if (pw && !s.decelerating && (ts - startTime) >= MIN_SPIN_MS) {
        const wName = `${pw.winner_name ?? ''} ${pw.winner_last_name ?? ''}`.trim()

        // Distance the wheel will travel while decelerating: v₀² / (2a)
        const stoppingDist = (s.vel * s.vel) / (2 * DECEL)
        const targetIdx    = Math.round(s.floatIdx + stoppingDist)

        // Guarantee pool is large enough and winner name is at target
        while (pool.length <= targetIdx + HALF)
          pool.push(rawNames[pool.length % rawNames.length])
        pool[targetIdx] = wName

        // Duration of deceleration phase: v₀ / a  (seconds → ms)
        s.targetIdx     = targetIdx
        s.decelStartTs  = ts
        s.decelStartIdx = s.floatIdx
        s.decelDuration = (s.vel / DECEL) * 1000
        s.decelerating  = true
      }

      if (s.decelerating) {
        const t      = Math.min(1, (ts - s.decelStartTs) / s.decelDuration)
        const eased  = t * (2 - t) // ease-out quadratic → exact landing
        s.floatIdx   = s.decelStartIdx + (s.targetIdx - s.decelStartIdx) * eased

        if (t >= 1) {
          s.floatIdx = s.targetIdx
          s.done     = true
          setSlots(getSlice(s.floatIdx))
          setFinished(true)
          setTimeout(() => onCompleteRef.current(pendingWinnerRef.current), 1200)
          return
        }
      } else {
        s.floatIdx += s.vel * dt
        // Soft wrap while free-spinning (stay away from pool end)
        if (s.floatIdx > pool.length - VISIBLE * 2) s.floatIdx = HALF
      }

      setSlots(getSlice(s.floatIdx))
      rafId = requestAnimationFrame(loop)
    }

    const startTime = performance.now()
    setSlots(getSlice(s.floatIdx))
    setFinished(false)
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      s.done = true
    }
  }, [participants])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
      <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-8">
        Sorteando
      </p>

      {/* Slot strip */}
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{width: 520, height: VISIBLE * 44}}
      >
        {/* Center highlight */}
        <div
          className="absolute left-0 right-0 rounded-xl border-2 border-yellow-400 pointer-events-none"
          style={{
            top: '50%',
            transform: 'translateY(-50%)',
            height: 52,
            background: 'rgba(251,191,36,0.10)',
            boxShadow: '0 0 32px rgba(251,191,36,0.4)',
          }}
        />
        {/* Top fade */}
        <div
          className="absolute left-0 right-0 top-0 pointer-events-none z-10"
          style={{height: 88, background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)'}}
        />
        {/* Bottom fade */}
        <div
          className="absolute left-0 right-0 bottom-0 pointer-events-none z-10"
          style={{height: 88, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'}}
        />

        {slots.map(({name, offset}) => {
          const abs      = Math.abs(offset)
          const isCenter = abs === 0
          return (
            <div
              key={offset}
              style={{
                height:       44,
                flexShrink:   0,
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center',
                width:        '100%',
                opacity:      isCenter ? 1 : abs === 1 ? 0.45 : abs === 2 ? 0.18 : 0.06,
                transform:    `scale(${isCenter ? 1 : abs === 1 ? 0.78 : 0.62})`,
                color:        isCenter ? '#fbbf24' : 'white',
                fontWeight:   isCenter ? 800 : 500,
                fontSize:     isCenter ? 28 : 17,
                letterSpacing: isCenter ? '0.04em' : 0,
                textShadow:   isCenter ? '0 0 28px rgba(251,191,36,0.75)' : 'none',
                userSelect:   'none',
                whiteSpace:   'nowrap',
              }}
            >
              {name}
            </div>
          )
        })}
      </div>

      {finished ? (
        <p className="mt-7 text-yellow-400 font-bold text-lg tracking-wide animate-pulse">
          ¡Tenemos un ganador!
        </p>
      ) : (
        <div className="flex gap-2 mt-7">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-white/60"
              style={{
                animation: 'dotPulse 1s ease-in-out infinite',
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.75) }
          40%            { opacity: 1;   transform: scale(1.3) }
        }
      `}</style>
    </div>
  )
}

export default DrawingOverlay
