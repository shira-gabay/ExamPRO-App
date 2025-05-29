# שלב בנייה עם ה-SDK של דוטנט 8
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["ExamPRO.API.csproj", "."]
RUN dotnet restore "ExamPRO.API.csproj"

COPY . .
RUN dotnet publish "ExamPRO.API.csproj" -c Release -o /app/publish

# שלב הרצה עם runtime בלבד של דוטנט 8
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80

ENTRYPOINT ["dotnet", "ExamPRO.API.dll"]
