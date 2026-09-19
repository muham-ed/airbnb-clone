FROM node:20-alpine

# تثبيت التبعيات الضرورية لـ Prisma على Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "run", "dev"]
