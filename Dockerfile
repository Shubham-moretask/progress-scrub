FROM ghcr.io/puppeteer/puppeteer:24.6.1

# DO NOT set PUPPETEER_EXECUTABLE_PATH
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["node", "index.js"]
