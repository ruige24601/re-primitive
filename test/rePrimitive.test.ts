// const { rePrimitive, watchEffect } = require('../dist/re-primitive.cjs')
import { rePrimitive, watchEffect } from '../src'
// let proxy = rePrimitive(123)
// watchEffect(() => {
//   console.log(proxy instanceof Number)
//   console.log('输出：' + proxy.valueOf() + ' ...')
//   console.log('输出：' + proxy.toFixed(2) + ' ...')
// })
// proxy.setValue(1000)

/**
 * Dummy test
 */
describe('rePrimitive test', () => {
  it('String test', () => {
    let proxy = rePrimitive('foo')
    let result
    watchEffect(() => {
      expect(proxy instanceof String).toBe(true)
      result = proxy.valueOf()
    })
    expect(result).toEqual('foo')

    proxy.setValue('bar')
    expect(result).toEqual('bar')
  })

  it('Number test', () => {
    let proxy = rePrimitive(123)
    let result
    watchEffect(() => {
      expect(proxy instanceof Number).toBe(true)
      result = proxy.valueOf()
    })
    expect(result).toEqual(123)

    proxy.setValue(1000)
    expect(result).toEqual(1000)
  })

  it('Boolean test', () => {
    let proxy = rePrimitive(false)
    let result
    watchEffect(() => {
      expect(proxy instanceof Boolean).toBe(true)
      result = proxy.valueOf()
    })
    expect(result).toEqual(false)

    proxy.setValue(true)
    expect(result).toEqual(true)
  })
})
