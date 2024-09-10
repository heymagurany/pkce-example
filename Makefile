.PHONY: build clean

build: dist/index.html dist/main.js

dist:
	mkdir dist

node_modules:
	npm install

dist/index.html: dist src/index.html dist/index.css dist/genesys-webcomponents.css
	cp src/index.html dist/

dist/index.css: src/index.css
	cp src/index.css dist/

dist/genesys-webcomponents.css: dist node_modules
	cp node_modules/genesys-spark-components/dist/genesys-webcomponents/genesys-webcomponents.css dist/

dist/main.js: dist node_modules src/*.js
	npx webpack

clean:
	rm -rf dist node_modules
