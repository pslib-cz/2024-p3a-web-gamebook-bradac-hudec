FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Pokebooook.Server/Pokebooook.Server.csproj", "Pokebooook.Server/"]
COPY ["pokebooook.client/package.json", "pokebooook.client/"]

RUN dotnet restore "Pokebooook.Server/Pokebooook.Server.csproj"
COPY . .
WORKDIR "/src/Pokebooook.Server"
RUN dotnet build "Pokebooook.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN apt-get update && apt-get install -y nodejs npm
WORKDIR "/src/pokebooook.client"
RUN npm install
RUN npm run build
WORKDIR "/src/Pokebooook.Server"
RUN dotnet publish "Pokebooook.Server.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
RUN mkdir -p /data
# Přesunout databázi do /data (pokud existuje)
COPY --from=publish /src/data/app.db /data/app.db
# Změnit vlastníka adresáře /data
RUN chmod 777 /data
# Upravit appsettings.json, aby ukazoval na správnou cestu k databázi
RUN sed -i 's/\.\.\/data\/app\.db/\/data\/app\.db/g' appsettings.json

ENTRYPOINT ["dotnet", "Pokebooook.Server.dll"] 