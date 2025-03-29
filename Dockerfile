# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Kopírování zdrojových souborů
COPY . .

# Sestavení a publikování
WORKDIR /src/Pokebooook.Server
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Příprava adresáře pro data
RUN mkdir -p /data
RUN chmod 777 /data

# Kopírování databáze
COPY data/app.db /data/app.db 2>/dev/null || true

# Úprava konfigurace pro cestu k databázi
RUN if [ -f "appsettings.json" ]; then sed -i 's|../data/app.db|/data/app.db|g' appsettings.json; fi

EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet", "Pokebooook.Server.dll"]
