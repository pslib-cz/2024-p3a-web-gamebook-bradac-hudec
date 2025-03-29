FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Kopírujeme pouze .csproj server projektu
COPY ["Pokebooook.Server/Pokebooook.Server.csproj", "Pokebooook.Server/"]
# Obnovíme závislosti serveru
RUN dotnet restore "Pokebooook.Server/Pokebooook.Server.csproj"

# Teď kopírujeme všechny zdrojové soubory
COPY . .

# Sestavíme serverový projekt
WORKDIR "/src/Pokebooook.Server"
RUN dotnet build "Pokebooook.Server.csproj" -c Release -o /app/build

FROM build AS publish
# Instalace Node.js a npm pro sestavení React aplikace
RUN apt-get update && apt-get install -y nodejs npm

# Nejdříve sestavíme React aplikaci
WORKDIR "/src/pokebooook.client"
RUN npm install
RUN npm run build

# Poté publikujeme ASP.NET aplikaci
WORKDIR "/src/Pokebooook.Server"
RUN dotnet publish "Pokebooook.Server.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
RUN mkdir -p /data
# Přesunout databázi do /data (pokud existuje)
COPY --from=publish /src/data/app.db /data/app.db || true
# Změnit vlastníka adresáře /data
RUN chmod 777 /data
# Upravit appsettings.json, aby ukazoval na správnou cestu k databázi
RUN sed -i 's/\.\.\/data\/app\.db/\/data\/app\.db/g' appsettings.json || true

ENTRYPOINT ["dotnet", "Pokebooook.Server.dll"] 