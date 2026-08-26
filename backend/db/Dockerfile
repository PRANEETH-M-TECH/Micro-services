# Bakes init.sql into the image instead of bind-mounting it, so this works
# identically whether "docker compose" is invoked from the Windows host directly
# or triggered from inside the Jenkins container (which has its own filesystem).
FROM postgres:16-alpine
COPY init.sql /docker-entrypoint-initdb.d/init.sql
