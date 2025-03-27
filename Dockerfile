FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Zkopírujeme všechny projektové soubory
COPY ["Pokebooook.Server/Pokebooook.Server.csproj", "Pokebooook.Server/"]
COPY ["pokebooook.client/pokebooook.client.csproj", "pokebooook.client/"]

# Obnovíme závislosti
RUN dotnet restore "Pokebooook.Server/Pokebooook.Server.csproj"


COPY . .


RUN dotnet build "Pokebooook.Server/Pokebooook.Server.csproj" -c Release -o /app/build


FROM build AS publish
RUN dotnet publish "Pokebooook.Server/Pokebooook.Server.csproj" -c Release -o /app/publish


FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app


RUN mkdir -p /data


COPY --from=publish /app/publish .


ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production


EXPOSE 80


ENTRYPOINT ["dotnet", "Pokebooook.Server.dll"] 