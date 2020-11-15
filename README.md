# Vue3 的 ref 真让很多大佬操碎了心

最近 Vue3 关于 ref-sugar 的提案引起了广泛的讨论：https://juejin.im/post/6894175515515551752

感兴趣的同学可以先阅读上面的讨论，本文不再重复讨论。

目的是将 ref.value 的写法进一步简化:

```vue
<script setup>
import Foo from './Foo.vue'

// declaring a variable that compiles to a ref
ref: count = 1
const inc = () => {
  count++
}
// access the raw ref object by prefixing with $
console.log($count.value)
</script>

<template>
  <Foo :count="count" @click="inc" />
</template>
```

## 1. 回顾 vue-composition-api-rfc

读写 ref 的操作比普通值的更冗余，因为需要访问 .value。尤大大对使用编译时的语法糖来解决这个问题非常谨慎，曾明确表示不默认提供此类支持。
https://vue-composition-api-rfc.netlify.app/zh/#%E5%BC%95%E5%85%A5-ref-%E7%9A%84%E5%BF%83%E6%99%BA%E8%B4%9F%E6%8B%85

## 2. 转成对象 new String('foo') 再拦截

究其根本，我们无法对基础数据类型值做拦截。行呀，那我们把基础数据类型转成对应的包装类实例，再进行拦截。
例如： `let str = 'foo'` 改写成 `let strObj = new String('foo')`，此时 `strObj` 是对象，接下来我们尝试拦截，我写了一个库**re-primitive**,使用示例如下：

```js
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
```

- rePrimitive: 相当于 reactive, ref。将基本数据类型设置成响应式，如果传递的是 new String('foo'), 则 proxy 仍然是 String 的实例；
  支持 String | Number | Boolean 三种类型，可简写去掉主动装箱。

```js
let proxyStr = rePrimitive('foo') // 等价于 let proxyStr = rePrimitive(new String('foo'))
let proxyNum = rePrimitive(123) // 等价于 let proxyNum = rePrimitive(new Number(123))
let proxyBool = rePrimitive(false) // 等价于 let proxyBool = rePrimitive(new Boolean(false))
```

- setValue: 响应式修改数据，重新执行 effect 函数

## 3. 总结

- 开发者需要时刻注意 proxy 是对象，记得调用 .valueOf()方法才能取到实际值。配合 eslint 插件可帮助检查漏写.valueOf()方法
- 这种解决方案完整保留 js 语言特性，仅仅只是增加了 setValue() 方法，对开发者的心智负担可能略少于 ref
- 实现源码仓库：https://github.com/ruige24601/re-primitive.git
