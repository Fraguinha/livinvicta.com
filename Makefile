SHELL := /bin/bash

.PHONY: all
all: deploy

.PHONY: dev
dev: dev-restart

.PHONY: dev-start
dev-start:
	NODE_ENV=development docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --remove-orphans --build

.PHONY: dev-stop
dev-stop:
	docker compose -f docker-compose.yml -f docker-compose.local.yml down

.PHONY: dev-restart
dev-restart: dev-stop dev-start

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

.PHONY: deploy
deploy: restart

.PHONY: start
start:
	NODE_ENV=production docker compose -f docker-compose.yml up -d --remove-orphans

.PHONY: stop
stop:
	docker compose -f docker-compose.yml down

.PHONY: restart
restart: stop start
