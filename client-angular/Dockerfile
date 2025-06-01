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

# מחיקת קובץ הגדרות ברירת מחדל של NGINX
RUN rm -rf /usr/share/nginx/html/*

# העתקת התוצר המוכן של Angular ל-NGINX
COPY --from=build /app/dist/client-angular/usr/share/nginx/html

# פתיחת פורט 80
EXPOSE 80

# הפעלת NGINX
CMD ["nginx", "-g", "daemon off;"]
