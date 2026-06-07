export default function ScoreBar({ score }) {
  const n = parseInt(score)
  const color = n === 100 ? 'bg-s_green' : n >= 70 ? 'bg-s_yellow' : 'bg-s_red'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${n}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-600 w-8 text-right">{score}</span>
    </div>
  )
}
