const { rePrimitive, watchEffect } = require('../dist/re-primitive.cjs')

// 用 rePrimitive 代替 ref; 并传入String的包装对象  new String('foo')
let proxy = rePrimitive(new String('foo'))
// let proxy = rePrimitive('foo')  // 内部做了装箱，可简写去掉 new String()
// rePrimitive 的作用是将对象设置成响应式，并增加 setValue() 修改数据的方法

watchEffect(() => {
  console.log('输出 proxy instanceof String：', proxy instanceof String) // true , 可以看出 proxy是String的实例，可以使用所有的String的原型方法
  console.log('输出 proxy.valueOf()：' + proxy.valueOf())
  console.log('输出：proxy.substring(1): ' + proxy.substring(1))
})
console.log('==========')
proxy.setValue('bar') // 响应式修改数据，重新执行 effect 函数
