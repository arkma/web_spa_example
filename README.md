# web_spa_example
Simple example of todo list SPA app on vanillaJS

## Install node js (includes npm)
```bash
brew install node # For MacOS only
```
https://nodejs.org/en/download/package-manager

## Install json-server as a backend
```bash
npm install json-server
```
Note: This will install the beta-verion. To install the latest stable version, specify the version.
```bash
npm install -g json-server@0.17.4
```

## Start json-server backend 
For beta vesrion:
```bash
npx json-server ./backend/db.json
```

For the stable version:
```bash
json-server --watch ./backend/db.json
```