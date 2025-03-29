FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
RUN apt update && apt install nodejs npm -y
WORKDIR /src
COPY ["Pokebooook.Server/Pokebooook.Server.csproj", "Pokebooook.Server/"]
COPY ["pokebooook.client/pokebooook.client.esproj", "pokebooook.client/"]
RUN dotnet restore "Pokebooook.Server/Pokebooook.Server.csproj"
COPY . .
WORKDIR "/src/Pokebooook.Server"
RUN dotnet build "Pokebooook.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Pokebooook.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Adresář pro data
RUN mkdir -p /data && chmod 777 /data
COPY --from=build /src/data/app.db /data/ 2>/dev/null || true

# Úprava appsettings.json pro cestu k databázi
RUN grep -q "../data/app.db" appsettings.json && sed -i 's|../data/app.db|/data/app.db|g' appsettings.json || true

ENTRYPOINT ["dotnet", "Pokebooook.Server.dll"] 