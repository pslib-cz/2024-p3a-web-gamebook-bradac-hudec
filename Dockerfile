FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
RUN apt update && apt install nodejs npm -y
WORKDIR /src

# Kopírování projektových souborů pro obnovení závislostí
COPY ["Pokebooook.Server/Pokebooook.Server.csproj", "Pokebooook.Server/"]
COPY ["pokebooook.client/pokebooook.client.esproj", "pokebooook.client/"]
COPY ["pokebooook.client/package.json", "pokebooook.client/"]
# Pokus o kopírování package-lock.json, pokud existuje (bez || operátoru)
RUN if [ -f "pokebooook.client/package-lock.json" ]; then cp "pokebooook.client/package-lock.json" "pokebooook.client/"; fi

# Obnovení závislostí ASP.NET
RUN dotnet restore "Pokebooook.Server/Pokebooook.Server.csproj"

# Kopírování všech souborů
COPY . .

# Oprava React chyby před sestavením - úprava importů v main.tsx
WORKDIR "/src/pokebooook.client"
RUN if [ -f "src/main.tsx" ]; then sed -i "s/import { BrowserRouter, Route, Routes } from \"react-router\";/import { BrowserRouter, Route, Routes } from \"react-router-dom\";/g" src/main.tsx; fi

# Sestavení React aplikace
RUN npm install
# Pokud by došlo k chybě, pokusíme se o opravení TypeScript konfigurace
RUN npm run build || (echo "Opravuji TypeScript konfiguraci..." && \
    if [ -f "tsconfig.json" ]; then echo '{"compilerOptions":{"target":"ES2020","useDefineForClassFields":true,"lib":["ES2020","DOM","DOM.Iterable"],"module":"ESNext","skipLibCheck":true,"moduleResolution":"bundler","allowImportingTsExtensions":true,"resolveJsonModule":true,"isolatedModules":true,"noEmit":true,"jsx":"react-jsx","strict":true,"noUnusedLocals":true,"noUnusedParameters":true,"noFallthroughCasesInSwitch":true},"include":["src"],"references":[{"path":"./tsconfig.node.json"}]}' > tsconfig.app.json; fi && \
    npm run build)

# Kontrola výsledku React buildu
RUN if [ -d "dist" ]; then ls -la dist; else echo "React build stále selhal, adresář dist neexistuje"; exit 1; fi

# Sestavení ASP.NET aplikace
WORKDIR "/src/Pokebooook.Server"
RUN dotnet build "Pokebooook.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
WORKDIR "/src/Pokebooook.Server"
# Publikování projektu včetně SPA
RUN dotnet publish "Pokebooook.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Kontrola obsahu wwwroot - tam by měly být soubory React aplikace
RUN if [ -d "wwwroot" ]; then ls -la wwwroot; else echo "wwwroot adresář neexistuje!"; exit 1; fi

# Adresář pro data
RUN mkdir -p /data 
RUN chmod 777 /data

# Kopírování databáze
COPY data/app.db /data/ 

# Úprava appsettings.json pro cestu k databázi
RUN if [ -f "appsettings.json" ]; then sed -i 's|../data/app.db|/data/app.db|g' appsettings.json; fi

ENTRYPOINT ["dotnet", "Pokebooook.Server.dll"] 