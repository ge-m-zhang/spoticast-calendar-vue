#!/bin/bash

KEYS=(
  "VITE_APP_ENV"
  "VITE_SPOTIFY_CLIENT_ID"
  "VITE_SPOTIFY_CLIENT_SECRET"

)

# Replace all __KEY__ with the value of the variable KEY at beginning of the container
for KEY in "${KEYS[@]}"; do
  VALUE=${!KEY}

  sed -i "s#__${KEY}__#${VALUE}#g" /usr/share/nginx/html/env.js
done

exec "$@"