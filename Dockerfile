# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# This stage is used to build the service project
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

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Pokebooook.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# Vytvoření adresáře /data a přesun databáze
RUN mkdir -p /data
COPY --from=publish /src/data/app.db /data/app.db || echo "Databáze neexistuje"
RUN chmod 777 /data
# Upravit appsettings.json, aby ukazoval na správnou cestu k databázi
RUN sed -i 's/\.\.\/data\/app\.db/\/data\/app\.db/g' appsettings.json || echo "Úprava konfigurace se nezdařila"
ENTRYPOINT ["dotnet", "Pokebooook.Server.dll"]
