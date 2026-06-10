import client from "./client";

export const svc = {
  // Auth
  login: (email, pw) => import("../auth/cognito").then(m => m.login(email, pw)),

  // RF12 — Dashboard
  dashboard: () => client.get("/dashboard"),

  // RF01 / RF02 — Inbox + Batches
  inbox:    params => client.get("/invoices/inbox", { params }),
  invoice:  id     => client.get(`/invoices/${id}`),

  // RF01 — Upload presign + S3 direto
  presign: body     => client.post("/invoices/presign", body),
  uploadS3: (url, file, onProgress) => import("axios").then(({ default: ax }) =>
    ax.put(url, file, {
      headers: { "Content-Type": file.type || "application/octet-stream" },
      onUploadProgress: ev => onProgress && onProgress(Math.round(ev.loaded * 100 / ev.total))
    })
  ),

  // RF08 — Approval / Reject
  approve: (id, body) => client.post(`/invoices/${id}/approve`, body),
  reject:  (id, body) => client.post(`/invoices/${id}/reject`,  body),
  linkPO:  (id, body) => client.post(`/invoices/${id}/purchase-order`, body),

  // RF07 — Sugestão inteligente de POs
  poSuggestions: id => client.get(`/invoices/${id}/po-suggestions`),

  // RF10 — Exceptions
  exceptions:  params => client.get("/exceptions", { params }),
  bulkApprove: body   => client.post("/exceptions/bulk-approve", body),

  // RF02 — Batches
  batches: () => client.get("/batches"),
  batch:   id => client.get(`/batches/${id}`),

  // RF09 / RF15 — Tolerances / Settings
  tolerances:     ()   => client.get("/settings/tolerances"),
  saveTolerance:  body => client.post("/settings/tolerances", body),

  // RF15 — Configuração multi-tenant
  tenantConfig:     ()   => client.get("/settings/tenant"),
  saveTenantConfig: body => client.post("/settings/tenant", body),

  // RF14 — Audit
  audit: params => client.get("/audit", { params }),
  auditExport: () => client.get("/audit", { params: { format: "csv" }, responseType: "blob" }),
};
