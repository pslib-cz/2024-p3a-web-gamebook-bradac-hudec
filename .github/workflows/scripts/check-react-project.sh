#!/bin/bash
set -e

echo "==== Kontrola React projektu ===="

if [ ! -d "pokebooook.client" ]; then
  echo "CHYBA: Složka pokebooook.client neexistuje!"
  exit 1
fi

echo "Obsah složky pokebooook.client:"
ls -la pokebooook.client

if [ -f "pokebooook.client/package.json" ]; then
  echo "Obsah package.json:"
  cat pokebooook.client/package.json
  
  echo "Kontrola skriptů v package.json:"
  # Extrahování skriptů z package.json pomocí grep
  grep -A 10 '"scripts"' pokebooook.client/package.json
else
  echo "CHYBA: Soubor package.json neexistuje!"
  exit 1
fi

if [ -f "pokebooook.client/vite.config.ts" ]; then
  echo "Obsah vite.config.ts:"
  cat pokebooook.client/vite.config.ts
else
  echo "VAROVÁNÍ: Soubor vite.config.ts neexistuje!"
fi

if [ -d "pokebooook.client/src" ]; then
  echo "Obsah složky src:"
  ls -la pokebooook.client/src
else
  echo "CHYBA: Složka src neexistuje!"
  exit 1
fi

echo "==== Konec kontroly React projektu ====" 