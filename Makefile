CURRENT_BRANCH = $(shell git rev-parse --abbrev-ref HEAD)

help:
	@echo "Usage"
	@echo "  make requirements - installs the python requirements"
	@echo "  make npm          - installs the npm requirements"
	@echo "  make bower        - installs the bower requirements"
	@echo "  make install      - installs all requirements"
	@echo "  make s3cmd        - syncs the built site directory with s3"
	@echo "  make build        - builds the pelican site"
	@echo "  make deploy       - builds the pelican site and syncs it to s3"

requirements:
	pip install -r requirements.txt

npm:
	npm install

bower:
	bower install

install: requirements npm bower

s3cmd:
	s3cmd --config=s3cfg sync --delete-removed --acl-public dist/ s3://peroshi.com/

build:
	grunt build

deploy:
ifneq ($(CURRENT_BRANCH), master)
	@echo 'You should only be deploying on the master branch, jimmy.'
	@exit 1
endif

	make install
	make build
	make s3cmd
