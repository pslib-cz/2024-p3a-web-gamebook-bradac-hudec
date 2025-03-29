#!/bin/bash
set -e

echo "==== Kontrola ASP.NET projektu ===="

if [ ! -d "Pokebooook.Server" ]; then
  echo "CHYBA: Složka Pokebooook.Server neexistuje!"
  exit 1
fi

if [ ! -f "Pokebooook.Server/Pokebooook.Server.csproj" ]; then
  echo "CHYBA: Soubor Pokebooook.Server.csproj neexistuje!"
  exit 1
fi

echo "Obsah Pokebooook.Server.csproj:"
cat Pokebooook.Server/Pokebooook.Server.csproj

if [ ! -f "Pokebooook.Server/Program.cs" ]; then
  echo "CHYBA: Soubor Program.cs neexistuje!"
  exit 1
fi

echo "Obsah Program.cs:"
cat Pokebooook.Server/Program.cs

if [ -d "pokebooook.client" ]; then
  echo "Klientská složka existuje"
  
  if [ -f "pokebooook.client/package.json" ]; then
    echo "package.json existuje"
    cat pokebooook.client/package.json
  else
    echo "CHYBA: package.json neexistuje!"
  fi
  
  if [ -f "pokebooook.client/pokebooook.client.esproj" ]; then
    echo "pokebooook.client.esproj existuje"
    cat pokebooook.client/pokebooook.client.esproj
  else
    echo "CHYBA: pokebooook.client.esproj neexistuje!"
  fi
else
  echo "CHYBA: Klientská složka neexistuje!"
fi

echo "==== Seznam všech .csproj a .esproj souborů v repozitáři ===="
find . -name "*.csproj" -o -name "*.esproj"

echo "==== Konec kontroly ====" 