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
COPY ["pokebooook.client/package-lock.json", "pokebooook.client/"] 2>/dev/null || true

# Obnovení závislostí ASP.NET
RUN dotnet restore "Pokebooook.Server/Pokebooook.Server.csproj"

# Kopírování všech souborů
COPY . .

# Sestavení React aplikace
WORKDIR "/src/pokebooook.client"
RUN npm install
# Více informací o buildu pro lepší debug
RUN npm run build && ls -la dist

# Kontrola, zda se React aplikace správně sestavila
RUN if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then echo "CHYBA: React build selhal nebo je prázdný"; exit 1; fi

# Sestavení ASP.NET aplikace
WORKDIR "/src/Pokebooook.Server"
RUN dotnet build "Pokebooook.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
WORKDIR "/src/Pokebooook.Server"
# Publikování projektu včetně SPA - přidány další parametry pro debug
RUN dotnet publish "Pokebooook.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false --verbosity detailed

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Kontrola obsahu wwwroot - tam by měly být soubory React aplikace
RUN ls -la wwwroot || echo "wwwroot adresář neexistuje!"

# Adresář pro data
RUN mkdir -p /data 
RUN chmod 777 /data

# Kopírování databáze
COPY data/app.db /data/ 

# Úprava appsettings.json pro cestu k databázi
RUN if [ -f "appsettings.json" ]; then sed -i 's|../data/app.db|/data/app.db|g' appsettings.json; fi

ENTRYPOINT ["dotnet", "Pokebooook.Server.dll"] 