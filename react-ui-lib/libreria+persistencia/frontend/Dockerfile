# Frontend Dockerfile
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo archivos con dependencias
COPY package*.json ./

# Instalar dependencias en la imagen 
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer puerto
EXPOSE 5173

#Habilitar watcher de contenedor
ENV CHOKIDAR_USEPOLLING=true

# Comando por defecto al iniciar el contenedor
CMD [ "npm", "run", "dev", "--host", "0.0.0.0", "--port", "5173"]