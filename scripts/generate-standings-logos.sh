#!/usr/bin/env bash
set -euo pipefail

mkdir -p public/mascots/standings

logos=(
  anacostia
  ballou
  bell
  cardozo
  coolidge
  dunbar
  eastern
  hd-woodson
  jackson-reed
  mckinley-tech
  phelps-ace
  ron-brown
  roosevelt
  archbishop-carroll
  bishop-mcnamara
  dematha
  gonzaga
  good-counsel
  digital-pioneers-academy
  kipp-college-prep
  kipp-dc-legacy
  sidwell-friends
  st-johns
)

for name in "${logos[@]}"; do
  src="public/mascots/${name}.svg"

  if [[ ! -f "$src" ]]; then
    echo "Skipping missing $src"
    continue
  fi

  echo "Rasterizing $src for standings..."
  npx --yes sharp-cli@6.0.0 \
    -i "$src" \
    -o public/mascots/standings \
    -f png \
    resize 128 128

done
