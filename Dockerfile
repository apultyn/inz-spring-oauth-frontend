FROM node AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine

ARG PORT=80
EXPOSE ${PORT}

COPY --from=build /app/dist /usr/share/nginx/html

RUN echo "server { listen ${PORT}; server_name localhost; location / { root /usr/share/nginx/html; index index.html; try_files \$uri /index.html; } }" > /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
