# Use Node.js LTS como base
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Instala pnpm
RUN npm install -g pnpm

# Copia os arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instala as dependências
RUN pnpm install --frozen-lockfile

# Copia o código fonte
COPY . .

# Compila o projeto
RUN pnpm run build

# Define a porta padrão (pode ser sobrescrita pelo .env)
ENV PORT=3000

# Expõe a porta da aplicação dinamicamente
EXPOSE $PORT

# Comando para iniciar a aplicação
CMD ["pnpm", "run", "start:prod"]
