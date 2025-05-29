# שלב בנייה עם ה-SDK של דוטנט
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

COPY ["ExamPRO.API.csproj", "."]
RUN dotnet restore "ExamPRO.API.csproj"

COPY . .
RUN dotnet publish "ExamPRO.API.csproj" -c Release -o /app/publish

# שלב הרצה עם runtime בלבד
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80

ENTRYPOINT ["dotnet", "ExamPRO.API.dll"]
