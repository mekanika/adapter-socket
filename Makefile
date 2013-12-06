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

build: lint
	@NODE_ENV=test mocha --reporter dot $(TESTFILES)

runtests:
	-@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(TESTFILES)

test: startserver runtests stopserver

lint:
	@echo "Linting..."
	@./node_modules/jshint/bin/jshint \
		--config .jshintrc \
		lib/*.js test/*.js

coverage:
	@echo "Generating coverage report.."
	@NODE_ENV=test istanbul cover _mocha -- -R spec
	@echo "Done: ./coverage/lcov-report/index.html"

.PHONY: install lint runtests test coverage startserver stopserver
