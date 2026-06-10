# Generates .env.local from the Terraform outputs of ..\suivia-infra
param([string]$Infra = "..\suivia-infra")

function Out-Tf($name) { terraform -chdir="$Infra" output -raw $name }

@"
VITE_API_BASE_URL=$(Out-Tf api_url)
VITE_WS_URL=$(Out-Tf ws_url)
VITE_COGNITO_REGION=$(Out-Tf region)
VITE_COGNITO_USER_POOL_ID=$(Out-Tf user_pool_id)
VITE_COGNITO_CLIENT_ID=$(Out-Tf user_pool_client_id)
VITE_S3_BUCKET=$(Out-Tf raw_bucket)
"@ | Out-File -FilePath ".env.local" -Encoding utf8

Write-Host "Wrote .env.local from Terraform outputs in $Infra"
