import { reactive, trigger, track, effect, TrackOpTypes, TriggerOpTypes } from '@vue/reactivity'
interface ReString extends String {
  setValue: (value: String) => void
}
interface ReNumber extends Number {
  setValue: (value: Number) => void
}
interface ReBoolean extends Boolean {
  setValue: (value: Boolean) => void
}

export const watchEffect = effect

export function rePrimitive(prim: String): ReString
export function rePrimitive(prim: Number): ReNumber
export function rePrimitive(prim: Boolean): ReBoolean
export function rePrimitive(prim: String | Number | Boolean) {
  const obj = {}
  setValue(prim)
  function setValue(value) {
    if (typeof value === 'string') {
      prim = new String(value)
    } else if (typeof value === 'number') {
      prim = new Number(value)
    } else if (typeof value === 'boolean') {
      prim = new Boolean(value)
    } else {
      prim = value
    }
    Object.setPrototypeOf(obj, prim)
    trigger(obj, TriggerOpTypes.SET, '__value__')
    // trigger(obj, 'set', '__value__')
  }

  return new Proxy(obj, {
    get(target, key, receiver) {
      if (key === 'setValue') {
        return setValue
      }
      track(target, TrackOpTypes.GET, '__value__')
      // track(target, 'get', '__value__')
      let result = Reflect.get(target, key, receiver)
      if (typeof result === 'function') {
        return result.bind(prim)
      }
      return result
    },
  }) as ReString | ReNumber | ReBoolean
}
