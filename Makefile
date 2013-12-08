REPORTER = spec
TESTFILES = $(shell find test/ -name '*.test.js')

startserver:
	@echo Starting test server...
	@NODE_ENV=test node test/socket.server.js silent &

stopserver:
	@echo Stopping test server.
	@pkill -f "node test/socket.server.js silent"

install:
	@echo "Installing production"
	@npm install --production
	@echo "Install complete"

build:
	@node tools/build-primus.js
	-@browserify lib/adapter-socket.js -o adapter-socket.js -s socket
	@rm primus.js

buildandtest: lint build test

unit-tests:
	-@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(TESTFILES)

integration-tests:
	-@NODE_ENV=test mocha-phantomjs test/harness.html

test: unit-tests startserver integration-tests stopserver

lint:
	@echo "Linting..."
	@./node_modules/jshint/bin/jshint \
		--config .jshintrc \
		lib/*.js test/*.js

coverage:
	@echo "Generating coverage report.."
	@NODE_ENV=test istanbul cover _mocha -- -R spec
	@echo "Done: ./coverage/lcov-report/index.html"

.PHONY: install lint test coverage startserver stopserver
