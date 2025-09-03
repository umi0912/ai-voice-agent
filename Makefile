.PHONY: help install dev start start-prod build docker-build docker-run docker-stop docker-logs deploy clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm install

dev: ## Start development server
	npm run dev

start: ## Start production server
	npm start

start-prod: ## Start production server with production config
	npm run start:prod

build: ## Build Docker image
	docker build -t square-app .

docker-run: ## Run with Docker Compose
	docker-compose up -d

docker-stop: ## Stop Docker Compose services
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

deploy: ## Deploy to production
	./deploy.sh

clean: ## Clean up project
	rm -rf node_modules package-lock.json
	docker system prune -f

logs: ## View application logs
	tail -f logs/*.log

health: ## Check application health
	curl -f http://localhost:3000/health || echo "Health check failed"

test: ## Run tests
	npm test

lint: ## Run linter
	npm run lint

# Production specific targets
prod-build: ## Build production Docker image
	docker build -t square-app:prod .

prod-run: ## Run production stack
	docker-compose -f docker-compose.prod.yml up -d

prod-stop: ## Stop production stack
	docker-compose -f docker-compose.prod.yml down

prod-logs: ## View production logs
	docker-compose -f docker-compose.prod.yml logs -f

prod-deploy: ## Full production deployment
	@echo "🚀 Starting production deployment..."
	@make prod-stop || true
	@make prod-build
	@make prod-run
	@echo "⏳ Waiting for services to be ready..."
	@sleep 30
	@make health
	@echo "✅ Production deployment completed!"
