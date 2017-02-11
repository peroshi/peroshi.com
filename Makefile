help:
	@echo "Usage"
	@echo "  make install      - install all NPM packages"
	@echo "  make run          - run the site locally for development"
	@echo "  make deploy       - build the site and deploy it to GitHub Pages"

install:
	npm install

run:
	npm run start

deploy:
	@echo "Compiling site..."
	npm run build
	./bin/deploy.sh
