# Builds the SPA and publishes it to the S3 + CloudFront stack from ../suivia-infra.
param([string]$Infra = "..\suivia-infra")

function Out-Tf($name) { terraform -chdir="$Infra" output -raw $name }

npm run build
if ($LASTEXITCODE -ne 0) { throw "build failed" }

$bucket = Out-Tf frontend_bucket
$distId = Out-Tf frontend_distribution_id
$url    = Out-Tf frontend_url

aws s3 sync dist "s3://$bucket" --delete
aws cloudfront create-invalidation --distribution-id $distId --paths "/*" | Out-Null

Write-Host "Deployed to $url"
