FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-bionic AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
FROM mcr.microsoft.com/dotnet/core/sdk:3.1-bionic AS build
WORKDIR /src
COPY ["Api.FinanSys.csproj", ""]
RUN dotnet restore "./Api.FinanSys.csproj"
COPY . .
WORKDIR "/src/."
ENV ENVIRONMENT=Production
RUN dotnet build "Api.FinanSys.csproj" -c Release -o /app/build
FROM build AS publish
RUN dotnet publish "Api.FinanSys.csproj" -c Release -o /app/publish
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Api.FinanSys.dll"]
RUN mkdir -p Resources/Imports

