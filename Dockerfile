# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
RUN apt update && apt install nodejs npm -y
WORKDIR /src

# Kopírování celého projektu najednou
COPY . .

# Nejprve sestavíme klientskou React aplikaci
WORKDIR "/src/pokebooook.client"
RUN npm install
RUN npm run build

# Poté sestavíme server projekt
WORKDIR "/src/Pokebooook.Server"
RUN dotnet restore "Pokebooook.Server.csproj" --verbosity detailed
RUN dotnet build "Pokebooook.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build --verbosity detailed

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
WORKDIR "/src/Pokebooook.Server"
# Zkusíme publikovat s explicitními paramerty
RUN dotnet publish "Pokebooook.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false /p:SpaProxyServerUrl=http://localhost:5173 --verbosity detailed

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# Vytvoření adresáře /data a přesun databáze
RUN mkdir -p /data
COPY --from=publish /src/data/app.db /data/app.db || true
RUN chmod 777 /data
# Upravit appsettings.json, aby ukazoval na správnou cestu k databázi
RUN sed -i 's/\.\.\/data\/app\.db/\/data\/app\.db/g' appsettings.json || true
ENTRYPOINT ["dotnet", "Pokebooook.Server.dll"]
