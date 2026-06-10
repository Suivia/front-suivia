#!/usr/bin/env bash
# Generates .env.local from the Terraform outputs of ../suivia-infra.
set -euo pipefail
INFRA="${1:-../suivia-infra}"
out() { terraform -chdir="$INFRA" output -raw "$1"; }

cat > .env.local <<EOF
VITE_API_BASE_URL=$(out api_url)
VITE_WS_URL=$(out ws_url)
VITE_COGNITO_REGION=$(out region)
VITE_COGNITO_USER_POOL_ID=$(out user_pool_id)
VITE_COGNITO_CLIENT_ID=$(out user_pool_client_id)
VITE_S3_BUCKET=$(out raw_bucket)
EOF
echo "Wrote .env.local from Terraform outputs in $INFRA"
