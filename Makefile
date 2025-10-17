
.PHONY: all dev clean mongo-shell

all: dev

dev:
	@echo "Creating k3d cluster..."
	-@k3d cluster create livinvicta -p "8080:80@loadbalancer" --registry-create livinvicta-registry:10000 --wait
	@echo "Starting local database..."
	-@docker run -d --name mongodb -p 27017:27017 mongo
	@echo "Creating namespace..."
	@kubectl apply -f local/namespace.yml
	@echo "Creating secrets..."
	-@kubectl create secret generic livinvicta-secrets -n livinvicta \
		--from-literal=DATABASE=mongodb://host.docker.internal:27017/livinvicta \
		--from-literal=SECRET=YOUR_SECRET \
		--from-literal=GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID \
		--from-literal=GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
	@echo "Building and loading Docker images..."
	@docker build --no-cache -t fraguinha/livinvicta.com-backend:latest src/backend
	@docker build --no-cache -t fraguinha/livinvicta.com-frontend:latest src/frontend
	@docker tag fraguinha/livinvicta.com-backend livinvicta-registry:5000/fraguinha/livinvicta.com-backend
	@docker tag fraguinha/livinvicta.com-frontend livinvicta-registry:5000/fraguinha/livinvicta.com-frontend
	@docker push localhost:10000/fraguinha/livinvicta.com-backend
	@docker push localhost:10000/fraguinha/livinvicta.com-frontend
	@echo "Deploying application..."
	@kubectl apply -k local/
	@echo "Rolling out deployments..."
	@kubectl rollout restart deployment/frontend -n livinvicta
	@kubectl rollout restart deployment/backend -n livinvicta
	@echo "Waiting for deployments to be successful..."
	@kubectl rollout status deployment/frontend -n livinvicta
	@kubectl rollout status deployment/backend -n livinvicta
	@echo "You can now access the application at http://localhost:8080"

clean:
	@echo "Deleting k3d cluster..."
	-@k3d cluster delete livinvicta
	@echo "Stopping local database..."
	-@docker stop mongodb
	-@docker rm mongodb

mongo-shell:
	@echo "Connecting to MongoDB shell..."
	@docker exec -it mongodb mongosh
