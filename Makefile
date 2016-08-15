BUILD_DIR = ./build
HARP_FILE = ./node_modules/.bin/harp

help:
	@echo "Usage"
	@echo "  make install      - install all NPM packages"
	@echo "  make run          - run the site locally for development"
	@echo "  make deploy       - build the site and deploy it to GitHub Pages"

install:
	chmod +x ./bin/deploy.sh
	npm install

run:
	@$(HARP_FILE) server

deploy:
	@echo "Compiling site..."
	$(HARP_FILE) compile -o $(BUILD_DIR)
	./bin/deploy.sh
