# Lechón del Llano — imagen para Railway
# Sitio estático servido con Caddy (URLs limpias, 404 propia, compresión y caché).
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY . /srv
# El Caddyfile no debe quedar expuesto en la raíz del sitio
RUN rm -f /srv/Caddyfile

# Railway inyecta la variable PORT; Caddy la lee desde el Caddyfile.
ENV PORT=8080
EXPOSE 8080
