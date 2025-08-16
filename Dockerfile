FROM node:20-alpine

WORKDIR /app

# Instala pnpm
RUN npm install -g pnpm

# Copia package files
COPY package.json pnpm-lock.yaml ./

# Instala dependências
RUN pnpm install

# Copia código fonte
COPY . .

# Expõe porta
EXPOSE 3000

# Comando de start em modo dev (com hot reload)
CMD ["pnpm", "start:dev"]
