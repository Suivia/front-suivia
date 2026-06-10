import React, { createContext, useContext, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, NavLink, useNavigate, useParams, Navigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, LineChart, Line } from "recharts";
import { LayoutDashboard, Inbox, AlertTriangle, Layers, Camera, Settings, Search, Bell, Upload, RefreshCw, CheckCircle2, XCircle, Eye, ShieldCheck, FileText, LogOut, Zap, Clock, Download, ChevronRight, Filter, BookOpen, HelpCircle, Mail, Globe, FolderUp } from "lucide-react";
import { svc }         from "./api/services";
import { useApi }      from "./hooks/useApi";
import { useWebSocket} from "./hooks/useWebSocket";
import { logout }      from "./auth/cognito";
import "./style.css";

// ─── Auth Context ────────────────────────────────────────────────
const AuthCtx = createContext(null);
function useAuth() { return useContext(AuthCtx); }

function AuthProvider({ children }) {
  const [user,  setUser]  = useState(() => { try { return JSON.parse(localStorage.getItem("suivia_user") || "null"); } catch { return null; } });
  const [token, setToken] = useState(() => localStorage.getItem("suivia_token") || "");

  const doLogin = async (email, pw) => {
    const s = await svc.login(email, pw);
    setToken(s.idToken);
    setUser(s.user);
    localStorage.setItem("suivia_token", s.idToken);
    localStorage.setItem("suivia_user",  JSON.stringify(s.user));
  };

  const doLogout = () => {
    logout();
    setUser(null);
    setToken("");
  };

  return <AuthCtx.Provider value={{ user, token, login: doLogin, logout: doLogout }}>
    {children}
  </AuthCtx.Provider>;
}

// ─── helpers ─────────────────────────────────────────────────────
const money = v => "R$ " + Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
const dec   = v => JSON.parse(typeof v === "string" ? v : JSON.stringify(v || []));

function Badge({ s }) {
  const cl = s?.includes("APROV") || s === "approved" ? "ok"
           : s?.includes("CRIT")  || s?.includes("REJEIT") ? "bad"
           : s?.includes("DIVERG") ? "warn" : "info";
  return <span className={`badge ${cl}`}>{s}</span>;
}

function Score({ v }) {
  const pct = Math.min(Math.max(Number(v) || 0, 0), 100);
  const col = pct === 100 ? "#22c55e" : pct >= 90 ? "#84cc16" : pct >= 70 ? "#eab308" : "#ef4444";
  return <div className="score-wrap">
    <div className="score-bar"><div style={{ width: pct + "%", background: col }} /></div>
    <b style={{ color: col }}>{pct}%</b>
  </div>;
}

function Spinner() { return <div className="spinner" />; }
function ApiErr({ err }) { return err ? <div className="apierr">⚠ {err}</div> : null; }

function useWsUpdates(reload) {
  useWebSocket(msg => { if (msg?.type === "INVOICE_UPDATED" || msg?.type === "BATCH_DONE") reload?.(); });
}

// ─── Layout ──────────────────────────────────────────────────────
function Layout({ children }) {
  const { user, logout: lo } = useAuth();
  const nav = [
    ["/dashboard",  "Dashboard",    LayoutDashboard],
    ["/inbox",      "Inbox",        Inbox],
    ["/exceptions", "Exceções",     AlertTriangle],
    ["/batches",    "Lotes",        Layers],
    ["/upload",     "Upload",       Upload],
    ["/audit",      "Auditoria",    BookOpen],
    ["/settings",   "Config",       Settings],
    ["/help",       "Ajuda",        HelpCircle],
  ];
  return (
    <div className="app">
      <aside>
        <div className="brand"><span>SV</span> SUIVIA</div>
        {nav.map(([p, n, I]) =>
          <NavLink key={p} to={p} className={({ isActive }) => isActive ? "on" : ""}>
            <I size={18} /> <em>{n}</em>
          </NavLink>
        )}
        <div className="aside-footer">
          <span>{user?.email || user?.["cognito:username"] || "Operador"}</span>
          <button className="icon-btn" onClick={lo} title="Sair"><LogOut size={16}/></button>
        </div>
      </aside>
      <main>
        <header>
          <div className="search"><Search size={16}/><input placeholder="Buscar NF, CNPJ, pedido, lote..." /></div>
          <Bell size={20}/>
        </header>
        <section>{children}</section>
      </main>
    </div>
  );
}

// ─── Login ───────────────────────────────────────────────────────
function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const [err, setErr]     = useState(""); const [loading, setLoading] = useState(false);
  const submit = async e => {
    e.preventDefault(); setErr(""); setLoading(true);
    try { await login(email, pw); nav("/dashboard"); }
    catch(e) { setErr(e?.message || "Credenciais inválidas"); }
    finally { setLoading(false); }
  };
  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="brand"><span>SV</span> SUIVIA</div>
        <p>Módulo de Recebimento Fiscal Inteligente</p>
        <form onSubmit={submit}>
          <label>E-mail <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required/></label>
          <label>Senha  <input value={pw}    onChange={e=>setPw(e.target.value)}    type="password" required/></label>
          {err && <div className="apierr">{err}</div>}
          <button type="submit" disabled={loading}>{loading?"Entrando...":"Entrar"}</button>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard (RF12) ────────────────────────────────────────────
function Dashboard() {
  const { data, loading, error, reload } = useApi(() => svc.dashboard(), null, []);
  useWsUpdates(reload);
  if (loading) return <Spinner/>;
  const d = data || {};
  const c = d.cards || {};
  return <>
    <Title t="Dashboard Principal" sub="RF12 — Indicadores em tempo real conectados ao backend AWS"/>
    <ApiErr err={error}/>
    <div className="cards">
      {[
        ["Processadas", c.processed || 0, "dark"],
        ["Touchless Rate", (c.touchless || 0) + "%", "ok"],
        ["Divergentes", c.divergent || 0, "warn"],
        ["Rejeitadas", c.rejected || 0, "bad"],
        ["Tempo Médio", c.avgTime || "—", "info"],
      ].map(([label, value, cls]) =>
        <div key={label} className={`card ${cls}`}>
          <small>{label}</small><strong>{value}</strong>
        </div>
      )}
    </div>
    <div className="grid2">
      <div className="panel">
        <h3>Volume (últimos 7 dias)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={d.volume || []}>
            <XAxis dataKey="day"/> <YAxis/> <Tooltip/>
            <Bar dataKey="aprovadas"  stackId="a" fill="#22c55e"/>
            <Bar dataKey="divergentes" stackId="a" fill="#eab308"/>
            <Bar dataKey="rejeitadas" stackId="a" fill="#ef4444"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="panel">
        <h3>Distribuição</h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={d.pie || []} dataKey="value" innerRadius={50} outerRadius={80}>
              {(d.pie || []).map((e, i) => <Cell key={i} fill={e.color}/>)}
            </Pie>
            <Tooltip/>
          </PieChart>
        </ResponsiveContainer>
        <h4 className="mt-2">Top Divergências</h4>
        {(d.top || []).map(([t, n]) =>
          <div key={t} className="rank"><span>{t}</span><b>{n}</b></div>
        )}
      </div>
    </div>
  </>;
}

// ─── Inbox (RF01, RF02) ──────────────────────────────────────────
function InboxPage() {
  const nav = useNavigate();
  const [statusFilter, setStatusFilter] = useState("");
  const { data, loading, error, reload } = useApi(
    () => svc.inbox(statusFilter ? { status: statusFilter } : {}),
    [], [statusFilter]
  );
  useWsUpdates(reload);
  const rows = Array.isArray(data) ? data : [];
  return <>
    <Title t="Inbox de Notas Fiscais" sub="RF01–RF08 — Fila operacional com score, PC e ações rápidas"/>
    <div className="toolbar">
      <button onClick={reload}><RefreshCw size={15}/> Atualizar</button>
      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
        <option value="">Todos os status</option>
        <option value="APROVADA">Aprovadas</option>
        <option value="DIVERGENTE_MEDIA">Divergentes</option>
        <option value="REJEITADA">Rejeitadas</option>
        <option value="REJEITADA_CRITICA">Críticas</option>
      </select>
      <button><Download size={15}/> Exportar</button>
    </div>
    <ApiErr err={error}/>
    {loading ? <Spinner/> :
    <div className="table-wrap">
      <table>
        <thead><tr>
          <th>Status</th><th>NF</th><th>Fornecedor</th><th>CNPJ</th>
          <th>Valor</th><th>Score</th><th>PC</th><th>Ações</th>
        </tr></thead>
        <tbody>
          {rows.map(inv => {
            const stg = inv.staging || {};
            return <tr key={inv.id}>
              <td><Badge s={inv.status}/></td>
              <td><b>{stg.invoice_number || "—"}</b></td>
              <td>{stg.supplier_name || "—"}</td>
              <td className="mono">{stg.supplier_cnpj || "—"}</td>
              <td>{money(stg.total_amount)}</td>
              <td><Score v={inv.match_score}/></td>
              <td className="mono">{inv.purchase_order_id || "—"}</td>
              <td>
                <button onClick={() => nav("/invoice/" + inv.id)}>
                  <Eye size={14}/> Analisar
                </button>
              </td>
            </tr>;
          })}
          {rows.length === 0 && <tr><td colSpan={8} style={{textAlign:"center",padding:"32px",color:"#64748b"}}>Nenhuma nota encontrada</td></tr>}
        </tbody>
      </table>
    </div>}
  </>;
}

// ─── Invoice Detail — Split-Screen (RF08, RF11) ──────────────────
function Detail() {
  const { id } = useParams();
  const nav    = useNavigate();
  const { data: inv, loading, error } = useApi(() => svc.invoice(id), null, [id]);
  const { data: poSuggestions } = useApi(() => svc.poSuggestions(id), [], [id]);
  const [note,    setNote]    = useState("");
  const [acting,  setActing]  = useState(false);
  const [msg,     setMsg]     = useState("");
  const [selectedPos, setSelectedPos] = useState({});

  const togglePo = po => {
    setSelectedPos(prev => {
      const next = { ...prev };
      if (next[po.id]) delete next[po.id];
      else next[po.id] = po.total_amount;
      return next;
    });
  };

  const linkSelected = async () => {
    const links = Object.entries(selectedPos).map(([purchase_order_id, amount]) => ({ purchase_order_id, amount }));
    if (links.length === 0) { setMsg("Selecione ao menos um PO"); return; }
    setActing(true);
    try {
      await svc.linkPO(id, { links });
      nav(0);
    } catch(e) { setMsg(e?.response?.data?.error || e.message); }
    finally { setActing(false); }
  };

  if (loading) return <Spinner/>;
  if (!inv)    return <ApiErr err={error || "Nota não encontrada"}/>;

  const stg    = inv.staging    || {};
  const hm     = typeof inv.header_match === "string" ? JSON.parse(inv.header_match || "{}") : (inv.header_match || {});
  const divs   = typeof inv.divergences  === "string" ? JSON.parse(inv.divergences  || "[]") : (inv.divergences  || []);
  const items  = typeof inv.items_match  === "string" ? JSON.parse(inv.items_match  || "[]") : (inv.items_match  || []);
  const bb     = stg.bounding_boxes ? (typeof stg.bounding_boxes === "string" ? JSON.parse(stg.bounding_boxes) : stg.bounding_boxes) : {};

  const act = async type => {
    if (type === "approve" && !note && inv.match_score < 100) {
      setMsg("Justificativa obrigatória (RN06 — min 30 chars)"); return;
    }
    if (type === "reject" && !note) { setMsg("Motivo de rejeição obrigatório"); return; }
    setActing(true);
    try {
      type === "approve"
        ? await svc.approve(id, { note, user: "operador" })
        : await svc.reject(id,  { reason: note, user: "operador" });
      nav("/inbox");
    } catch(e) { setMsg(e?.response?.data?.error || e.message); }
    finally { setActing(false); }
  };

  return <>
    <Title t={"Detalhe — " + (stg.invoice_number || id)} sub="Tela 3 — Split-Screen 3-Way Match com highlights de OCR"/>
    <ApiErr err={error}/>
    {msg && <div className="apierr">{msg}</div>}
    <div className="split">
      {/* Lado esquerdo — documento */}
      <div className="panel doc-panel">
        <h3>Documento Original / OCR</h3>
        <div className="doc-viewer">
          <h2>NOTA FISCAL ELETRÔNICA</h2>
          <div className="doc-field">Emitente: <b>{stg.supplier_name}</b></div>
          <div className="doc-field">CNPJ: <b className="mono">{stg.supplier_cnpj}</b></div>
          <div className={`doc-field hl ${hm.value === false ? "hl-bad" : "hl-ok"}`}>
            VALOR TOTAL: <b>{money(stg.total_amount)}</b>
          </div>
          <div className="doc-field">Chave NF-e: <small className="mono">{stg.invoice_key || "—"}</small></div>
          <div className="doc-field">Data Emissão: <b>{stg.issue_date ? new Date(stg.issue_date).toLocaleDateString("pt-BR") : "—"}</b></div>

          {/* Bounding boxes OCR */}
          {Object.keys(bb).length > 0 && <>
            <h4>Campos extraídos (Textract)</h4>
            {Object.entries(bb).map(([k, v]) =>
              <div key={k} className="bb-field">
                <span className="bb-label">{k}</span>
                <span className="bb-val">{JSON.stringify(v)}</span>
              </div>
            )}
          </>}

          <h4>Itens da Nota</h4>
          <table className="items-tbl">
            <thead><tr><th>Descrição</th><th>Qtd</th><th>Valor Unit.</th><th>Total</th></tr></thead>
            <tbody>
              {(JSON.parse(stg.extracted_items || "[]")).map((it, i) =>
                <tr key={i}>
                  <td>{it.description}</td>
                  <td>{it.quantity}</td>
                  <td>{money(it.unit_price)}</td>
                  <td>{money(it.total)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lado direito — conciliação */}
      <div className="panel">
        <h3>Análise de Conciliação</h3>
        <div className="kv">
          <span>Status</span>      <div><Badge s={inv.status}/></div>
          <span>Score</span>       <div><Score v={inv.match_score}/></div>
          <span>Pedido</span>      <b>{inv.purchase_order_id || "Sugerir PC"}</b>
          <span>CNPJ OK</span>     <b>{hm.cnpj ? "✅" : "❌ CRÍTICO"}</b>
          <span>Valor OK</span>    <b>{hm.value === true ? "✅" : hm.value === "tolerance" ? "⚠ tolerância" : "❌"}</b>
        </div>

        {!inv.purchase_order_id && poSuggestions?.length > 0 && <>
          <h4>Sugestões de PO (RF07)</h4>
          <div className="divs-list">
            {poSuggestions.map(po =>
              <label key={po.id} className="div-item">
                <input type="checkbox" checked={!!selectedPos[po.id]} onChange={() => togglePo(po)} />
                <b>{po.number || po.id}</b>
                <span>Valor: {money(po.total_amount)}</span>
              </label>
            )}
          </div>
          <button className="green" onClick={linkSelected} disabled={acting}>
            Vincular PO(s) selecionado(s)
          </button>
        </>}

        {divs.length > 0 && <>
          <h4>Divergências ({divs.length})</h4>
          <div className="divs-list">
            {divs.map((d, i) =>
              <div key={i} className={`div-item sev-${d.severity}`}>
                <b>{d.field_name}</b>
                <span>Esperado: {d.expected_value}</span>
                <span>Recebido: {d.actual_value}</span>
                {d.difference && <span>Diferença: {d.difference}</span>}
                <Badge s={d.severity}/>
              </div>
            )}
          </div>
        </>}

        {items.length > 0 && <>
          <h4>Match de Itens</h4>
          <table className="items-tbl">
            <thead><tr><th>Item Pedido</th><th>Item NF</th><th>Simil.</th><th>Qtd OK</th></tr></thead>
            <tbody>
              {items.map((it, i) =>
                <tr key={i}>
                  <td>{it.po_item}</td>
                  <td>{it.nf_item || "—"}</td>
                  <td>{it.similarity ? Math.round(it.similarity * 100) + "%" : "—"}</td>
                  <td>{it.qty_ok ? "✅" : "❌"}</td>
                </tr>
              )}
            </tbody>
          </table>
        </>}

        <h4>Decisão (RN06)</h4>
        <textarea
          placeholder="Justificativa obrigatória para aprovação com ressalva (min 30 chars)..."
          value={note} onChange={e => setNote(e.target.value)}
        />
        <div className="actions">
          <button className="green" onClick={() => act("approve")} disabled={acting}>
            <CheckCircle2 size={15}/> Aprovar
          </button>
          <button className="yellow" onClick={() => act("approve")} disabled={acting}>
            <CheckCircle2 size={15}/> Aprov. Parcial
          </button>
          <button className="red" onClick={() => act("reject")} disabled={acting}>
            <XCircle size={15}/> Rejeitar
          </button>
        </div>
      </div>
    </div>
  </>;
}

// ─── Exceptions (RF10) ───────────────────────────────────────────
function Exceptions() {
  const [sev,     setSev]     = useState("");
  const [maxVal,  setMaxVal]  = useState(500);
  const [selected,setSelected]= useState([]);
  const [msg,     setMsg]     = useState("");
  const { data, loading, error, reload } = useApi(
    () => svc.exceptions(sev ? { severity: sev } : {}), [], [sev]
  );
  const rows = Array.isArray(data) ? data : [];

  const toggle = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const bulk = async () => {
    try {
      const r = await svc.bulkApprove({ ids: selected, maxValue: maxVal, note: "Bulk approval via UI" });
      setMsg(`${r.data.approved} divergências aprovadas`);
      setSelected([]); reload();
    } catch(e) { setMsg(e?.response?.data?.error || e.message); }
  };

  return <>
    <Title t="Fila de Exceções" sub="RF10 — Resolução em lote por tipo, severidade e valor"/>
    <div className="toolbar">
      <button onClick={reload}><RefreshCw size={15}/> Atualizar</button>
      <select value={sev} onChange={e => setSev(e.target.value)}>
        <option value="">Todas severidades</option>
        <option value="critical">Crítica</option>
        <option value="high">Alta</option>
        <option value="medium">Média</option>
        <option value="low">Baixa</option>
      </select>
      <input type="number" value={maxVal} onChange={e => setMaxVal(Number(e.target.value))}
             placeholder="Valor máximo para bulk" style={{width:180}}/>
      {selected.length > 0 &&
        <button className="green" onClick={bulk}><Zap size={15}/> Aprovar {selected.length} em lote</button>}
    </div>
    {msg && <div className="apierr">{msg}</div>}
    <ApiErr err={error}/>
    {loading ? <Spinner/> :
    <div className="table-wrap">
      <table>
        <thead><tr>
          <th><input type="checkbox" onChange={e => setSelected(e.target.checked ? rows.map(r=>r.id) : [])} /></th>
          <th>Tipo</th><th>Severidade</th><th>Campo</th><th>Esperado</th><th>Real</th><th>Diferença</th><th>Resolução</th>
        </tr></thead>
        <tbody>
          {rows.map(r =>
            <tr key={r.id}>
              <td><input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggle(r.id)}/></td>
              <td>{r.divergence_type}</td>
              <td><Badge s={r.severity}/></td>
              <td>{r.field_name}</td>
              <td>{r.expected_value}</td>
              <td>{r.actual_value}</td>
              <td>{r.difference}</td>
              <td><Badge s={r.resolution || "pending"}/></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>}
  </>;
}

// ─── Batches (RF02) ──────────────────────────────────────────────
function Batches() {
  const nav = useNavigate();
  const { data, loading, error, reload } = useApi(() => svc.batches(), [], []);
  useWsUpdates(reload);
  const rows = Array.isArray(data) ? data : [];
  return <>
    <Title t="Monitoramento de Lotes" sub="RF02 — Rastreamento em tempo real: origem, volume, progresso"/>
    <div className="toolbar"><button onClick={reload}><RefreshCw size={15}/> Atualizar</button></div>
    <ApiErr err={error}/>
    {loading ? <Spinner/> :
    <div className="table-wrap">
      <table>
        <thead><tr>
          <th>ID Lote</th><th>Origem</th><th>Total</th><th>Processadas</th>
          <th>Erros</th><th>Status</th><th>Progresso</th><th>Ações</th>
        </tr></thead>
        <tbody>
          {rows.map(b => {
            const pct = b.total > 0 ? Math.round(b.processed / b.total * 100) : 0;
            return <tr key={b.id}>
              <td className="mono">{b.id}</td>
              <td>{b.origin}</td>
              <td>{b.total}</td>
              <td>{b.processed}</td>
              <td style={{color: b.errors > 0 ? "#ef4444":"inherit"}}>{b.errors}</td>
              <td><Badge s={b.status}/></td>
              <td><Score v={pct}/></td>
              <td><button onClick={() => nav("/batches/" + b.id)}><Eye size={14}/> Detalhe</button></td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>}
  </>;
}

// ─── RF13 — Fila offline (IndexedDB-like via localStorage) ───────
const OFFLINE_QUEUE_KEY = "suivia_offline_queue";

function loadOfflineQueue() {
  try { return JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]"); }
  catch { return []; }
}
function saveOfflineQueue(queue) {
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function dataUrlToBlob(dataUrl) {
  const [meta, b64] = dataUrl.split(",");
  const mime = meta.match(/data:(.*);base64/)[1];
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

// ─── Upload (RF01, RF13) ──────────────────────────────────────────
const UPLOAD_TYPES = [
  { id: "upload", label: "Upload Manual",  icon: FolderUp,  desc: "Selecione XML, PDF, JPG ou PNG do seu computador." },
  { id: "camera", label: "Câmera Mobile",  icon: Camera,    desc: "Use a câmera do celular para fotografar a nota fiscal." },
  { id: "email",  label: "E-mail",         icon: Mail,      desc: "Notas recebidas por e-mail são capturadas automaticamente." },
  { id: "api",    label: "API Externa",    icon: Globe,     desc: "Integrações de sistemas externos enviam notas via API." },
];

function UploadPage() {
  const [files,    setFiles]    = useState([]);
  const [progress, setProgress] = useState({});
  const [msgs,     setMsgs]     = useState({});
  const [source,   setSource]   = useState("upload");
  const [online,   setOnline]   = useState(navigator.onLine);
  const [pending,  setPending]  = useState(loadOfflineQueue().length);

  useEffect(() => {
    const onOnline  = () => { setOnline(true); syncOfflineQueue(); };
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    if (navigator.onLine) syncOfflineQueue();
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const syncOfflineQueue = async () => {
    let queue = loadOfflineQueue();
    if (queue.length === 0) return;
    const remaining = [];
    for (const item of queue) {
      try {
        const { data } = await svc.presign({ fileName: item.name, source: item.source });
        const blob = dataUrlToBlob(item.dataUrl);
        await svc.uploadS3(data.uploadUrl, blob);
      } catch {
        remaining.push(item);
      }
    }
    saveOfflineQueue(remaining);
    setPending(remaining.length);
  };

  const handleFiles = async e => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    for (const file of selected) {
      if (!navigator.onLine) {
        // RF13 — sem conexão: armazena localmente e sincroniza ao reconectar
        try {
          const dataUrl = await fileToDataUrl(file);
          const queue = loadOfflineQueue();
          queue.push({ name: file.name, source, dataUrl });
          saveOfflineQueue(queue);
          setPending(queue.length);
          setMsgs(prev => ({ ...prev, [file.name]: "📥 Offline — salvo para sincronização posterior" }));
        } catch(err) {
          setMsgs(prev => ({ ...prev, [file.name]: `❌ Erro ao salvar offline: ${err.message}` }));
        }
        continue;
      }
      try {
        // RF01 — Presigned URL → upload direto S3
        const { data } = await svc.presign({ fileName: file.name, source });
        await svc.uploadS3(data.uploadUrl, file, pct =>
          setProgress(prev => ({ ...prev, [file.name]: pct }))
        );
        setMsgs(prev => ({ ...prev, [file.name]: `✅ Enviado! Staging ID: ${data.stagingId}` }));
      } catch(err) {
        setMsgs(prev => ({ ...prev, [file.name]: `❌ Erro: ${err?.response?.data?.error || err.message}` }));
      }
    }
  };

  return <>
    <Title t="Upload de Notas" sub="RF01, RF13 — Upload multicanal direto para S3 via presigned URL"/>
    {!online && <div className="apierr">⚠ Sem conexão — capturas serão sincronizadas automaticamente ao reconectar.</div>}
    {pending > 0 && <div className="apierr">📥 {pending} arquivo(s) pendente(s) de sincronização.</div>}
    <div className="panel">
      <h3>1. Escolha o tipo de envio</h3>
      <div className="upload-types">
        {UPLOAD_TYPES.map(t => {
          const I = t.icon;
          return (
            <button key={t.id} type="button"
                    className={"upload-type" + (source === t.id ? " on" : "")}
                    onClick={() => setSource(t.id)}>
              <I size={22}/>
              <b>{t.label}</b>
              <small>{t.desc}</small>
            </button>
          );
        })}
      </div>

      <h3 className="mt-2">2. Envie o(s) arquivo(s)</h3>
      <label className="drop-zone">
        <Upload size={48}/>
        <b>Arraste ou clique para selecionar XML, PDF, JPG ou PNG</b>
        <small>Múltiplos arquivos aceitos — RN01: XML tem prioridade sobre PDF</small>
        <input type="file" multiple accept=".xml,.pdf,.jpg,.jpeg,.png"
               capture={source === "camera" ? "environment" : undefined}
               onChange={handleFiles}/>
      </label>
      {files.map(f =>
        <div key={f.name} className="upload-item">
          <FileText size={16}/>
          <span>{f.name}</span>
          <div className="progress-bar">
            <div style={{ width: (progress[f.name] || 0) + "%" }}/>
          </div>
          <span>{progress[f.name] || 0}%</span>
          {msgs[f.name] && <span className="upload-msg">{msgs[f.name]}</span>}
        </div>
      )}
    </div>
  </>;
}

// ─── Audit (RF14) ────────────────────────────────────────────────
function Audit() {
  const { data, loading, error, reload } = useApi(() => svc.audit(), [], []);
  const rows = Array.isArray(data) ? data : [];

  const exportCsv = async () => {
    const r = await svc.auditExport();
    const url = URL.createObjectURL(new Blob([r.data], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "audit-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return <>
    <Title t="Log de Auditoria" sub="RF14 — Rastreabilidade imutável de todas as ações do sistema"/>
    <div className="toolbar">
      <button onClick={reload}><RefreshCw size={15}/> Atualizar</button>
      <button onClick={exportCsv}><Download size={15}/> Exportar CSV</button>
    </div>
    <ApiErr err={error}/>
    {loading ? <Spinner/> :
    <div className="table-wrap">
      <table>
        <thead><tr><th>Data/Hora</th><th>Ação</th><th>Entidade</th><th>Usuário</th><th>Meta</th></tr></thead>
        <tbody>
          {rows.map(r =>
            <tr key={r.id}>
              <td className="mono">{new Date(r.timestamp).toLocaleString("pt-BR")}</td>
              <td><b>{r.action}</b></td>
              <td className="mono">{r.entity_id?.slice(0,12)}...</td>
              <td>{r.user}</td>
              <td><small>{r.meta}</small></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>}
  </>;
}

// ─── Settings (RF09, RF15) ───────────────────────────────────────
function SettingsPage() {
  const { data, reload }     = useApi(() => svc.tolerances(), [], []);
  const [form,   setForm]    = useState({ type:"value", threshold:0.02, tenant_id:"default", supplier_cnpj:"", adjustment_account:"" });
  const [saved,  setSaved]   = useState("");

  const { data: tenantCfg, reload: reloadTenant } = useApi(() => svc.tenantConfig(), {}, []);
  const [tenantForm, setTenantForm] = useState({});
  const [tenantSaved, setTenantSaved] = useState("");

  useEffect(() => { setTenantForm(tenantCfg || {}); }, [tenantCfg]);

  const save = async () => {
    try {
      await svc.saveTolerance(form);
      setSaved("Regra salva ✅"); reload();
    } catch(e) { setSaved("Erro: " + e.message); }
  };

  const saveTenant = async () => {
    try {
      await svc.saveTenantConfig(tenantForm);
      setTenantSaved("Configuração salva ✅"); reloadTenant();
    } catch(e) { setTenantSaved("Erro: " + e.message); }
  };

  return <>
    <Title t="Configurações" sub="RF09, RF15 — Regras de tolerância, multi-tenant e feature flags"/>
    <div className="grid2">
      <div className="panel">
        <h3>Nova Regra de Tolerância (RF09)</h3>
        <label>Tipo <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
          <option value="value">Valor Total (%)</option>
          <option value="quantity">Quantidade (%)</option>
          <option value="tax">Imposto (R$)</option>
        </select></label>
        <label>Limite (decimal, ex: 0.02 = 2%)
          <input type="number" step="0.001" value={form.threshold}
                 onChange={e=>setForm({...form, threshold:parseFloat(e.target.value)})}/>
        </label>
        <label>Tenant (empresa)
          <input value={form.tenant_id} onChange={e=>setForm({...form,tenant_id:e.target.value})}/>
        </label>
        <label>CNPJ Fornecedor (opcional — RF09 regra específica)
          <input value={form.supplier_cnpj} onChange={e=>setForm({...form,supplier_cnpj:e.target.value})}/>
        </label>
        <label>Conta de Ajuste ERP (RN05)
          <input value={form.adjustment_account} onChange={e=>setForm({...form,adjustment_account:e.target.value})}/>
        </label>
        <button onClick={save}>Salvar Regra</button>
        {saved && <div className="apierr">{saved}</div>}
      </div>
      <div className="panel">
        <h3>Regras Ativas</h3>
        {(Array.isArray(data) ? data : []).map(r =>
          <div key={r.id} className="rank">
            <b>{r.type}</b> — Limite: {r.threshold} — Tenant: {r.tenant_id}
            {r.supplier_cnpj && <> — CNPJ: {r.supplier_cnpj}</>}
            {r.adjustment_account && <> — Conta: {r.adjustment_account}</>}
          </div>
        )}
      </div>
    </div>

    <div className="panel" style={{marginTop: 16}}>
      <h3>Configuração do Tenant (RF15)</h3>
      <label>ERP Destino (URL base)
        <input value={tenantForm.erp_destination || ""} onChange={e=>setTenantForm({...tenantForm, erp_destination:e.target.value})}/>
      </label>
      <label>E-mail de notificações
        <input type="email" value={tenantForm.notification_email || ""} onChange={e=>setTenantForm({...tenantForm, notification_email:e.target.value})}/>
      </label>
      <label>Usuários autorizados (e-mails separados por vírgula)
        <input value={tenantForm.users || ""} onChange={e=>setTenantForm({...tenantForm, users:e.target.value})}/>
      </label>
      <button onClick={saveTenant}>Salvar Configuração</button>
      {tenantSaved && <div className="apierr">{tenantSaved}</div>}
    </div>
  </>;
}

// ─── Ajuda ──────────────────────────────────────────────────────
// Telas ilustrativas (mockups SVG) usadas como "print" no passo a passo.
function MockFrame({ active, children }) {
  const items = ["Dashboard", "Inbox", "Exceções", "Lotes", "Upload", "Auditoria", "Config"];
  return (
    <svg viewBox="0 0 460 280" className="mock-screen" xmlns="http://www.w3.org/2000/svg">
      <rect width="460" height="280" fill="#f0f4f8"/>
      <rect width="84" height="280" fill="#0f1c2a"/>
      <rect x="0" y="0" width="84" height="26" fill="#0f1c2a"/>
      <text x="10" y="17" fill="#fff" fontSize="10" fontWeight="800">SUIVIA</text>
      {items.map((it, i) => (
        <g key={it}>
          <rect x="0" y={32 + i * 24} width="84" height="22" fill={it === active ? "#162537" : "transparent"}/>
          <text x="9" y={32 + i * 24 + 14} fill={it === active ? "#6ee7b7" : "#94a3b8"} fontSize="8">{it}</text>
        </g>
      ))}
      <rect x="84" y="0" width="376" height="30" fill="#fff" stroke="#e2e8f0"/>
      <rect x="96" y="8" width="160" height="14" rx="7" fill="#f1f5f9"/>
      {children}
    </svg>
  );
}

function MockLogin() {
  return (
    <svg viewBox="0 0 460 280" className="mock-screen" xmlns="http://www.w3.org/2000/svg">
      <rect width="460" height="280" fill="#0f1c2a"/>
      <rect x="130" y="50" width="200" height="180" rx="12" fill="#fff"/>
      <text x="155" y="85" fontSize="13" fontWeight="800" fill="#0f1c2a">SV SUIVIA</text>
      <text x="155" y="102" fontSize="8" fill="#64748b">Recebimento Fiscal Inteligente</text>
      <rect x="155" y="120" width="150" height="16" rx="4" fill="#f1f5f9" stroke="#cbd5e1"/>
      <text x="160" y="131" fontSize="7" fill="#94a3b8">E-mail</text>
      <rect x="155" y="148" width="150" height="16" rx="4" fill="#f1f5f9" stroke="#cbd5e1"/>
      <text x="160" y="159" fontSize="7" fill="#94a3b8">Senha</text>
      <rect x="155" y="178" width="150" height="22" rx="6" fill="#0f1c2a"/>
      <text x="210" y="192" fontSize="8" fill="#fff" fontWeight="700">Entrar</text>
    </svg>
  );
}

function MockDashboard() {
  return (
    <MockFrame active="Dashboard">
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x={96 + i*88} y="42" width="80" height="46" rx="8" fill="#fff" stroke="#e2e8f0"/>
          <rect x={104 + i*88} y="50" width="40" height="6" rx="3" fill="#cbd5e1"/>
          <rect x={104 + i*88} y="62" width="30" height="14" rx="3" fill={["#0f1c2a","#34d399","#eab308","#ef4444"][i]} opacity="0.85"/>
        </g>
      ))}
      <rect x="96" y="100" width="220" height="150" rx="8" fill="#fff" stroke="#e2e8f0"/>
      <text x="106" y="118" fontSize="9" fontWeight="700" fill="#1e293b">Volume (7 dias)</text>
      {[40,80,55,95,70,60,85].map((h,i) => (
        <rect key={i} x={108 + i*28} y={230-h} width="16" height={h} fill="#34d399" rx="2"/>
      ))}
      <rect x="328" y="100" width="120" height="150" rx="8" fill="#fff" stroke="#e2e8f0"/>
      <text x="338" y="118" fontSize="9" fontWeight="700" fill="#1e293b">Status</text>
      <circle cx="388" cy="175" r="40" fill="none" stroke="#34d399" strokeWidth="14" strokeDasharray="180 70"/>
      <circle cx="388" cy="175" r="40" fill="none" stroke="#eab308" strokeWidth="14" strokeDasharray="40 210" strokeDashoffset="-180"/>
    </MockFrame>
  );
}

function MockUpload() {
  return (
    <MockFrame active="Upload">
      {UPLOAD_TYPES.map((t, i) => (
        <g key={t.id}>
          <rect x={96 + i*90} y="40" width="82" height="50" rx="8" fill={i===0?"#f0fdf4":"#fff"} stroke={i===0?"#34d399":"#e2e8f0"} strokeWidth={i===0?2:1}/>
          <text x={104 + i*90} y="58" fontSize="7" fontWeight="700" fill="#1e293b">{t.label}</text>
          <text x={104 + i*90} y="72" fontSize="6" fill="#94a3b8">{t.desc.slice(0, 26)}…</text>
        </g>
      ))}
      <rect x="96" y="104" width="352" height="130" rx="10" fill="#fff" stroke="#cbd5e1" strokeDasharray="6 4"/>
      <text x="225" y="160" fontSize="10" fill="#1e293b" fontWeight="700" textAnchor="middle">Arraste ou clique para enviar</text>
      <text x="225" y="176" fontSize="8" fill="#94a3b8" textAnchor="middle">XML, PDF, JPG ou PNG</text>
    </MockFrame>
  );
}

function MockInbox() {
  return (
    <MockFrame active="Inbox">
      <rect x="96" y="42" width="352" height="20" rx="4" fill="#0f1c2a"/>
      {["NF-e","Fornecedor","Valor","Score","Status"].map((h,i) =>
        <text key={h} x={104 + i*70} y="56" fontSize="7" fill="#fff">{h}</text>
      )}
      {[0,1,2,3,4].map(r => (
        <g key={r}>
          <rect x="96" y={66 + r*35} width="352" height="32" fill={r%2?"#f8fafc":"#fff"} stroke="#f1f5f9"/>
          <rect x="104" y={78 + r*35} width="50" height="8" rx="2" fill="#cbd5e1"/>
          <rect x="174" y={78 + r*35} width="60" height="8" rx="2" fill="#cbd5e1"/>
          <rect x="244" y={78 + r*35} width="40" height="8" rx="2" fill="#cbd5e1"/>
          <rect x="314" y={78 + r*35} width="36" height="8" rx="4" fill="#34d399" opacity={0.4 + r*0.1}/>
          <rect x="384" y={78 + r*35} width="50" height="14" rx="6" fill={["#dcfce7","#fef9c3","#dbeafe","#fee2e2","#dcfce7"][r]}/>
        </g>
      ))}
    </MockFrame>
  );
}

function MockDetail() {
  return (
    <MockFrame active="Inbox">
      <rect x="96" y="42" width="210" height="200" rx="8" fill="#fafafa" stroke="#e2e8f0"/>
      <text x="106" y="60" fontSize="9" fontWeight="700" fill="#1e293b">DOCUMENTO (NF-e)</text>
      {[0,1,2,3,4,5].map(i =>
        <rect key={i} x="106" y={74 + i*22} width={170 - (i%2)*40} height="8" rx="2" fill="#e2e8f0"/>
      )}
      <rect x="316" y="42" width="132" height="95" rx="8" fill="#fff" stroke="#e2e8f0"/>
      <text x="324" y="58" fontSize="8" fontWeight="700" fill="#1e293b">Divergências</text>
      <rect x="324" y="68" width="116" height="22" rx="4" fill="#fee2e2"/>
      <text x="330" y="82" fontSize="6.5" fill="#991b1b">Preço unitário diverge 6%</text>
      <rect x="324" y="96" width="116" height="22" rx="4" fill="#fef9c3"/>
      <text x="330" y="110" fontSize="6.5" fill="#854d0e">Sugestão de PO encontrada</text>
      <rect x="316" y="146" width="132" height="96" rx="8" fill="#fff" stroke="#e2e8f0"/>
      <text x="324" y="162" fontSize="8" fontWeight="700" fill="#1e293b">Ações</text>
      <rect x="324" y="172" width="116" height="20" rx="6" fill="#16a34a"/>
      <text x="345" y="186" fontSize="8" fill="#fff" fontWeight="700">Aprovar</text>
      <rect x="324" y="198" width="116" height="20" rx="6" fill="#dc2626"/>
      <text x="350" y="212" fontSize="8" fill="#fff" fontWeight="700">Rejeitar</text>
    </MockFrame>
  );
}

function MockExceptions() {
  return (
    <MockFrame active="Exceções">
      {[0,1,2].map(r => (
        <g key={r}>
          <rect x="96" y={42 + r*64} width="352" height="56" rx="8" fill="#fff" stroke="#fca5a5"/>
          <rect x="108" y={54 + r*64} width="120" height="9" rx="2" fill="#1e293b" opacity="0.7"/>
          <rect x="108" y={70 + r*64} width="200" height="7" rx="2" fill="#fee2e2"/>
          <rect x="108" y={82 + r*64} width="60" height="14" rx="6" fill="#0f1c2a"/>
          <text x="118" y={92 + r*64} fontSize="7" fill="#fff">Resolver</text>
        </g>
      ))}
    </MockFrame>
  );
}

function MockBatches() {
  return (
    <MockFrame active="Lotes">
      {[0,1,2,3].map(r => (
        <g key={r}>
          <rect x="96" y={42 + r*48} width="352" height="40" rx="8" fill="#fff" stroke="#e2e8f0"/>
          <text x="108" y={62 + r*48} fontSize="8" fontWeight="700" fill="#1e293b">Lote #{1000+r}</text>
          <rect x="108" y={68 + r*48} width="150" height="6" rx="3" fill="#e2e8f0"/>
          <rect x="108" y={68 + r*48} width={60 + r*30} height="6" rx="3" fill="#34d399"/>
          <rect x="380" y={54 + r*48} width="56" height="16" rx="6" fill="#dbeafe"/>
        </g>
      ))}
    </MockFrame>
  );
}

function MockAudit() {
  return (
    <MockFrame active="Auditoria">
      <rect x="96" y="42" width="352" height="20" rx="4" fill="#0f1c2a"/>
      <rect x="370" y="40" width="70" height="16" rx="6" fill="#16a34a"/>
      <text x="378" y="52" fontSize="6.5" fill="#fff">Exportar CSV</text>
      {[0,1,2,3,4,5].map(r => (
        <g key={r}>
          <rect x="96" y={66 + r*28} width="352" height="26" fill={r%2?"#f8fafc":"#fff"} stroke="#f1f5f9"/>
          <rect x="104" y={75 + r*28} width="70" height="7" rx="2" fill="#cbd5e1"/>
          <rect x="184" y={75 + r*28} width="90" height="7" rx="2" fill="#94a3b8"/>
          <rect x="284" y={75 + r*28} width="100" height="7" rx="2" fill="#e2e8f0"/>
        </g>
      ))}
    </MockFrame>
  );
}

function MockSettings() {
  return (
    <MockFrame active="Config">
      <rect x="96" y="42" width="220" height="200" rx="8" fill="#fff" stroke="#e2e8f0"/>
      <text x="106" y="60" fontSize="9" fontWeight="700" fill="#1e293b">Regras de Tolerância</text>
      {[0,1,2,3].map(i =>
        <rect key={i} x="106" y={72 + i*24} width="200" height="16" rx="4" fill="#f1f5f9" stroke="#cbd5e1"/>
      )}
      <rect x="106" y={72 + 4*24} width="80" height="20" rx="6" fill="#0f1c2a"/>
      <text x="118" y={86 + 4*24} fontSize="7" fill="#fff">Salvar</text>
      <rect x="328" y="42" width="120" height="200" rx="8" fill="#fff" stroke="#e2e8f0"/>
      <text x="338" y="60" fontSize="9" fontWeight="700" fill="#1e293b">Tenant / ERP</text>
      {[0,1,2].map(i =>
        <rect key={i} x="338" y={72 + i*24} width="100" height="16" rx="4" fill="#f1f5f9" stroke="#cbd5e1"/>
      )}
    </MockFrame>
  );
}

function HelpStep({ n, title, mockup, children }) {
  return (
    <div className="panel help-step">
      <div className="help-step-head">
        <span className="help-num">{n}</span>
        <h3>{title}</h3>
      </div>
      <div className="help-step-body">
        <div className="help-text">{children}</div>
        {mockup}
      </div>
    </div>
  );
}

function HelpPage() {
  return <>
    <Title t="Ajuda — Como operar o SUIVIA" sub="Passo a passo com telas do sistema, do login ao fechamento da nota"/>

    <HelpStep n={1} title="Faça login" mockup={<MockLogin/>}>
      <p>Acesse o sistema com o e-mail e a senha cadastrados pelo administrador.</p>
      <ul>
        <li>Informe seu e-mail corporativo.</li>
        <li>Informe a senha fornecida.</li>
        <li>Clique em <b>Entrar</b>.</li>
      </ul>
    </HelpStep>

    <HelpStep n={2} title="Acompanhe o Dashboard" mockup={<MockDashboard/>}>
      <p>A tela inicial mostra os indicadores em tempo real do recebimento fiscal.</p>
      <ul>
        <li><b>Processadas, Touchless, Divergentes, Rejeitadas</b> — visão geral do volume.</li>
        <li>Gráfico de volume dos últimos 7 dias.</li>
        <li>Distribuição de status das notas (gráfico de pizza).</li>
      </ul>
    </HelpStep>

    <HelpStep n={3} title="Envie uma nota (Upload)" mockup={<MockUpload/>}>
      <p>No menu <b>Upload</b>, escolha o canal de entrada e envie o arquivo da nota.</p>
      <ul>
        <li><b>Upload Manual</b> — selecione XML, PDF, JPG ou PNG do computador.</li>
        <li><b>Câmera Mobile</b> — fotografe a nota direto pelo celular.</li>
        <li><b>E-mail</b> — notas encaminhadas para o e-mail monitorado entram automaticamente.</li>
        <li><b>API Externa</b> — sistemas integrados enviam notas via API.</li>
        <li>Arraste o arquivo na área pontilhada ou clique para selecionar.</li>
        <li>Acompanhe o progresso do envio na lista abaixo.</li>
      </ul>
    </HelpStep>

    <HelpStep n={4} title="Revise a fila no Inbox" mockup={<MockInbox/>}>
      <p>Todas as notas recebidas aparecem no <b>Inbox</b>, já com o score de aderência calculado.</p>
      <ul>
        <li>Use a busca para localizar por NF-e, CNPJ, pedido ou lote.</li>
        <li>O <b>Score</b> indica o grau de aderência ao pedido de compra (PO).</li>
        <li>Clique em uma linha para abrir o detalhe da nota.</li>
      </ul>
    </HelpStep>

    <HelpStep n={5} title="Analise e aprove a nota" mockup={<MockDetail/>}>
      <p>Na tela de detalhe, compare o documento extraído com o pedido de compra.</p>
      <ul>
        <li>O painel esquerdo mostra os dados extraídos da nota (Textract/XML).</li>
        <li>Divergências encontradas aparecem destacadas à direita.</li>
        <li>Use <b>Vincular PO</b> para associar manualmente um pedido sugerido.</li>
        <li><b>Aprovar</b> envia a nota para o ERP; <b>Rejeitar</b> bloqueia o pagamento.</li>
      </ul>
    </HelpStep>

    <HelpStep n={6} title="Trate as Exceções" mockup={<MockExceptions/>}>
      <p>Notas com divergências críticas ficam na fila de <b>Exceções</b>, aguardando decisão.</p>
      <ul>
        <li>Cada cartão mostra o motivo da divergência.</li>
        <li>Clique em <b>Resolver</b> para abrir o detalhe e decidir (aprovar/rejeitar/ajustar).</li>
        <li>É possível resolver várias notas em lote.</li>
      </ul>
    </HelpStep>

    <HelpStep n={7} title="Acompanhe os Lotes" mockup={<MockBatches/>}>
      <p>A tela de <b>Lotes</b> agrupa as notas pelo lote de origem (upload, e-mail, etc.).</p>
      <ul>
        <li>Veja o progresso de processamento de cada lote.</li>
        <li>Clique em um lote para ver as notas que o compõem.</li>
      </ul>
    </HelpStep>

    <HelpStep n={8} title="Consulte a Auditoria" mockup={<MockAudit/>}>
      <p>Todas as ações realizadas no sistema ficam registradas em <b>Auditoria</b>.</p>
      <ul>
        <li>Histórico completo: data/hora, ação, entidade e usuário responsável.</li>
        <li>Use <b>Exportar CSV</b> para baixar o log completo para análise externa.</li>
      </ul>
    </HelpStep>

    <HelpStep n={9} title="Configure regras e tenant" mockup={<MockSettings/>}>
      <p>Em <b>Config</b>, ajuste as regras de tolerância e os dados da empresa.</p>
      <ul>
        <li>Defina tolerâncias de valor, quantidade e imposto por fornecedor.</li>
        <li>Configure o ERP de destino, e-mail de notificações e usuários autorizados.</li>
      </ul>
    </HelpStep>
  </>;
}

// ─── Helpers UI ──────────────────────────────────────────────────
function Title({ t, sub }) {
  return <div className="page-title"><h1>{t}</h1><p>{sub}</p></div>;
}

// ─── Protected route ─────────────────────────────────────────────
function Protected({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace/>;
}

// ─── App ─────────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/*" element={
            <Protected>
              <Layout>
                <Routes>
                  <Route path="/"           element={<Navigate to="/dashboard" replace/>}/>
                  <Route path="/dashboard"  element={<Dashboard/>}/>
                  <Route path="/inbox"      element={<InboxPage/>}/>
                  <Route path="/invoice/:id"element={<Detail/>}/>
                  <Route path="/exceptions" element={<Exceptions/>}/>
                  <Route path="/batches"    element={<Batches/>}/>
                  <Route path="/batches/:id"element={<Batches/>}/>
                  <Route path="/upload"     element={<UploadPage/>}/>
                  <Route path="/audit"      element={<Audit/>}/>
                  <Route path="/settings"   element={<SettingsPage/>}/>
                  <Route path="/help"       element={<HelpPage/>}/>
                </Routes>
              </Layout>
            </Protected>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")).render(<App/>);

// RF13 — registra o service worker para uso offline da Câmera SUIVIA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
