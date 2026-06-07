const map = {
  aprovada:   'bg-green-100 text-green-800 border border-green-200',
  divergente: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  rejeitada:  'bg-red-100 text-red-800 border border-red-200',
  critica:    'bg-red-200 text-red-900 border border-red-400 font-extrabold',
}
export default function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}
