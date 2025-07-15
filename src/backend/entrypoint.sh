#!/bin/sh

set -e

if [ "$NODE_ENV" = "development" ]; then
  node scripts/dev-database.js
else
  node scripts/database.js
fi

exec node dist/server.js
