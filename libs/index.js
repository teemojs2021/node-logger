'use strict'
// @ts-check

const _ = require('lodash')
const config = require('config')
const util = require('util')
const path = require('path')
const Log4js = require('log4js')
const Winston = require('winston')
const Morgan = require('morgan')
const WinstonRequestLogger = require('winston-request-logger')
const colors = require('colors/safe')
require('winston-daily-rotate-file')

/**
 * @description This is a class for loggin, wrapped with `Winston Logger` or fallback with `Console`
 *
 * @class Logger
 */
class Logger {
  /**
   *Creates an instance of Logger.
   * @memberof Logger
   */
  constructor() {
    try {
      this.initOptions()
      this.configureLog4js()
      this.configureWinston()
      this.configureMorgan()
      this.createLog4jsLogger()
      this.createWinstonLogger()
    } catch (error) {
      console.error(error)
      this.instance = console
    }
  }

  /**
   *
   * @description configure logger options from `config`
   * @returns {void}
   * @memberof Logger
   */
  initOptions() {
    /** @type {ILoggerOption} */
    this.options = {
      log4js: {
        appenders: {
          system: {
            type: 'file',
            filename: path.resolve('logs', 'system.log'),
            maxLogSize: 1048576,
            backups: 3
          },
          access: {
            type: 'dateFile',
            filename: path.resolve('logs', 'access.log'),
            pattern: '-yyyy-MM-dd'
          },
          error: {
            type: 'dateFile',
            filename: path.resolve('logs', 'error.log'),
            pattern: '-yyyy-MM-dd'
          },
          console: {
            type: 'console'
          },
          stdout: {
            type: 'stdout'
          }
        },
        categories: {
          default: {
            appenders: ['access', 'console', 'stdout'],
            level: 'INFO'
          },
          access: {
            appenders: ['access', 'console', 'stdout'],
            level: 'INFO'
          },
          system: {
            appenders: ['system', 'console', 'stdout'],
            level: 'ALL'
          },
          error: {
            appenders: ['error', 'console', 'stdout'],
            level: 'WARN'
          }
        },
        replaceConsole: true
      },
      winston: {
        console: {
          handleExceptions: true,
          json: false,
          colorize: true,
          timestamp: true
        },
        file: {
          handleExceptions: true,
          json: false,
          colorize: true,
          timestamp: true,
          filename: path.resolve('logs', 'app-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '100m',
          maxFiles: '30d'
        },
        label: 'LOGGER',
        level: 'debug',
        exitOnError: false,
        format: {
          timestamp: 'YYYY-MM-DD HH:mm:ss'
        }
      },
      morgan: {
        immediate: true,
        level: 'combined',
        format: '[URL: :url] [UA: :user-agent]'
      }
    }
  }

  /**
   *
   *
   * @description configure morgan instance
   * @returns {void}
   * @memberof Logger
   */
  configureWinston() {
    try {
      if (!_.isEmpty(_.get(config, 'logger.winston'))) {
        const clone = _.cloneDeep(this.options.winston)
        const src = _.pickBy(_.get(config, 'logger.winston'), v => !_.isUndefined(v))
        const dist = _.merge(clone, src)
        this.options.winston = dist
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  /**
   *
   * @description create winston instance
   * @returns {void}
   * @memberof Logger
   */
  createWinstonLogger() {
    try {
      const { exitOnError = false, level = 'debug' } = this.options.winston
      const transports = [this.createWinstonFileTransport(), this.createWinstonConsoleTransport()]
      const format = Winston.format.combine(this.labelFormatter, this.timestampFormatter, this.printfFormatter)

      this.instance = Winston.createLogger({
        exitOnError,
        level,
        format,
        transports
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  /**
   *
   * @description create Log4js instance
   * @returns {Log4js}
   * @memberof Logger
   */
  createLog4jsLogger() {
    try {
      Log4js.configure(this.options.log4js)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  /**
   *
   * @description configure winston console logging
   * @returns {Winston.ConsoleTransportInstance}
   * @memberof Logger
   */
  createWinstonConsoleTransport() {
    try {
      return new Winston.transports.Console(this.options.winston.console)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  /**
   *
   * @description configure winston log-rotate
   * @returns {Winston.WinstonRequestLogger}
   * @memberof Logger
   */
  createWinstonFileTransport() {
    try {
      return new Winston.transports.DailyRotateFile(this.options.winston.file)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  /**
   *
   * @description winston log label format
   * @readonly
   * @returns {Winston.Format}
   * @memberof Logger
   */
  get labelFormatter() {
    const label = this.options.winston.label
    return Winston.format.label({
      label
    })
  }

  /**
   *
   * @description winston log timestamp format
   * @readonly
   * @returns {Winston.Format}
   * @memberof Logger
   */
  get timestampFormatter() {
    const format = this.options.winston.format.timestamp
    return Winston.format.timestamp({
      format
    })
  }

  /**
   *
   * @description winston log format
   * @readonly
   * @returns {Winston.Format}
   * @memberof Logger
   */
  get printfFormatter() {
    const decorator = this.decorator.bind(this)
    let formatFn = this.options.winston.format.printf
    if (!_.isFunction(formatFn)) {
      formatFn = info =>
        `${decorator(info.level, true)(`[${info.label}: ${_.toUpper(info.level)}]`)} ${decorator('grey')(
          ` [TIME:${info.timestamp}] `
        )} ${decorator(info.level)(info.message)}`
    }

    return Winston.format.printf(formatFn)
  }

  /**
   *
   * @description configure Log4js
   * @returns {void}
   * @memberof Logger
   */
  configureLog4js() {
    try {
      if (!_.isEmpty(_.get(config, 'logger.log4js'))) {
        const clone = _.cloneDeep(this.options.log4js)
        const src = _.pickBy(_.get(config, 'logger.log4js'), v => !_.isUndefined(v))
        const dist = _.merge(clone, src)
        this.options.log4js = dist
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   *
   * @description returns an instance of Log4js
   * @param {TLog4jsAppender} [category='system']
   * @returns {Log4js.Logger}
   * @memberof Logger
   */
  getLog4js(category = 'system') {
    try {
      return Log4js.getLogger(category)
    } catch (error) {
      console.error(error)
      return undefined
    }
  }

  /**
   *
   * @description configure morgan
   * @returns {void}
   * @memberof Logger
   */
  configureMorgan() {
    try {
      if (!_.isEmpty(_.get(config, 'logger.morgan'))) {
        const clone = _.cloneDeep(this.options.morgan)
        const src = _.pickBy(_.get(config, 'logger.morgan'), v => !_.isUndefined(v))
        const dist = _.merge(clone, src)
        this.options.morgan = dist
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  /**
   *
   * @description colorize logging on console
   * @param {TWinstonLevel} level
   * @param {boolean} [isInverse=false]
   * @returns {string}
   * @memberof Logger
   */
  decorator(level, isInverse = false) {
    const level2Colors = {
      info: 'green',
      debug: 'cyan',
      error: 'red',
      warn: 'yellow'
    }
    const color = level2Colors[_.toLower(level)] || 'grey'
    return isInverse ? colors.inverse[color] : colors[color]
  }

  /**
   *
   * @description noop(no operation)
   * @param {*} messages
   * @returns {void}
   * @memberof Logger
   */
  noop(...messages) {
    return undefined
  }

  /**
   *
   * @description logging with level info
   * @example `SomePromiseLike().then(...).catch(...)`
   * @example `SomePromiseLike().then(date =>Logger.info(date))`
   * @param {*} messages
   * @returns {void}
   * @memberof Logger
   */
  info(...messages) {
    try {
      _.toArray(messages).map(message => this.instance.info(util.inspect(message)))
    } catch (error) {
      console.error(error)
    }

    return this.noop()
  }

  /**
   *
   * @description logging with level error
   * @param {*} messages
   * @returns {void}
   * @memberof Logger
   */
  error(...messages) {
    try {
      _.toArray(messages).map(message => this.instance.error(util.inspect(message)))
    } catch (error) {
      console.error(error)
    }

    return this.noop()
  }

  /**
   *
   * @description logging with level warn
   * @param {*} messages
   * @returns {void}
   * @memberof Logger
   */
  warn(...messages) {
    try {
      _.toArray(messages).map(message => this.instance.warn(util.inspect(message)))
    } catch (error) {
      console.error(error)
    }

    return this.noop()
  }

  /**
   *
   * @description logging with level debug
   * @param {*} messages
   * @returns {void}
   * @memberof Logger
   */
  debug(...messages) {
    try {
      _.toArray(messages).map(message => this.instance.debug(util.inspect(message)))
    } catch (error) {
      console.error(error)
    }

    return this.noop()
  }

  /**
   *
   * @description logging connecting with Morgan, need to implement method named as `write`
   * @param {*} messages
   * @returns {void}
   * @memberof Logger
   */
  write(...messages) {
    return this.info(messages)
  }

  /**
   *
   * @description logging with log4js
   * @param {*} message
   * @param {TLog4jsAppender} [category='system']
   * @returns {void}
   * @memberof Logger
   */
  trace(message, category = 'system') {
    try {
      if (_.isEmpty(category)) {
        throw new TypeError(`invalid category ${category}`)
      }

      this.getLog4js(category).trace(message)
    } catch (error) {
      console.error(error)
    }

    return this.noop()
  }

  /**
   *
   * @description returns a middleware function for Expreess.
   * @example app.use(Logger.getLog4jsMiddleware());
   * @param {TLog4jsAppender} [category='system']
   * @returns {express.RequestHandler}
   * @memberof Logger
   */
  getLog4jsMiddleware(category = 'system') {
    try {
      if (_.isEmpty(category)) {
        throw new TypeError(`invalid category ${category}`)
      }

      return Log4js.connectLogger(this.getLog4js(category))
    } catch (error) {
      console.error(error)
      return (req, res, next) => next()
    }
  }

  /**
   *
   * @description returns a middleware function for Expreess.
   * @example app.use(Logger.getMorganMiddleware());
   * @returns {express.RequestHandler}
   * @memberof Logger
   */
  getMorganMiddleware() {
    try {
      const format = this.options.morgan.format
      const immediate = this.options.morgan.immediate
      const stream = this
      const options = {
        stream,
        immediate
      }

      return Morgan(format, options)
    } catch (error) {
      console.error(error)
      return (req, res, next) => next()
    }
  }

  /**
   *
   * @description returns a middleware function for Expreess.
   * @example app.use(Logger.getWinstonMiddleware());
   * @returns {express.RequestHandler}
   * @memberof Logger
   */
  getWinstonMiddleware() {
    try {
      return WinstonRequestLogger.create(this.instance)
    } catch (error) {
      console.error(error)
      return (req, res, next) => next()
    }
  }
}

module.exports = new Logger()
