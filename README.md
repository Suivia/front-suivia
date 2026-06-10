# SUIVIA — Frontend (React + Vite)

SPA do SUIVIA: React 18 + Vite, integrada via Axios à API REST (API Gateway),
WebSocket e autenticação **Cognito**. Aponta para a infra em `../suivia-infra`.

> Versão única (a antiga UI mock + a página de teste standalone foram removidas).

## Rodar
```bash
npm install

# gere o .env.local a partir dos outputs do Terraform (../suivia-infra)
./gen-env.ps1        # Windows
# ./gen-env.sh       # bash
#  ...ou copie .env.example -> .env.local e preencha manualmente

npm run dev          # desenvolvimento (HMR)
npm run build        # produção -> dist/
npm run preview      # serve o build
```

## Variáveis (`.env.local`)
| Var | Output Terraform |
|---|---|
| `VITE_API_BASE_URL` | `api_url` |
| `VITE_WS_URL` | `ws_url` |
| `VITE_COGNITO_REGION` | `region` |
| `VITE_COGNITO_USER_POOL_ID` | `user_pool_id` |
| `VITE_COGNITO_CLIENT_ID` | `user_pool_client_id` |
| `VITE_S3_BUCKET` | `raw_bucket` |

## Páginas
Login, Dashboard (RF12), Inbox (RF01/02), Detalhe/match (RF08/11), Exceptions (RF10),
Batches (RF02), Camera/upload (RF01/13), Audit (RF14), Settings/tolerâncias (RF09/15).

## Notas
- `services.linkPO` chama `POST /invoices/{id}/purchase-order`, rota ainda **não** provisionada
  na infra/backend — vincular PO manualmente ainda não tem endpoint. As demais chamadas batem com a API.
- Deploy estático sugerido: `dist/` em S3 + CloudFront (não incluído no Terraform atual).
