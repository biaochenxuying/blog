![](https://upload-images.jianshu.io/upload_images/12890819-b2a2443f96933250.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


# 前言

最新的 ECMAScript 都已经到发布到 2018 版了。

我们应该有的态度是： Stay hungry ! Stay young ！

从接触 vue 到工作中用到 vue 将近 2 年了，在开发 vue 项目中用到了很多 es6 的 api ，es6 给我的开发带来了很大便利。

本文只总结小汪在工作和面试中经常遇到的 ES6 及之后的新 api 。

有空就得多总结，一边总结，一边重温学习！！！

# 正文

## 1 let 和 const

let 的作用域与 const 命令相同：只在声明所在的块级作用域内有效。且不存在变量提升 。

#### 1.1 let

let 所声明的变量，可以改变。
```
let a = 123
a = 456 // 正确，可以改变

let b = [123]
b = [456] // 正确，可以改变
```

#### 1.2 const 

const 声明一个只读的常量。一旦声明，常量的值就不能改变。

简单类型的数据（数值、字符串、布尔值），不可以变动

```
const a = 123
a = 456 // 报错，不可改变

let b = [123]
b = [456] // 报错，不可以重新赋值，不可改变
```
复合类型的数据（主要是对象和数组），可以这样子变动
```
const a = [123]
a.push(456) // 成功

const b = {}
b.name = 'demo'  // 成功
```
## 1.3 不存在变量提升
```
{
  let a = 10;
  var b = 1;
}

a // ReferenceError: a is not defined.
b // 1
```
所以 for循环的计数器，就很合适使用 let 命令。
```
let a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 6
```
## 1.4 推荐

对于 数值、字符串、布尔值 经常会变的，用 let 声明。

对象、数组和函数用 const 来声明。

```
// 如经常用到的导出 函数
export const funA = function(){
    // ....
}
```
## 2 解构（Destructuring）

#### 2.1 数组

一次性声明多个变量：
```
let [a, b, c] = [1, 2, 3];
console.log(a) // 1
console.log(b) // 2
console.log(c) // 3
```
结合扩展运算符：
```
let [head, ...tail] = [1, 2, 3, 4];
console.log(head) // 1
console.log(tail) // [2, 3, 4]
```
解构赋值允许指定默认值：
```
let [foo = true] = [];
foo // true

let [x, y = 'b'] = ['a'];
// x='a', y='b'
```
#### 2.2 对象

解构不仅可以用于数组，还可以用于对象。
```
let { a, b } = { a: "aaa", b: "bbb" };
a // "aaa"
b // "bbb"
```
数组中，变量的取值由它 **排列的位置** 决定；而对象中，变量必须与 **属性** 同名，才能取到正确的值。

对象的解构也可以指定默认值。
```
let {x = 3} = {};
x // 3

let {x, y = 5} = {x: 1};
x // 1
y // 5
```
#### 2.3 字符串

字符串也可以解构赋值。这是因为此时，字符串被转换成了一个类似数组的对象。

```
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"
```

#### 2.4 用途

1. 交换变量的值
```
let x = 1;
let y = 2;

[x, y] = [y, x];
```

2. 从函数返回多个值

```
// 返回一个数组

function example() {
  let [a, b, c] = [1, 2, 3]
  return  [a, b, c] 
}
let [a, b, c] = example();

// 返回一个对象
function example() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example();
```
3. 函数参数的默认值

```
function funA (a = 1, b = 2){
      return a + b;
}

funA(3) // 5 因为 a 是 3, b 是 2
funA(3，3) // 6 因为 a 是 3, b 是 3

```
4. 输入模块的指定方法

加载模块时，往往需要指定输入哪些方法。解构赋值使得输入语句非常清晰。
```
const { SourceMapConsumer, SourceNode } = require("source-map");
```

在 utils.js 中：
```
export const function A (){
    console.log('A')
}

export const function B (){
   console.log('B')
}

export const function C (){
     console.log('C')
}
```
在 组件中引用时：
```
import { A, B, C } from "./utils.js" 

//调用
A() // 输出 A 

```


## 3. 模板字符串（template string）

模板字符串（template string）用反引号（`）标识。

#### 3.1 纯字符串
所有模板字符串的空格和换行，都是被保留的.
```
console.log(`输出值为 N, 

换行`)
// "输出值为 N

换行"
```

#### 3.2 字符串中加变量

模板字符串中嵌入变量，需要将变量名写在 ${ } 之中

```
let x = 1;
let y = 2;

console.log(`输出值为：${x}`) // "输出值为：1"
console.log(`输出值为：${x + y}`) // "输出值为：3"
```

#### 3.3 模板字符串之中还能调用函数。
```
function fn() {
  return "Hello World";
}

console.log(`输出值为：${fn()}`) // "输出值为：Hello World"
```

## 4. 字符串函数扩展

- includes()：返回布尔值，表示是否找到了参数字符串。
- startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
- endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。

```
let s = 'Hello world!';

s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true
```
这三个方法都支持第二个参数，表示开始搜索的位置。
```
let s = 'Hello world!';

s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false
```

## 5. 数值扩展

#### 5.1 指数运算符

ES2016 新增了一个指数运算符（**）。
```
2 ** 2 // 4
2 ** 3 // 8
```
这个运算符的一个特点是右结合，而不是常见的左结合。多个指数运算符连用时，是从最右边开始计算的。
```
// 相当于 2 ** (3 ** 2)
2 ** 3 ** 2
// 512
```
上面代码中，首先计算的是第二个指数运算符，而不是第一个。

指数运算符可以与等号结合，形成一个新的赋值运算符（**=）。
```
let a = 1.5;
a **= 2;
// 等同于 a = a * a;

let b = 4;
b **= 3;
// 等同于 b = b * b * b;
```

## 6. 函数的扩展

除了在解构中说到的函数参数的默认值，还有不少经常会用到的方法。

#### 6. 1  rest 参数

ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用 arguments 对象了。rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。

```
function add(...values) {
  let sum = 0;

  for (let val of values) {
    sum += val;
  }

  return sum;
}

add(2, 5, 3) // 10
```
上面代码的 add 函数是一个求和函数，利用 rest 参数，可以向该函数传入任意数目的参数。

注意，rest 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错。

```
// 报错
function f(a, ...b, c) {
  // ...
}
```

#### 6.2 箭头函数

ES6 允许使用“箭头”（=>）定义函数。
```
const f = v => v;
console.log('输出值:', f(3)) // 输出值: 3
// 等同于
const f = function (v) {
  return v;
};
```
如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分。
```
// 等同于
const f = function () { return 5 };

const sum = (num1, num2) => num1 + num2;
// 等同于
const sum = function(num1, num2) {
  return num1 + num2;
};
```
如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用 return 语句返回。
```
const sum = (num1, num2) => { return num1 + num2; }
```
箭头函数的一个用处是简化回调函数。
```
const square = n => n * n;

// 正常函数写法
[1,2,3].map(function (x) {
  return x * x;
});

// 箭头函数写法
[1,2,3].map(x => x * x);
```

**注意: 函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。**

this 对象的指向是可变的，但是在箭头函数中，它是固定的。
```
function foo() {
  setTimeout(() => {
    console.log('id:', this.id);
  }, 100);
}

let id = 21;

foo.call({ id: 42 });
// id: 42
```
上面代码中，setTimeout 的参数是一个箭头函数，这个箭头函数的定义生效是在 foo 函数生成时，而它的真正执行要等到 100 毫秒后。如果是普通函数，执行时 this 应该指向全局对象window，这时应该输出 21。但是，箭头函数导致 this 总是指向函数定义生效时所在的对象（本例是{ id: 42}），所以输出的是 42。

## 7. 数组的扩展

扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

#### 7.1 数组合并的新写法。

```
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

// ES5 的合并数组
arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6 的合并数组
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]
```
#### 7.2 函数调用。
```
function add(x, y) {
  return x + y;
}

const numbers = [4, 4];
add(...numbers) // 8
```
#### 7.3 复制数组的简便写法。
```
const a1 = [1, 2];
// 写法一
const a2 = [...a1];
a2[0] = 2;
a1 // [1, 2]
// 写法二
const [...a2] = a1;
a2[0] = 2;
a1 // [1, 2]
```
上面的两种写法，a2 都是 a1 的克隆，且不会修改原来的数组。

#### 7.4 将字符串转为真正的数组。
```
[...'hello']
// [ "h", "e", "l", "l", "o" ]
```

#### 7.5 数组实例的 entries()，keys() 和 values()

用 for...of 循环进行遍历，唯一的区别是 keys() 是对键名的遍历、values() 是对键值的遍历，entries() 是对键值对的遍历。
```
for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"
```
#### 7.6  includes()

Array.prototype.includes 方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的 includes 方法类似。ES2016 引入了该方法。
```
[1, 2, 3].includes(2)     // true
[1, 2, 3].includes(4)     // false
[1, 2, NaN].includes(NaN) // true
```
该方法的第二个参数表示搜索的起始位置，默认为 0。如果第二个参数为负数，则表示倒数的位置，如果这时它大于数组长度（比如第二个参数为 -4，但数组长度为 3 ），则会重置为从 0 开始。
```
[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true
```

## 8. 对象的扩展

#### 8.1 属性和方法 的简洁表示法

```
let birth = '2000/01/01';

const Person = {

  name: '张三',

  //等同于birth: birth
  birth,

  // 等同于hello: function ()...
  hello() { console.log('我的名字是', this.name); }

};
```
#### 8.2 Object.assign()

Object.assign方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。
```
const target = { a: 1 };

const source1 = { b: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
```
Object.assign方法的第一个参数是目标对象，后面的参数都是源对象。

**注意，如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性。**
```
const target = { a: 1, b: 1 };

const source1 = { b: 2, c: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
```

Object.assign 方法实行的是浅拷贝，而不是深拷贝。
```
const obj1 = {a: {b: 1}};
const obj2 = Object.assign({}, obj1);

obj1.a.b = 2;
obj2.a.b // 2
```
上面代码中，源对象 obj1 的 a 属性的值是一个对象，Object.assign 拷贝得到的是这个对象的引用。这个对象的任何变化，都会反映到目标对象上面。

## 9. Set

ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

Set 本身是一个构造函数，用来生成 Set 数据结构。
```
// 基本用法
const s = new Set();

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

for (let i of s) {
  console.log(i);
}
// 2 3 5 4


// 去除数组的重复成员
const array = [1, 1, 2, 3, 4, 4]
[...new Set(array)]
// [1, 2, 3, 4]
```
## 10. Promise 对象

Promise 是异步编程的一种解决方案。

Promise 对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。

Promise 对象的状态改变，只有两种可能：从 pending 变为 fulfilled 和从 pending 变为 
 rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）

```
const someAsyncThing = function(flag) {
  return new Promise(function(resolve, reject) {
    if(flag){
        resolve('ok');
    }else{
        reject('error')
    }
  });
};

someAsyncThing(true).then((data)=> {
  console.log('data:',data); // 输出 'ok'
}).catch((error)=>{
  console.log('error:', error); // 不执行
})

someAsyncThing(false).then((data)=> {
  console.log('data:',data); // 不执行
}).catch((error)=>{
  console.log('error:', error); // 输出 'error'
})
```
上面代码中，someAsyncThing 函数成功返回 ‘OK’, 失败返回 ‘error’, 只有失败时才会被 catch 捕捉到。

最简单实现：
```
// 发起异步请求
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => ({ data }))
      .catch(err => ({ err }));
```

来看一道有意思的面试题：
```
setTimeout(function() {
  console.log(1)
}, 0);
new Promise(function executor(resolve) {
  console.log(2);
  for( var i=0 ; i<10000 ; i++ ) {
    i == 9999 && resolve();
  }
  console.log(3);
}).then(function() {
  console.log(4);
});
console.log(5);
```
这道题应该考察 JavaScript 的运行机制的。
首先先碰到一个 setTimeout，于是会先设置一个定时，在定时结束后将传递这个函数放到任务队列里面，因此开始肯定不会输出 1 。
然后是一个 Promise，里面的函数是直接执行的，因此应该直接输出 2 3 。
然后，Promise 的 then 应当会放到当前 tick 的最后，但是还是在当前 tick 中。
因此，应当先输出 5，然后再输出 4 。
最后在到下一个 tick，就是 1 。
答案：``` “2 3 5 4 1” ```

## 11. async 函数

ES2017 标准引入了 async 函数，使得异步操作变得更加方便。

async 函数的使用方式，直接在普通函数前面加上 async，表示这是一个异步函数，在要异步执行的语句前面加上 await，表示后面的表达式需要等待。async 是 Generator 的语法糖

- 1. async 函数内部 return 语句返回的值，会成为 then 方法回调函数的参数。
```
async function f() {
  return 'hello world';
}

f().then(v => console.log(v))
// "hello world"
```
上面代码中，函数 f 内部 return 命令返回的值，会被 then 方法回调函数接收到。

- 2. async 函数内部抛出错误，会导致返回的 Promise 对象变为 reject 状态。抛出的错误对象会被 catch 方法回调函数接收到。
```
async function f() {
  throw new Error('出错了');
}

f().then(
  result => console.log(result),
  error => console.log(error)
)
// Error: 出错了
```

- 3. async 函数返回的 Promise 对象，必须等到内部所有 await 命令后面的 Promise 对象执行完，才会发生状态改变，除非遇到 return 语句或者抛出错误。也就是说，只有 async 函数内部的异步操作执行完，才会执行 then 方法指定的回调函数。
下面是一个例子:
```
async function getTitle(url) {
  let response = await fetch(url);
  let html = await response.text();
  return html.match(/<title>([\s\S]+)<\/title>/i)[1];
}
getTitle('https://tc39.github.io/ecma262/').then(console.log('完成'))
// "ECMAScript 2017 Language Specification"
```
上面代码中，函数 getTitle 内部有三个操作：抓取网页、取出文本、匹配页面标题。只有这三个操作全部完成，才会执行 then 方法里面的 console.log。

- 4. 在 vue 中，我们可能要先获取  token ，之后再用 token 来请求用户数据什么的，可以这样子用：
```
methods:{
        getToken() {
            return new Promise((resolve, reject) => {
                this.$http.post('/token')
                    .then(res => {
                        if (res.data.code === 200) {
                           resolve(res.data.data)
                        } else {
                            reject()
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
       },
       getUserInfo(token) {
            return new Promise((resolve, reject) => {
                this.$http.post('/userInfo',{
                        token: token
                    })
                    .then(res => {
                        if (res.data.code === 200) {
                           resolve(res.data.data)
                        } else {
                            reject()
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
       },
       async initData() {
            let token = await this.getToken()
            this.userInfo = this.getUserInfo(token)
       },
}
```
##12. import 和 export

import 导入模块、export 导出模块

```
// example2.js  // 导出默认, 有且只有一个默认
export default const example2 = {
  name : 'my name',
  age : 'my age',
  getName  = function(){  return 'my name' }
}
//全部导入 // 名字可以修改
import people from './example2.js'

-------------------我是一条华丽的分界线---------------------------

// example1.js // 部分导出
export let name  = 'my name'
export let age  = 'my age'
export let getName  = function(){ return 'my name'}

// 导入部分 // 名字必须和 定义的名字一样。
import  {name, age} from './example1.js'

//有一种特殊情况，即允许你将整个模块当作单一对象进行导入
//该模块的所有导出都会作为对象的属性存在
import * as example from "./example1.js"
console.log(example.name)
console.log(example.age)
console.log(example.getName())

-------------------我是一条华丽的分界线---------------------------

// example3.js  // 有导出默认, 有且只有一个默认，// 又有部分导出
export default const example3 = {
  birthday : '2018 09 20'
}
export let name  = 'my name'
export let age  = 'my age'
export let getName  = function(){ return 'my name'}

// 导入默认与部分
import example3, {name, age} from './example1.js'

```
总结：
```
1.当用 export default people 导出时，就用 import people 导入（不带大括号）

2.一个文件里，有且只能有一个 export default。但可以有多个 export。

3.当用 export name 时，就用 import { name }导入（记得带上大括号）

4.当一个文件里，既有一个 export default people, 又有多个 export name 或者 export age 时，导入就用 import people, { name, age } 

5.当一个文件里出现 n 多个 export 导出很多模块，导入时除了一个一个导入，也可以用 import * as example

```

##13. Class

对于 Class ，小汪用在 react 中较多。

#### 13.1基本用法：
```
//定义类
class FunSum {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  sum() {
    console.log( this.x +this.y')
  }
}

// 使用的时候，也是直接对类使用new命令，跟构造函数的用法完全一致。
let f = new FunSum(10, 20);
f.sum() // 30
```
#### 13.2 继承
```
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}
```
上面代码中，constructor 方法和 toString 方法之中，都出现了super关键字，它在这里表示父类的构造函数，用来新建父类的 this 对象。

子类必须在 constructor 方法中调用 super 方法，否则新建实例时会报错。这是因为子类自己的 this 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。**如果不调用 super 方法，子类就得不到 this 对象。**
```
class Point { /* ... */ }

class ColorPoint extends Point {
  constructor() {
  }
}

let cp = new ColorPoint(); // ReferenceError
```
上面代码中，ColorPoint 继承了父类 Point，但是它的构造函数没有调用 super 方法，导致新建实例时报错。


# 最后

总结和写博客的过程就是学习的过程，是一个享受的过程 ！！！

好了，面试和工作中用到 ES6 精粹几乎都在这了。

如果你觉得该文章对你有帮助，欢迎到我的 github star 一下，谢谢。
 [github 地址](https://github.com/biaochenxuying/blog)

文章很多内容参考了：[ECMAScript 6 标准入门](http://es6.ruanyifeng.com/)

如果你是 JavaScript 语言的初学者，建议先看 [《JavaScript 语言入门教程》](https://wangdoc.com/javascript/)

你以为本文就这么结束了 ?  **精彩在后面 ！！！**

![](https://upload-images.jianshu.io/upload_images/12890819-4adaa268cecbd322.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



对 全栈开发 有兴趣的朋友可以扫下方二维码关注我的公众号
 
我会不定期更新有价值的内容。

> 微信公众号：爱写bugger的阿拉斯加
> 分享 前端开发、后端开发 等相关的技术文章，热点资源，全栈程序员的成长之路。

关注公众号并回复 **福利** 便免费送你视频资源，绝对干货。

福利详情请点击：  [免费资源分享——Python、Java、Linux、Go、node、vue、react、javaScript](https://www.jianshu.com/p/5bce99731a13)

![爱写bugger的阿拉斯加](https://upload-images.jianshu.io/upload_images/12890819-d33a51f4cefc78ea.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 
