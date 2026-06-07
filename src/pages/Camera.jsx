import { Camera as CameraIcon, Upload, Check } from 'lucide-react'

const STEPS = [
  { n:1, title:'CAPTURA',           desc:'Foto tirada pelo celular (JPG, PNG, PDF)' },
  { n:2, title:'PRÉ-PROCESSAMENTO', desc:'Crop automático, fornecedor, formatação de imagem' },
  { n:3, title:'OCR INTELIGENTE',   desc:'AWS Textract AnalyzeExpense. Extrai: CNP, Vlr, Iten, Bounding Boxes' },
  { n:4, title:'VALIDAÇÃO SEFAZ',   desc:'Consulta da chave de acesso. Verifica autenticidade' },
  { n:5, title:'MATCH AUTOMÁTICO',  desc:'Motor de conciliação. Entrada no Inbox' },
]

export default function Camera() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left: PWA preview */}
      <div className="bg-s_darker rounded-xl p-6 flex flex-col items-center justify-center gap-4 shadow-xl">
        <div className="text-center mb-2">
          <h2 className="text-white font-extrabold text-lg">SUIVIA Camera</h2>
          <p className="text-gray-400 text-xs">Captura Inteligente de Nota Fiscal</p>
        </div>
        {/* Phone mock */}
        <div className="w-52 h-96 bg-gray-900 rounded-3xl ring-4 ring-gray-600 flex flex-col items-center justify-center p-4 gap-4 relative shadow-2xl">
          <div className="w-32 h-48 border-4 border-dashed border-s_green rounded-lg flex items-center justify-center relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-s_green rounded-tl" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-s_green rounded-tr" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-s_green rounded-bl" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-s_green rounded-br" />
            <div className="w-24 h-36 bg-white rounded p-1 opacity-80">
              <div className="h-2 bg-gray-300 rounded mb-1 w-16 mx-auto" />
              <div className="h-1 bg-gray-200 rounded mb-0.5 w-20 mx-auto" />
              <div className="h-1 bg-gray-200 rounded mb-0.5 w-16 mx-auto" />
              <div className="h-8 bg-gray-100 rounded mt-2 mx-auto w-full" />
              <div className="h-1 bg-gray-200 rounded mb-0.5 w-20 mx-auto mt-2" />
              <div className="h-1 bg-gray-200 rounded mb-0.5 w-12 mx-auto" />
            </div>
          </div>
          <div className="text-s_green text-[10px] font-bold text-center">Nota detectada<br/>Clique para capturar</div>
          <div className="flex gap-4">
            <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-600 transition"><Upload className="w-4 h-4" /></button>
            <button className="w-14 h-14 bg-s_green rounded-full flex items-center justify-center text-white shadow-xl hover:bg-green-600 transition"><CameraIcon className="w-6 h-6" /></button>
            <button className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-600 transition"><Check className="w-4 h-4" /></button>
          </div>
        </div>
        <p className="text-gray-500 text-[10px] text-center">App PWA — funciona offline, sincroniza ao reconectar</p>
      </div>

      {/* Right: Pipeline Steps */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-extrabold text-gray-800 mb-1">RF13 — SUIVIA Camera</h3>
        <p className="text-xs text-gray-400 mb-6">Pipeline completo em 5 etapas após captura</p>
        <div className="space-y-4">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-s_green flex items-center justify-center text-s_darker font-extrabold text-sm shrink-0 shadow">{s.n}</div>
              <div className={i < STEPS.length-1 ? 'flex-1 border-b border-dashed border-gray-200 pb-4' : 'flex-1'}>
                <p className="font-bold text-gray-800 text-sm">{s.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-gray-50 rounded-lg p-4 border">
          <h4 className="text-xs font-extrabold text-gray-600 uppercase mb-3">Diferenciais de Captura</h4>
          {[
            'Correção de perspectiva e desfoque em movimento (ideal para ambientes ruidosos)',
            'Leitura de QR Code / código de barras da NF com uma foto',
            'Funciona offline — captura e sincroniza quando conectar',
            'App instalável no celular sem passar por nenhuma loja',
            'Notificação push assim que a nota entrar no sistema',
          ].map((d, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-600 mb-1.5">
              <span className="text-s_green font-bold shrink-0">✓</span> {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
