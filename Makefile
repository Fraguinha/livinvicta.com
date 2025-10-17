.PHONY: all dev clean mongo-shell

all: dev

dev:
	@echo "Creating k3d cluster..."
	-@k3d cluster create livinvicta -p "8080:80@loadbalancer" --registry-create k3d-livinvicta-registry:10000 --wait

	@echo "Starting local database..."
	-@docker run -d --name mongodb -p 27017:27017 mongo

	@echo "Creating namespace..."
	@kubectl apply -f local/namespace.yml

	@echo "Creating secrets..."
	-@kubectl create secret generic livinvicta-secrets -n livinvicta \
		--from-literal=DATABASE=mongodb://host.docker.internal:27017/livinvicta \
		--from-literal=SECRET=SECRET \
		--from-literal=GOOGLE_CLIENT_ID=GOOGLE_CLIENT_ID \
		--from-literal=GOOGLE_CLIENT_SECRET=GOOGLE_CLIENT_SECRET

	@echo "Building backend image..."
	@docker build --pull --no-cache -t fraguinha/livinvicta.com-backend:latest src/backend

	@echo "Building frontend image..."
	@docker build --pull --no-cache -t fraguinha/livinvicta.com-frontend:latest src/frontend

	@echo "Tagging backend image..."
	@docker tag fraguinha/livinvicta.com-backend localhost:10000/fraguinha/livinvicta.com-backend:latest

	@echo "Tagging frontend image..."
	@docker tag fraguinha/livinvicta.com-frontend localhost:10000/fraguinha/livinvicta.com-frontend:latest

	@echo "Pushing backend image..."
	@docker push localhost:10000/fraguinha/livinvicta.com-backend:latest

	@echo "Pushing frontend image..."
	@docker push localhost:10000/fraguinha/livinvicta.com-frontend:latest

	@echo "Capturing backend image digest..."; \
	BACKEND_SHA=$$(docker inspect --format='{{index .RepoDigests 0}}' fraguinha/livinvicta.com-backend:latest | cut -d'@' -f2); \
	echo "Backend SHA: $$BACKEND_SHA"; \
	\
	echo "Capturing frontend image digest..."; \
	FRONTEND_SHA=$$(docker inspect --format='{{index .RepoDigests 0}}' fraguinha/livinvicta.com-frontend:latest | cut -d'@' -f2); \
	echo "Frontend SHA: $$FRONTEND_SHA"; \
	\
	echo "Patching kubernetes manifests with SHA digests..."; \
	sed -i '' "s|:latest|:latest@$$BACKEND_SHA|g" local/backend.yml; \
	sed -i '' "s|:latest|:latest@$$FRONTEND_SHA|g" local/frontend.yml; \
	\
	echo "Applying kubernetes manifests..."; \
	kubectl apply -k local/

	@echo "Rolling out deployments..."
	@kubectl rollout restart deployment/frontend -n livinvicta
	@kubectl rollout restart deployment/backend -n livinvicta

	@echo "Waiting for deployments to be successful..."
	@kubectl rollout status deployment/frontend -n livinvicta
	@kubectl rollout status deployment/backend -n livinvicta

	@echo "Restoring kubernetes manifests..."
	@sed -i '' "s|@sha256:.*||g" local/backend.yml
	@sed -i '' "s|@sha256:.*||g" local/frontend.yml

	@echo "You can now access the application at http://localhost:8080"

clean:
	@echo "Cleaning docker resources..."
	@docker stop $$(docker ps -aq)
	@docker container prune -f
	@docker image prune -f
	@docker volume prune -af
	@docker network prune -f

mongo-shell:
	@echo "Connecting to MongoDB shell..."
	@docker exec -it mongodb mongosh
