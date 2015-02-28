BUILD_DIR = ./build

help:
	@echo "Usage"
	@echo "  make install      - install all NPM and Bower packages"
	@echo "  make run	       - run the site locally for development"
	@echo "  make deploy       - build the site and deploy it to S3"

install:
	npm install
	bower install

run:
	node_modules/.bin/harp server

deploy:
	@echo "Compiling site..."
	@harp compile -o $(BUILD_DIR)
	@./bin/fixdirs.sh $(BUILD_DIR)
	# s3cmd --config=s3cfg sync --delete-removed --acl-public $(BUILD_DIR) s3://peroshi.com/
