FROM nginx:alpine-slim

# Config nginx for spa
COPY nginx.conf /etc/nginx/nginx.conf

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*


COPY ./out /usr/share/nginx/html/materials

EXPOSE 1080
