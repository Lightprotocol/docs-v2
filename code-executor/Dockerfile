FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -r executor && useradd -r -g executor executor

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY tsconfig.json ./
COPY src ./src

RUN npm run build || npx tsc

RUN mkdir -p .temp && chown -R executor:executor /app

USER executor

ENV NODE_ENV=production
ENV PORT=3040

EXPOSE 3040

CMD ["node", "dist/server.js"]

