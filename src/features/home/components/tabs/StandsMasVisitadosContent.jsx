import SectionLayout from '../SectionLayout'
import {useEffect, useState} from 'react'
import {Pie} from 'react-chartjs-2'
import {Chart, ArcElement, Tooltip, Legend} from 'chart.js'
import apiClient from '../../../../lib/api'

Chart.register(ArcElement, Tooltip, Legend)

const COLORS = [
  '#60a5fa', '#fbbf24', '#34d399', '#f87171', '#a78bfa',
  '#f472b6', '#facc15', '#38bdf8', '#fb7185', '#4ade80',
  '#f59e42', '#818cf8', '#f472b6', '#fcd34d', '#6ee7b7',
  '#fca5a5', '#c084fc', '#f9a8d4', '#fde68a', '#5eead4',
]

const StandsMasVisitadosContent = () => {
  const [stands, setStands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiClient
      .get('/stand/visit_count')
      .then((res) => setStands(res.data.stands ?? []))
      .catch((err) => setError(err.message || 'Error al cargar visitas'))
      .finally(() => setLoading(false))
  }, [])

  const data = {
    labels: stands.map((s) => s.name),
    datasets: [
      {
        label: 'Visitas',
        data: stands.map((s) => s.visits),
        backgroundColor: stands.map((_, i) => COLORS[i % COLORS.length]),
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {display: false},
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed} visitas`,
        },
      },
    },
  }

  const half = Math.ceil(stands.length / 2)
  const leftLabels = stands.slice(0, half)
  const rightLabels = stands.slice(half)

  return (
    <SectionLayout className="flex flex-col items-center overflow-visible md:overflow-auto">
      <h2 className="text-lg font-semibold mb-4">Visitas stands</h2>

      {loading && <p className="text-gray-500 text-sm">Cargando visitas...</p>}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && stands.length === 0 && (
        <p className="text-gray-500 text-sm">No hay datos de visitas.</p>
      )}

      {!loading && !error && stands.length > 0 && (
        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-8">
          <div style={{width: 520, maxWidth: '100%'}}>
            <Pie data={data} options={options} />
          </div>
          <div className="flex flex-row gap-8 mt-8 md:mt-0">
            <div className="flex flex-col gap-2">
              {leftLabels.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span
                    style={{
                      display: 'inline-block',
                      width: 18,
                      height: 18,
                      background: COLORS[i % COLORS.length],
                      borderRadius: 4,
                      marginRight: 8,
                    }}
                  />
                  <span style={{fontSize: 18, fontWeight: 600}}>{s.name}</span>
                  <span style={{fontSize: 16, color: '#555', marginLeft: 6}}>{s.visits} visitas</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {rightLabels.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span
                    style={{
                      display: 'inline-block',
                      width: 18,
                      height: 18,
                      background: COLORS[(i + half) % COLORS.length],
                      borderRadius: 4,
                      marginRight: 8,
                    }}
                  />
                  <span style={{fontSize: 18, fontWeight: 600}}>{s.name}</span>
                  <span style={{fontSize: 16, color: '#555', marginLeft: 6}}>{s.visits} visitas</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </SectionLayout>
  )
}

export default StandsMasVisitadosContent