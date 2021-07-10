'use strict'
// @ts-check

/**
 * @typedef TLog4jsAppender
 * @type {'default'|'access'|'system'|'error'|'console'|'stdout'}
 */

/**
 * @typedef TLog4jsLevel
 * @type {'ALL'|'TRACE'|'DEBUG'|'INFO'|'WARN'|'ERROR'|'FATAL'}
 */

/**
 * @typedef TLog4jsAppenderType
 * @type {'file'|'dateFile'|'console'|'stdout'}
 */

/**
 * @typedef TWinstonLevel
 * @type {'debug'|'info'|'warn'|'error'}
 */

/**
 * @typedef TMorganLevel
 * @type {'combined'|'common'|'dev'|'short'|'tiny'}
 */

/**
 *
 * @typedef ILoggerOption
 * @type {Object}
 * @property {ILog4jsOption} log4js
 * @property {IWinstonOption} winston
 * @property {IMorganOption} morgan
 * */

/**
 *
 * @typedef ILog4jsOption
 * @type {Object}
 * @property {ILog4jsAppendersOption} appenders
 * @property {ILog4jsCategoriesOption} categories
 * @property {boolean} replaceConsole
 *
 * */

/**
 *
 * @typedef ILog4jsAppender
 * @type {Object}
 * @property {TLog4jsAppenderType} type
 * @property {number} maxLogSize
 * @property {number} backups
 * @property {string} filename
 * @property {string} pattern
 * */

/**
 * @typedef ILog4jsAppendersOption
 * @type {Object}
 * @property {ILog4jsCategory} [default=undefined]
 * @property {ILog4jsCategory} [access=undefined]
 * @property {ILog4jsCategory} [system=undefined]
 * @property {ILog4jsCategory} [error=undefined]
 * @property {ILog4jsCategory} [console=undefined]
 * @property {ILog4jsCategory} [stdout=undefined]
 * */

/**
 *
 * @typedef ILog4jsCategoriesOption
 * @type {Object}
 * @property {ILog4jsCategory} [default=undefined]
 * @property {ILog4jsCategory} [access=undefined]
 * @property {ILog4jsCategory} [system=undefined]
 * @property {ILog4jsCategory} [error=undefined]
 * @property {ILog4jsCategory} [console=undefined]
 * @property {ILog4jsCategory} [stdout=undefined]
 * */

/**
 *
 * @typedef ILog4jsCategory
 * @type {Object}
 * @property {TLog4jsLevel} level
 * @property {TLog4jsAppender[]} appenders
 * */

/**
 *
 * @typedef IWinstonOption
 * @type {Object}
 * @property {IWinstonTransportOption} console
 * @property {IWinstonTransportOption} file
 * @property {boolean} exitOnError
 * @property {TWinstonLevel} level
 * @property {string} label
 * @property {IWinstonFormatOption} format
 * */

/**
 *
 * @typedef IWinstonTransportOption
 * @type {Object}
 * @property {boolean} handleExceptions
 * @property {boolean} json
 * @property {boolean} colorize
 * @property {boolean} timestamp
 * @property {string} [datePattern='YYYY-MM-DD']
 * @property {boolean} [zippedArchive=true]
 * @property {string} [maxSize='100m']
 * @property {string} [maxFiles='30d']
 * */

/**
 *
 * @typedef IWinstonFormatOption
 * @type {Object}
 * @property {string} [timestamp='YYYY-MM-DD HH:mm:ss']
 * @property {string} [filename='./logs/app-%DATE%.log']
 * @property {Function} [printf=() => undefined]
 * */

/**
 *
 * @typedef IMorganOption
 * @type {Object}
 * @property {TMorganLevel} [level='combined']
 * @property {string} [format='[URL: :url] [UA: :user-agent]']
 * @property {boolean} [immediate=false]
 * */
