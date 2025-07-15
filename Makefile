SHELL := /bin/bash

.PHONY: all
all: deploy

.PHONY: develop
develop:
	export NODE_ENV=development

.PHONY: dev
dev: develop dev-restart dev-database

.PHONY: dev-start
dev-start:
	docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build

.PHONY: dev-stop
dev-stop:
	docker compose -f docker-compose.yml -f docker-compose.local.yml down

.PHONY: dev-restart
dev-restart: dev-stop dev-start

.PHONY: dev-database
dev-database:
	docker compose -f docker-compose.yml -f docker-compose.local.yml exec backend node scripts/dev-database.js

.PHONY: status
status:
	docker compose -f docker-compose.yml -f docker-compose.local.yml ps

.PHONY: backend
backend:
	docker compose -f docker-compose.yml -f docker-compose.local.yml exec backend bash

.PHONY: frontend
frontend:
	docker compose -f docker-compose.yml -f docker-compose.local.yml exec frontend bash

.PHONY: proxy
proxy:
	docker compose -f docker-compose.yml -f docker-compose.local.yml exec proxy sh

.PHONY: mongo
mongo:
	docker compose -f docker-compose.yml -f docker-compose.local.yml exec mongo mongosh

.PHONY: publish
publish:
	docker compose -f docker-compose.yml build
	docker tag livinvicta.com-backend fraguinha/livinvicta.com-backend:latest
	docker tag livinvicta.com-frontend fraguinha/livinvicta.com-frontend:latest
	docker push fraguinha/livinvicta.com-backend:latest
	docker push fraguinha/livinvicta.com-frontend:latest

.PHONY: prod
prod:
	export NODE_ENV=production

.PHONY: deploy
deploy: prod restart database

.PHONY: start
start:
	docker compose -f docker-compose.yml up -d

.PHONY: stop
stop:
	docker compose -f docker-compose.yml down

.PHONY: restart
restart: stop start

.PHONY: database
database:
	docker compose -f docker-compose.yml -f docker-compose.local.yml exec backend node scripts/database.js
