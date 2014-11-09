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

deploy: install build s3cmd
