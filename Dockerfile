FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
RUN apt update && apt install nodejs npm -y
WORKDIR /src
COPY ["Pokebooook.Server/Pokebooook.Server.csproj", "Pokebooook.Server/"]
COPY ["pokebooook.client/pokebooook.client.esproj", "pokebooook.client/"]
COPY ["pokebooook.client/package.json", "pokebooook.client/"]

# Obnovení závislostí ASP.NET
RUN dotnet restore "Pokebooook.Server/Pokebooook.Server.csproj"

# Kopírování všech souborů
COPY . .

# Sestavení React aplikace
WORKDIR "/src/pokebooook.client"
RUN npm install
RUN npm run build

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

# Adresář pro data
RUN mkdir -p /data 
RUN chmod 777 /data

# Kopírování databáze
COPY data/app.db /data/ 

# Úprava appsettings.json pro cestu k databázi
RUN if [ -f "appsettings.json" ]; then sed -i 's|../data/app.db|/data/app.db|g' appsettings.json; fi

ENTRYPOINT ["dotnet", "Pokebooook.Server.dll"] 