import React, { createContext, useContext, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, NavLink, useNavigate, useParams, Navigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, LineChart, Line } from "recharts";
import { LayoutDashboard, Inbox, AlertTriangle, Layers, Camera, Settings, Search, Bell, Upload, RefreshCw, CheckCircle2, XCircle, Eye, ShieldCheck, FileText, LogOut, Zap, Clock, Download, ChevronRight, Filter, BookOpen } from "lucide-react";
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
    ["/camera",     "SUIVIA Camera",Camera],
    ["/audit",      "Auditoria",    BookOpen],
    ["/settings",   "Config",       Settings],
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

// ─── Camera / Upload (RF01, RF13) ────────────────────────────────
function CameraPage() {
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
    <Title t="SUIVIA Camera / Upload" sub="RF01, RF13 — Upload multicanal direto para S3 via presigned URL"/>
    {!online && <div className="apierr">⚠ Sem conexão — capturas serão sincronizadas automaticamente ao reconectar.</div>}
    {pending > 0 && <div className="apierr">📥 {pending} arquivo(s) pendente(s) de sincronização.</div>}
    <div className="panel">
      <div className="form-row">
        <label>Origem do arquivo:
          <select value={source} onChange={e => setSource(e.target.value)}>
            <option value="upload">Upload Manual</option>
            <option value="camera">Câmera Mobile</option>
            <option value="email">E-mail</option>
            <option value="api">API Externa</option>
          </select>
        </label>
      </div>
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
                  <Route path="/camera"     element={<CameraPage/>}/>
                  <Route path="/audit"      element={<Audit/>}/>
                  <Route path="/settings"   element={<SettingsPage/>}/>
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
