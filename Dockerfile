# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Kopírování všeho
COPY . .

# Publikování serveru
WORKDIR /app/Pokebooook.Server
RUN dotnet publish -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out .

# Příprava složky data
RUN mkdir -p /data
RUN chmod 777 /data

# Kopírování databáze - ošetření chyby pomocí -f
RUN if [ -f "data/app.db" ]; then cp data/app.db /data/; fi

# Úprava cesty v konfiguraci - ošetření chyby pomocí -f
RUN if [ -f "appsettings.json" ]; then sed -i 's/\.\.\/data\/app\.db/\/data\/app\.db/g' appsettings.json; fi

EXPOSE 80
ENTRYPOINT ["dotnet", "Pokebooook.Server.dll"]
