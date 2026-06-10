#!/usr/bin/env bash
# Builds the SPA and publishes it to the S3 + CloudFront stack from ../suivia-infra.
set -euo pipefail
INFRA="${1:-../suivia-infra}"
out() { terraform -chdir="$INFRA" output -raw "$1"; }

npm run build

bucket=$(out frontend_bucket)
dist_id=$(out frontend_distribution_id)
url=$(out frontend_url)

aws s3 sync dist "s3://$bucket" --delete
aws cloudfront create-invalidation --distribution-id "$dist_id" --paths "/*" >/dev/null

echo "Deployed to $url"
