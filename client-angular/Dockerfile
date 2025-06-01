# שלב 1: בניית אפליקציה
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# שלב 2: שרת סטטי עם nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
# אפשר לשנות פורט אם צריך, ברירת מחדל 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
