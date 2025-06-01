# שלב 1: בניית אפליקציית Angular
FROM node:18 AS build

WORKDIR /app

# התקנת תלויות
COPY package*.json ./
RUN npm install

# העתקת קבצי הפרויקט
COPY . .

# בניית האפליקציה לסביבת production
RUN npm run build -- --configuration production

# שלב 2: שרת NGINX שמריץ את האפליקציה
FROM nginx:alpine

# מחיקת קבצי ברירת מחדל
RUN rm -rf /usr/share/nginx/html/*

# העתקת התוצר המוכן
COPY --from=build /app/dist/client-angular /usr/share/nginx/html

# ✅ העתקת קובץ הקונפיגורציה של NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
