FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Kopírování projektových souborů pro obnovení závislostí
COPY ["Pokebooook.Server/Pokebooook.Server.csproj", "Pokebooook.Server/"]

# Obnovení závislostí ASP.NET
RUN dotnet restore "Pokebooook.Server/Pokebooook.Server.csproj"

# Kopírování všech souborů serveru
COPY Pokebooook.Server/. Pokebooook.Server/

# Kopírování již sestavené React aplikace
COPY pokebooook.client/dist/. Pokebooook.Server/wwwroot/

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