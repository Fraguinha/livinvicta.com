SHELL := /bin/bash

.PHONY: all
all: deploy


.PHONY: develop
develop:
	export NODE_ENV=development

.PHONY: dev
dev: develop restart database

.PHONY: prod
prod:
	export NODE_ENV=production

.PHONY: deploy
deploy: develop restart

.PHONY: start
start:
	docker compose up -d --build

.PHONY: rebuild
rebuild:
	docker compose build --no-cache

.PHONY: stop
stop:
	docker compose down

.PHONY: restart
restart:
	docker compose down
	docker compose up -d --build

.PHONY: status
status:
	docker compose ps

.PHONY: logs
logs:
	docker compose logs -f

.PHONY: database
database:
	docker compose exec backend node scripts/database.js

.PHONY: backend-shell
backend-shell:
	docker compose exec backend bash

.PHONY: frontend-shell
frontend-shell:
	docker compose exec frontend bash

.PHONY: proxy-shell
proxy-shell:
	docker compose exec proxy sh

.PHONY: mongo-shell
mongo-shell:
	docker compose exec mongo mongosh
