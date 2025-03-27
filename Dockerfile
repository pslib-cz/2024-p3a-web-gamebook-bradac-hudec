# Použijeme oficiální .NET SDK image pro build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Zkopírujeme projektový soubor serveru
COPY ["Pokebooook.Server/Pokebooook.Server.csproj", "Pokebooook.Server/"]

# Obnovíme závislosti
RUN dotnet restore "Pokebooook.Server/Pokebooook.Server.csproj"

# Zkopírujeme zbytek zdrojového kódu
COPY . .

# Build aplikace
RUN dotnet build "Pokebooook.Server/Pokebooook.Server.csproj" -c Release -o /app/build

# Publikujeme aplikaci
FROM build AS publish
RUN dotnet publish "Pokebooook.Server/Pokebooook.Server.csproj" -c Release -o /app/publish

# Vytvoříme finální image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Vytvoříme složku pro data a nastavíme oprávnění
RUN mkdir -p /data && \
    chown -R 1000:1000 /data && \
    chmod 755 /data

# Zkopírujeme publikované soubory
COPY --from=publish /app/publish .

# Nastavíme proměnné prostředí
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_DATA_DIR=/data

# Nastavíme uživatele pro běh aplikace
USER 1000

# Exponujeme port 80
EXPOSE 80

# Spustíme aplikaci
ENTRYPOINT ["dotnet", "Pokebooook.Server.dll"] 