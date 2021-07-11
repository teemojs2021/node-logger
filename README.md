# @teemo.js-node/node-logger

This is a logger package module for express.

## install

add `dependencies` into `package.json` and run `yarn install`

## configure

please put `logger` config into `config/${env}.json`

```[json]
{
  "logger": {
    "log4js": {
      "appenders": {
        "system": {
          "type": "file",
          "filename": "logs/system.log",
          "maxLogSize": 1048576,
          "backups": 3
        },
        "access": {
          "type": "dateFile",
          "filename": "logs/access.log",
          "pattern": "-yyyy-MM-dd"
        },
        "error": {
          "type": "dateFile",
          "filename": "logs/error.log",
          "pattern": "-yyyy-MM-dd"
        },
        "console": {
          "type": "console"
        },
        "stdout": {
          "type": "stdout"
        }
      },
      "categories": {
        "default": {
          "appenders": ["access", "console", "stdout"],
          "level": "INFO"
        },
        "access": {
          "appenders": ["access", "console", "stdout"],
          "level": "INFO"
        },
        "system": {
          "appenders": ["system", "console", "stdout"],
          "level": "ALL"
        },
        "error": {
          "appenders": ["error", "console", "stdout"],
          "level": "WARN"
        }
      },
      "replaceConsole": true
    },
    "winston": {
      "console": {
        "handleExceptions": true,
        "json": false,
        "colorize": true,
        "timestamp": true
      },
      "file": {
        "handleExceptions": true,
        "json": false,
        "colorize": true,
        "timestamp": true,
        "datePattern": "YYYY-MM-DD",
        "zippedArchive": true,
        "maxSize": "100m",
        "maxFiles": "30d"
      },
      "label": "LOGGER",
      "level": "debug",
      "exitOnError": false,
      "format": {
        "timestamp": "YYYY-MM-DD HH:mm:ss",
        "filename": "./logs/app-%DATE%.log"
      }
    },
    "morgan": {
      "immediate": true,
      "level": "combined",
      "format": "[URL: :url] [UA: :user-agent]"
    }
  }
}
```

## test

```[bash]
yarn test
```

## coverage

```[bash]
yarn cover
```

## build

```[bash]
yarn build
```

## docs

```[bash]
yarn docs
```
