# -----------------------
# Build Angular
# -----------------------
FROM node:20-alpine AS build

# Carpeta de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar todo el proyecto
COPY . .

# Generar build de Angular en producción
RUN npm run build --prod

# -----------------------
# Serve con Nginx
# -----------------------
FROM nginx:alpine

# Copiar build de Angular al directorio de Nginx
COPY --from=build /app/dist/findex-frontend/browser /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
