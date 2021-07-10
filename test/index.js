const assert = require('assert')
const Faker = require('faker')
const process = require('process')
const path = require('path')
const target = process.env.NODE_ENV === 'production' ? 'dist' : 'libs'
const Logger = require(path.resolve(target, 'index.js'))

/**
 *
 */
describe('TEST logger', () => {
  it('GREEN: CASE1', done => {
    const input = Faker.random.uuid()
    Logger.noop()

    Logger.info(input)
    Logger.debug(input)
    Logger.warn(input)
    Logger.error(input)
    Logger.write(input)
    Logger.trace(input)

    Logger.info()
    Logger.debug()
    Logger.warn()
    Logger.error()
    Logger.write()
    Logger.trace()

    assert.doesNotThrow(Logger.getWinstonMiddleware.bind(Logger), Error)
    assert.doesNotThrow(Logger.getMorganMiddleware.bind(Logger), Error)
    assert.doesNotThrow(Logger.getLog4jsMiddleware.bind(Logger), Error)

    done()
  })
})
