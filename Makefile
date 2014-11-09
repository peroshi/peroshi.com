CURRENT_BRANCH = $(shell git rev-parse --abbrev-ref HEAD)

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
