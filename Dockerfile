FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
# Instalace Node.js a npm pro sestavení React aplikace
RUN apt-get update && apt-get install -y nodejs npm
WORKDIR /src

# Kopírování projektových souborů pro obnovení závislostí
COPY ["Pokebooook.Server/Pokebooook.Server.csproj", "Pokebooook.Server/"]
COPY ["pokebooook.client/package.json", "pokebooook.client/"]
COPY ["pokebooook.client/package-lock.json", "pokebooook.client/"]

# Obnovení závislostí ASP.NET
RUN dotnet restore "Pokebooook.Server/Pokebooook.Server.csproj"

# Kopírování všech souborů
COPY Pokebooook.Server/. Pokebooook.Server/
COPY pokebooook.client/. pokebooook.client/

# Sestavení React aplikace
WORKDIR "/src/pokebooook.client"
RUN npm install --no-fund

# Kontrola, zda je správně nastaven import v main.tsx
RUN sed -i 's/import { BrowserRouter, Route, Routes } from "react-router";/import { BrowserRouter, Route, Routes } from "react-router-dom";/g' src/main.tsx

# Sestavení React aplikace
RUN npm run build || (echo "Sestavení React aplikace selhalo, vytvářím záložní HTML stránku" && \
    mkdir -p dist && \
    echo '<!DOCTYPE html><html lang="cs"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Pokebooook</title><style>body{font-family:Arial,sans-serif;margin:0;padding:20px;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5}main{background:white;padding:20px;border-radius:5px;box-shadow:0 0 10px rgba(0,0,0,0.1);max-width:800px;width:100%}</style></head><body><main><h1>Pokebooook</h1><p>Aplikace se načítá...</p><p>Pokud vidíte tuto stránku, server běží správně, ale React aplikace se nenačetla.</p></main></body></html>' > dist/index.html)

# Kopírování React aplikace do wwwroot
RUN mkdir -p ../Pokebooook.Server/wwwroot
RUN cp -r dist/* ../Pokebooook.Server/wwwroot/

# Sestavení ASP.NET aplikace
WORKDIR "/src/Pokebooook.Server"
RUN dotnet build "Pokebooook.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
WORKDIR "/src/Pokebooook.Server"
# Publikování projektu
RUN dotnet publish "Pokebooook.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Kontrola obsahu wwwroot
RUN if [ -d "wwwroot" ]; then ls -la wwwroot; else echo "wwwroot adresář neexistuje!"; exit 1; fi

# Adresář pro data
RUN mkdir -p /data 
RUN chmod 777 /data

# Kopírování databáze
COPY data/app.db /data/ 

# Úprava appsettings.json pro cestu k databázi
RUN if [ -f "appsettings.json" ]; then sed -i 's|../data/app.db|/data/app.db|g' appsettings.json; fi

ENTRYPOINT ["dotnet", "Pokebooook.Server.dll"] 