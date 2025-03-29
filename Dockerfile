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

# Oprava importů v main.tsx - změna z react-router na react-router-dom
RUN sed -i 's/import { BrowserRouter, Route, Routes } from "react-router";/import { BrowserRouter, Route, Routes } from "react-router-dom";/g' pokebooook.client/src/main.tsx

# Sestavení React aplikace
WORKDIR "/src/pokebooook.client"
RUN npm install && npm run build

# Kontrola a kopírování sestavené React aplikace
RUN if [ -d "dist" ]; then ls -la dist && cp -r dist/* ../Pokebooook.Server/wwwroot/; else echo "Sestavení React aplikace selhalo"; exit 1; fi

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