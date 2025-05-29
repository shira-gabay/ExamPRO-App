# שלב בנייה עם ה-SDK של דוטנט
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

COPY ["ExamPRO.API/ExamPRO.API.csproj", "ExamPRO.API/"]
RUN dotnet restore "ExamPRO.API/ExamPRO.API.csproj"

COPY . .
WORKDIR "/src/ExamPRO.API"

RUN dotnet publish "ExamPRO.API.csproj" -c Release -o /app/publish

# שלב הרצה עם runtime בלבד
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80

ENTRYPOINT ["dotnet", "ExamPRO.API.dll"]
