import React, {useEffect, useMemo, useRef, useState} from 'react'
import apiClient, {messagingClient} from '../../../../../lib/api'

// ── Canvas-based animated name soup ─────────────────────────────────────────
const PARTICLE_COLORS = ['#facc15', '#a78bfa', '#34d399', '#f472b6', '#60a5fa']

function NameSoup({participants, pendingWinners}) {
  const canvasRef   = useRef(null)
  const bubblesRef  = useRef([])
  const particles   = useRef([])
  const revealedRef = useRef(false)

  const winnerNames = useMemo(
    () =>
      new Set(
        (pendingWinners ?? []).map((w) =>
          `${w.winner_name ?? ''} ${w.winner_last_name ?? ''}`.trim(),
        ),
      ),
    [pendingWinners],
  )

  const hasWinners = pendingWinners !== null && pendingWinners !== undefined

  // ── Build bubbles & start draw loop when participants load ──────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx   = canvas.getContext('2d')
    let rafId
    let width   = canvas.offsetWidth
    let height  = canvas.offsetHeight
    canvas.width  = width
    canvas.height = height
    revealedRef.current = false

    let seed = 7
    const rng = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) | 0
      return (seed >>> 0) / 0xffffffff
    }

    bubblesRef.current = participants.map((p) => {
      const name     = `${p.name ?? ''} ${p.last_name ?? ''}`.trim()
      const fontSize = 11 + Math.floor(rng() * 5)
      return {
        name,
        x: 30 + rng() * (width  - 60),
        y: 30 + rng() * (height - 60),
        vx: (rng() - 0.5) * 0.55,
        vy: (rng() - 0.5) * 0.55,
        fontSize,
        alpha:       0.3 + rng() * 0.3,
        scale:       1,
        targetScale: 1,
        isWinner:    false,
        popProgress: 0,
      }
    })
    particles.current = []

    const spawnConfetti = (x, y) => {
      for (let i = 0; i < 20; i++) {
        particles.current.push({
          x, y,
          vx:            (rng() - 0.5) * 5,
          vy:            -2 - rng() * 4,
          alpha:         1,
          color:         PARTICLE_COLORS[Math.floor(rng() * PARTICLE_COLORS.length)],
          size:          3 + rng() * 4,
          rotation:      rng() * Math.PI * 2,
          rotationSpeed: (rng() - 0.5) * 0.3,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, width, height)
      bg.addColorStop(0,   '#0f172a')
      bg.addColorStop(0.5, '#1e1b4b')
      bg.addColorStop(1,   '#0f172a')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, width, height)

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'
      ctx.lineWidth   = 1
      for (let gx = 0; gx < width; gx += 40) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, height); ctx.stroke()
      }
      for (let gy = 0; gy < height; gy += 40) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(width, gy); ctx.stroke()
      }

      // Bubbles
      bubblesRef.current.forEach((b) => {
        b.x += b.vx
        b.y += b.vy
        if (b.x < 10 || b.x > width  - 10) b.vx *= -1
        if (b.y < 10 || b.y > height - 10) b.vy *= -1
        b.scale += (b.targetScale - b.scale) * 0.08
        if (b.isWinner) b.popProgress = Math.min(1, b.popProgress + 0.04)

        const fs = b.fontSize * b.scale
        ctx.save()
        ctx.translate(b.x, b.y)
        ctx.font         = `${b.isWinner ? 'bold' : 'normal'} ${fs}px sans-serif`
        ctx.textAlign    = 'center'
        ctx.textBaseline = 'middle'

        if (b.isWinner) {
          // Glow halo
          const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, fs * 2.5)
          glow.addColorStop(0, `rgba(250,204,21,${0.4 * b.popProgress})`)
          glow.addColorStop(1, 'rgba(250,204,21,0)')
          ctx.fillStyle = glow
          ctx.beginPath(); ctx.arc(0, 0, fs * 2.5, 0, Math.PI * 2); ctx.fill()

          // Pill
          const tw  = ctx.measureText(b.name).width
          const pad = 9
          const rr  = fs * 0.6
          ctx.fillStyle = `rgba(250,204,21,${0.92 * b.popProgress})`
          ctx.beginPath()
          ctx.roundRect(-tw / 2 - pad, -fs * 0.75, tw + pad * 2, fs * 1.5, rr)
          ctx.fill()
          ctx.globalAlpha = b.popProgress
          ctx.fillStyle   = '#1e1b4b'
        } else {
          ctx.globalAlpha = b.alpha
          ctx.fillStyle   = 'rgba(148,163,184,1)'
        }

        ctx.fillText(b.name, 0, 0)
        ctx.globalAlpha = 1
        ctx.restore()
      })

      // Confetti
      const pts = particles.current
      for (let i = pts.length - 1; i >= 0; i--) {
        const pt   = pts[i]
        pt.x      += pt.vx
        pt.y      += pt.vy
        pt.vy     += 0.12
        pt.alpha  -= 0.018
        pt.rotation += pt.rotationSpeed
        if (pt.alpha <= 0) { pts.splice(i, 1); continue }
        ctx.save()
        ctx.translate(pt.x, pt.y)
        ctx.rotate(pt.rotation)
        ctx.globalAlpha = pt.alpha
        ctx.fillStyle   = pt.color
        ctx.fillRect(-pt.size / 2, -pt.size / 2, pt.size, pt.size * 0.55)
        ctx.globalAlpha = 1
        ctx.restore()
      }

      rafId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(rafId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participants])

  // ── Reveal winners when response arrives ─────────────────────────────────
  useEffect(() => {
    if (!hasWinners || revealedRef.current) return
    revealedRef.current = true

    let seed2 = 99
    const rng2 = () => {
      seed2 = (Math.imul(seed2, 1664525) + 1013904223) | 0
      return (seed2 >>> 0) / 0xffffffff
    }

    bubblesRef.current.forEach((b) => {
      if (winnerNames.has(b.name)) {
        b.isWinner    = true
        b.targetScale = 1.9
        b.alpha       = 1
        // spawn confetti from current position
        for (let i = 0; i < 20; i++) {
          particles.current.push({
            x: b.x, y: b.y,
            vx:            (rng2() - 0.5) * 5,
            vy:            -2 - rng2() * 4,
            alpha:         1,
            color:         PARTICLE_COLORS[Math.floor(rng2() * PARTICLE_COLORS.length)],
            size:          3 + rng2() * 4,
            rotation:      rng2() * Math.PI * 2,
            rotationSpeed: (rng2() - 0.5) * 0.3,
          })
        }
      } else {
        b.alpha = 0.07
        b.vx   *= 0.3
        b.vy   *= 0.3
      }
    })
  }, [hasWinners, winnerNames])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{height: 520}}>
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none">
        {!hasWinners ? (
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-yellow-300 text-sm font-semibold tracking-wide">Sorteando...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full animate-bounce">
            <span className="text-yellow-300 text-sm font-bold tracking-wide">🎉 ¡Ganadores encontrados!</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Shared buttons ───────────────────────────────────────────────────────────
const GreenButton = ({children, ...props}) => (
  <button
    className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-2xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
    {...props}
  >
    {children}
  </button>
)

const BlueButton = ({children, ...props}) => (
  <button
    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base rounded-2xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    {...props}
  >
    {children}
  </button>
)


// ── Main component ───────────────────────────────────────────────────────────
export default function MassiveDrawMock({products}) {
  const [step, setStep] = useState('select') // select | drawing | results
  const [selectedProductId, setSelectedProductId] = useState(products?.[0]?.id ?? '')
  const [participantFilter, setParticipantFilter] = useState('todos')

  const MOCK_PARTICIPANTS = [
    {id:'m1',name:'Lucía',last_name:'González'},{id:'m2',name:'Mateo',last_name:'Rodríguez'},
    {id:'m3',name:'Valentina',last_name:'López'},{id:'m4',name:'Sebastián',last_name:'Martínez'},
    {id:'m5',name:'Camila',last_name:'García'},{id:'m6',name:'Tomás',last_name:'Pérez'},
    {id:'m7',name:'Martina',last_name:'Sánchez'},{id:'m8',name:'Nicolás',last_name:'Romero'},
    {id:'m9',name:'Sofía',last_name:'Torres'},{id:'m10',name:'Agustín',last_name:'Flores'},
    {id:'m11',name:'Isabella',last_name:'Díaz'},{id:'m12',name:'Joaquín',last_name:'Reyes'},
    {id:'m13',name:'Emma',last_name:'Morales'},{id:'m14',name:'Lucas',last_name:'Jiménez'},
    {id:'m15',name:'Florencia',last_name:'Álvarez'},{id:'m16',name:'Diego',last_name:'Ruiz'},
    {id:'m17',name:'Renata',last_name:'Herrera'},{id:'m18',name:'Facundo',last_name:'Medina'},
    {id:'m19',name:'Milagros',last_name:'Castro'},{id:'m20',name:'Ignacio',last_name:'Vega'},
  ]
  const [participants, setParticipants] = useState(MOCK_PARTICIPANTS)
  const [participantsLoading, setParticipantsLoading] = useState(false)

  const [winnerCount, setWinnerCount] = useState(1)
  const [pendingWinners, setPendingWinners] = useState(null)
  const [winners, setWinners] = useState([])
  const [drawError, setDrawError] = useState(null)

  // notify: null | 'sending' | 'sent' | 'partial' | 'error'
  const [notifyStatus, setNotifyStatus] = useState(null)
  const [notifyErrors, setNotifyErrors] = useState([]) // failed recipient_ids

  const handleNotify = () => {
    if (!selectedProduct || winners.length === 0) return
    setNotifyStatus('sending')

    const regalo = selectedProduct.name
    const marca  = selectedProduct.brand ?? ''

    // On retry, only resend to previously-failed numbers
    const toList = notifyErrors.length > 0
      ? notifyErrors
      : winners.map((w) => w.winner_phone).filter(Boolean)

    const payload = {
      to: toList,
      template_name: 'connect_ganador_sorteo',
      language_code: 'es_AR',
      components: [
        {
          type: 'body',
          parameters: [
            {type: 'text', parameter_name: 'regalo', text: regalo},
            {type: 'text', parameter_name: 'marca',  text: marca},
          ],
        },
      ],
      message: `!Wow! Regalazo para vos 🎁\nTe ganaste ${regalo}, gentileza de ${marca}\nℹ️ Retirá tu premio por la mesa de acreditaciones antes de irte 😎`,
      variables: {regalo, marca},
    }

    messagingClient
      .post(
        '/api/send_template_to_list?code=BLtfBxcMcffozm5Qf5O9olVOl7KLSyGOxmngGQxTQhhiAzFuO6ojvA==',
        payload,
      )
      .then((res) => {
        const data = res.data ?? {}
        const failed = (data.results ?? [])
          .filter((r) => r.status === 'error')
          .map((r) => r.recipient_id)
        if (failed.length > 0) {
          setNotifyErrors(failed)
          setNotifyStatus('partial')
        } else {
          setNotifyErrors([])
          setNotifyStatus('sent')
        }
      })
      .catch((err) => {
        console.error('[Notificar ganadores]', err)
        setNotifyStatus('error')
      })
  }

  const selectedProduct = products?.find((p) => p.id === selectedProductId)

  useEffect(() => {
    setWinnerCount(1)
  }, [selectedProductId])

  useEffect(() => {
    setParticipantsLoading(true)
    const url =
      participantFilter === 'stands'
        ? '/participant/stands/visited-all'
        : participantFilter === 'forms'
        ? '/register_connect/excel-participants'
        : '/participant/no-winners'
    const normalizeExcel = (p) => {
      const parts = (p.nombre_completo ?? '').trim().split(' ')
      return {
        ...p,
        name:      parts[0] ?? '',
        last_name: parts.slice(1).join(' ') || '',
        phone:     p.whatsapp ?? '',
        email:     p.correo ?? '',
      }
    }
    apiClient
      .get(url)
      .then((res) => {
        const raw = res.data?.participants ?? []
        const normalized = participantFilter === 'forms' ? raw.map(normalizeExcel) : raw
        setParticipants([...MOCK_PARTICIPANTS, ...normalized])
      })
      .catch((err) => console.error('[Participantes masivo]', err))
      .finally(() => setParticipantsLoading(false))
  }, [participantFilter])

  useEffect(() => {
    if (!selectedProductId && products?.length) setSelectedProductId(products[0].id)
  }, [products])

  const handleDraw = () => {
    if (!selectedProductId) return
    setDrawError(null)
    setPendingWinners(null)
    setStep('drawing')

    const url =
      participantFilter === 'stands'
        ? `/lottery/draw/multi/visited-all-stands/${selectedProductId}?count=${winnerCount}`
        : participantFilter === 'forms'
        ? `/lottery/draw/excel/multi/${selectedProductId}?count=${winnerCount}`
        : `/lottery/draw/multi/no-winners/${selectedProductId}?count=${winnerCount}`

    apiClient
      .post(url)
      .then((res) => {
        const raw = res.data?.winners ?? []
        const w = raw.map((winner) => {
          if (winner.nombre_completo) {
            const parts = winner.nombre_completo.trim().split(' ')
            return {
              ...winner,
              winner_name:      parts[0] ?? '',
              winner_last_name: parts.slice(1).join(' ') || '',
              winner_phone:     winner.whatsapp ?? winner.winner_phone ?? '',
              winner_email:     winner.correo   ?? winner.winner_email ?? '',
            }
          }
          return winner
        })
        setPendingWinners(w)
        setTimeout(() => {
          setWinners(w)
          setStep('results')
        }, 2500)
      })
      .catch((err) => {
        console.error('[Sorteo masivo]', err)
        setDrawError('No se pudo realizar el sorteo. Intentá de nuevo.')
        setStep('select')
      })
  }

  const handleNewDraw = () => {
    setStep('select')
    setWinners([])
    setPendingWinners(null)
    setDrawError(null)
    setNotifyStatus(null)
    setNotifyErrors([])
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
      <div className="p-6 flex flex-col gap-6 w-full max-w-md mx-auto">
        {/* ── STEP: select ── */}
        {step === 'select' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Sorteo masivo — Connect
            </h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                ¿Quiénes pueden participar?
              </label>
              <select
                value={participantFilter}
                onChange={(e) => setParticipantFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 bg-gray-50 shadow-sm"
              >
                <option value="todos">Todos los participantes del evento</option>
                <option value="stands">Solo quienes visitaron todos los stands</option>
                <option value="forms">Solo quienes completaron el formulario</option>
              </select>
              <p className="text-xs text-gray-400 mt-0.5">
                {participantsLoading
                  ? 'Cargando participantes...'
                  : `${participants.length} participante${participants.length !== 1 ? 's' : ''} disponible${participants.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Producto a sortear
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 bg-gray-50 shadow-sm"
              >
                {products?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct?.photo_url && (
              <div className="w-full h-52 overflow-hidden rounded-xl">
                <img
                  src={selectedProduct.photo_url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Cantidad de ganadores
              </label>
              <input
                type="number"
                min={1}
                value={winnerCount}
                onChange={(e) => setWinnerCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                inputMode="numeric"
                className="border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 bg-gray-50 shadow-sm"
              />
            </div>

            {drawError && <p className="text-sm text-red-500 text-center">{drawError}</p>}

            <GreenButton
              onClick={handleDraw}
              disabled={!selectedProductId || participants.length === 0}
            >
              Sortear
            </GreenButton>
          </>
        )}

        {/* ── STEP: drawing (name soup) ── */}
        {step === 'drawing' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Sorteo masivo — Connect
            </h2>
            <NameSoup participants={participants} pendingWinners={pendingWinners} />
          </>
        )}

        {/* ── STEP: results ── */}
        {step === 'results' && selectedProduct && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 text-center">Ganadores</h3>

            {selectedProduct.photo_url && (
              <div className="w-full h-52 overflow-hidden rounded-xl">
                <img
                  src={selectedProduct.photo_url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="font-medium text-gray-900 text-center">
              {selectedProduct.name}
              {selectedProduct.brand && (
                <span className="text-gray-400 font-normal ml-1">({selectedProduct.brand})</span>
              )}
            </div>

            <ul className="flex flex-col gap-3">
              {winners.map((w, idx) => (
                <li
                  key={w.winner_id ?? idx}
                  className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 flex items-center gap-3"
                >
                  {w.product_photo_url ? (
                    <img
                      src={w.product_photo_url}
                      alt={w.product_name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🎁</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-green-700 text-sm">Ganador {idx + 1}:</span>
                      <span className="font-medium text-gray-900 truncate">
                        {w.winner_name} {w.winner_last_name}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Notify banner */}
            {notifyStatus === 'sent' && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm font-medium">
                <span>✅</span> Ganadores notificados correctamente.
              </div>
            )}
            {notifyStatus === 'partial' && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-3 text-yellow-800 text-sm font-medium">
                ⚠️ {winners.length - notifyErrors.length} notificados correctamente, {notifyErrors.length} no pudieron ser notificados.
              </div>
            )}
            {notifyStatus === 'error' && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-medium">
                <span>❌</span> No se pudo notificar. Intentá de nuevo.
              </div>
            )}

            <div className="flex flex-col gap-3 mt-2">
              {notifyStatus !== 'sent' && (
                <BlueButton
                  onClick={handleNotify}
                  disabled={notifyStatus === 'sending'}
                >
                  {notifyStatus === 'sending' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Notificando...
                    </>
                  ) : notifyStatus === 'partial' ? (
                    '🔔 Notificar ganadores'
                  ) : (
                    '🔔 Notificar ganadores'
                  )}
                </BlueButton>
              )}
              <GreenButton onClick={handleNewDraw}>Nuevo sorteo</GreenButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
