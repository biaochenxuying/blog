![](https://upload-images.jianshu.io/upload_images/12890819-891eae6ecef8a506.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


> 复杂度分析是整个算法学习的精髓，只要掌握了它，数据结构和算法的内容基本上就掌握了一半了。

## 1. 什么是复杂度分析 ？

1. 数据结构和算法解决是 “如何让计算机更快时间、更省空间的解决问题”。

2. 因此需从执行时间和占用空间两个维度来评估数据结构和算法的性能。

3. 分别用时间复杂度和空间复杂度两个概念来描述性能问题，二者统称为复杂度。

4. 复杂度描述的是算法执行时间（或占用空间）与数据规模的增长关系。

## 2. 为什么要进行复杂度分析 ？

1. 和性能测试相比，复杂度分析有不依赖执行环境、成本低、效率高、易操作、指导性强的特点。

2. 掌握复杂度分析，将能编写出性能更优的代码，有利于降低系统开发和维护成本。

## 3. 如何进行复杂度分析 ？

### 3.1 大 O 表示法

算法的执行时间与每行代码的执行次数成正比，用 T(n) = O(f(n)) 表示，其中 T(n) 表示算法执行总时间，f(n) 表示每行代码执行总次数，而 n 往往表示数据的规模。这就是大 O 时间复杂度表示法。

### 3.2 时间复杂度

1）定义

算法的时间复杂度，也就是算法的时间量度。

**大 O 时间复杂度表示法** 实际上并不具体表示代码真正的执行时间，而是表示 **代码执行时间随数据规模增长的变化趋势**，所以也叫 **渐进时间复杂度**，简称 **时间复杂度**（asymptotic time complexity）。

例子1：
```
function aFun() {
    console.log("Hello, World!");      //  需要执行 1 次
    return 0;       // 需要执行 1 次
}
```
那么这个方法需要执行 2 次运算。

例子 2：
```
function bFun(n) {
    for(let i = 0; i < n; i++) {         // 需要执行 (n + 1) 次
        console.log("Hello, World!");      // 需要执行 n 次
    }
    return 0;       // 需要执行 1 次
}
```
那么这个方法需要执行 ( n + 1 + n + 1 ) = 2n +2 次运算。

例子 3：
```
 function cal(n) {
   let sum = 0; // 1 次
   let i = 1; // 1 次
   let j = 1; // 1 次
   for (; i <= n; ++i) {  // n 次
     j = 1;  // n 次
     for (; j <= n; ++j) {  // n * n ，也即是  n平方次
       sum = sum +  i * j;  // n * n ，也即是  n平方次
     }
   }
 }

```
注意，这里是二层 for 循环，所以第二层执行的是 n * n  = n<sup>2</sup> 次，而且这里的循环是 ++i，和例子 2 的是 i++，是不同的，是先加与后加的区别。

那么这个方法需要执行 ( n<sup>2</sup> +  n<sup>2</sup> + n + n + 1 + 1 +1 ) = 2n<sup>2</sup> +2n + 3 。

2）特点

以时间复杂度为例，由于 **时间复杂度** 描述的是算法执行时间与数据规模的 **增长变化趋势**，所以 **常量、低阶、系数** 实际上对这种增长趋势不产生决定性影响，所以在做时间复杂度分析时 **忽略** 这些项。

所以，上面例子1 的时间复杂度为 T(n) = O(1)，例子2 的时间复杂度为 T(n) = O(n)，例子3 的时间复杂度为 T(n) = O(n<sup>2</sup>)。


### 3.3 时间复杂度分析

- 1. **只关注循环执行次数最多的一段代码**

 单段代码看高频：比如循环。

```
function cal(n) { 
   let sum = 0;
   let i = 1;
   for (; i <= n; ++i) {
     sum = sum + i;
   }
   return sum;
 }
```

执行次数最多的是 for 循环及里面的代码，执行了 n 次，所以时间复杂度为 O(n)。

- 2. **加法法则：总复杂度等于量级最大的那段代码的复杂度**

多段代码取最大：比如一段代码中有单循环和多重循环，那么取多重循环的复杂度。

```
function cal(n) {
   let sum_1 = 0;
   let p = 1;
   for (; p < 100; ++p) {
     sum_1 = sum_1 + p;
   }

   let sum_2 = 0;
   let q = 1;
   for (; q < n; ++q) {
     sum_2 = sum_2 + q;
   }
 
   let sum_3 = 0;
   let i = 1;
   let j = 1;
   for (; i <= n; ++i) {
     j = 1; 
     for (; j <= n; ++j) {
       sum_3 = sum_3 +  i * j;
     }
   }
 
   return sum_1 + sum_2 + sum_3;
 }
```

上面代码分为三部分，分别求 sum_1、sum_2、sum_3 ，主要看循环部分。

第一部分，求 sum_1 ，明确知道执行了 100 次，而和 n 的规模无关，是个常量的执行时间，不能反映**增长变化趋势**，所以时间复杂度为 O(1)。

第二和第三部分，求 sum_2 和 sum_3 ，时间复杂度是和 n 的规模有关的，为别为 O(n) 和 O(n<sup>2</sup>)。

所以，取三段代码的最大量级，上面例子的最终的时间复杂度为 O(n<sup>2</sup>)。

同理类推，如果有 3 层 for 循环，那么时间复杂度为 O(n<sup>3</sup>)，4 层就是  O(n<sup>4</sup>)。

所以，**总的时间复杂度就等于量级最大的那段代码的时间复杂度**。


- 3. **乘法法则：嵌套代码的复杂度等于嵌套内外代码复杂度的乘积**

嵌套代码求乘积：比如递归、多重循环等。

```
function cal(n) {
   let ret = 0; 
   let i = 1;
   for (; i < n; ++i) {
     ret = ret + f(i); // 重点为  f(i)
   } 
 } 
 
function f(n) {
  let sum = 0;
  let i = 1;
  for (; i < n; ++i) {
    sum = sum + i;
  } 
  return sum;
 }
```

方法 cal 循环里面调用 f 方法，而 f 方法里面也有循环。

所以，整个 cal() 函数的时间复杂度就是，T(n) = T1(n) * T2(n) = O(n*n) = O(n<sup>2</sup>) 。

- 4. **多个规模求加法：比如方法有两个参数控制两个循环的次数，那么这时就取二者复杂度相加**

```
function cal(m, n) {
  let sum_1 = 0;
  let i = 1;
  for (; i < m; ++i) {
    sum_1 = sum_1 + i;
  }

  let sum_2 = 0;
  let j = 1;
  for (; j < n; ++j) {
    sum_2 = sum_2 + j;
  }

  return sum_1 + sum_2;
}
```

以上代码也是求和 ，求 sum_1 的数据规模为 m、求 sum_2 的数据规模为 n，所以时间复杂度为 O(m+n)。

**公式：T1(m) + T2(n) = O(f(m) + g(n)) 。**

- 5.  **多个规模求乘法：比如方法有两个参数控制两个循环的次数，那么这时就取二者复杂度相乘**

```
function cal(m, n) {
  let sum_3 = 0;
   let i = 1;
   let j = 1;
   for (; i <= m; ++i) {
     j = 1; 
     for (; j <= n; ++j) {
       sum_3 = sum_3 +  i * j;
     }
   }
}
```

以上代码也是求和，两层 for 循环 ，求 sum_3 的数据规模为 m 和 n，所以时间复杂度为 O(m*n)。

**公式：T1(m) * T2(n) = O(f(m) * g(n)) 。**

### 3.4 常用的时间复杂度分析

- 1. **多项式阶：随着数据规模的增长，算法的执行时间和空间占用，按照多项式的比例增长。**

包括 O(1)（常数阶）、O(logn)（对数阶）、O(n)（线性阶）、O(nlogn)（线性对数阶）、O(n<sup>2</sup>) （平方阶）、O(n<sup>3</sup>)（立方阶）。

除了 O(logn)、O(nlogn) ，其他的都可从上面的几个例子中看到。

下面举例说明  **O(logn)（对数阶）**：

```
let i=1;
while (i <= n)  {
   i = i * 2;
}
```

代码是从 1 开始，每次循环就乘以 2，当大于 n 时，循环结束。

其实就是高中学过的等比数列，i 的取值就是一个等比数列。在数学里面是这样子的：

2<sup>0</sup>  2<sup>1</sup>  2<sup>2</sup>  ... 2<sup>k</sup> ...  2<sup>x</sup>  = n

所以，我们只要知道 x 值是多少，就知道这行代码执行的次数了，通过 2x = n 求解 x，数学中求解得 x = log<sub>2</sub>n 。所以上面代码的时间复杂度为 O(log<sub>2</sub>n)。

实际上，不管是以 2 为底、以 3 为底，还是以 10 为底，我们可以把所有对数阶的时间复杂度都记为 O(logn)。为什么呢？

因为对数之间是可以互相转换的，log3n = log<sub>3</sub>2 * log<sub>2</sub>n，所以 O(log<sub>3</sub>n) = O(C * log<sub>2</sub>n)，其中 C=log<sub>3</sub>2 是一个常量。

由于 **时间复杂度** 描述的是算法执行时间与数据规模的 **增长变化趋势**，所以 **常量、低阶、系数** 实际上对这种增长趋势不产生决定性影响，所以在做时间复杂度分析时 **忽略** 这些项。

因此，**在对数阶时间复杂度的表示方法里，我们忽略对数的 “底”，统一表示为 O(logn)**。

下面举例说明  **O(nlogn)（对数阶）**：

```
function aFun(n){
  let i = 1;
  while (i <= n)  {
     i = i * 2;
  }
  return i
}

function cal(n) { 
   let sum = 0;
   for (let i = 1; i <= n; ++i) {
     sum = sum + aFun(n);
   }
   return sum;
 }
```

aFun 的时间复杂度为 O(logn)，而 cal 的时间复杂度为 O(n)，所以上面代码的时间复杂度为 T(n) = T1(logn) * T2(n) = O(logn*n) = O(nlogn) 。

- 2. **非多项式阶：随着数据规模的增长，算法的执行时间和空间占用暴增，这类算法性能极差。**

包括 O(2<sup>n</sup>)（指数阶）、O(n!)（阶乘阶）。

 O(2<sup>n</sup>)（指数阶）例子：

```
aFunc( n ) {
    if (n <= 1) {
        return 1;
    } else {
        return aFunc(n - 1) + aFunc(n - 2);
    }
}
```

参考答案：
显然运行次数，T(0) = T(1) = 1，同时 T(n) = T(n - 1) + T(n - 2) + 1，这里的 1 是其中的加法算一次执行。
显然 T(n) = T(n - 1) + T(n - 2) 是一个[斐波那契数列](https://baike.baidu.com/item/%E6%96%90%E6%B3%A2%E9%82%A3%E5%A5%91%E6%95%B0%E5%88%97)，通过归纳证明法可以证明，当 n >= 1 时 T(n) < (5/3)<sup>n</sup>，同时当 n > 4 时 T(n) >= (3/2)<sup>n</sup>。
所以该方法的时间复杂度可以表示为 O((5/3)<sup>n</sup>)，简化后为 O(2<sup>n</sup>)。
可见这个方法所需的运行时间是以指数的速度增长的。
如果大家感兴趣，可以试下分别用 1，10，100 的输入大小来测试下算法的运行时间，相信大家会感受到时间复杂度的无穷魅力。

### 3.5 时间复杂度分类

时间复杂度可以分为：

- **最好情况时间复杂度**（best case time complexity）：在最理想的情况下，执行这段代码的时间复杂度。
- **最坏情况时间复杂度**（worst case time complexity）：在最糟糕的情况下，执行这段代码的时间复杂度。
- **平均情况时间复杂度**（average case time complexity），用代码在所有情况下执行的次数的加权平均值表示。也叫 **加权平均时间复杂度** 或者 **期望时间复杂度**。
- **均摊时间复杂度**（amortized time complexity）: 在代码执行的所有复杂度情况中绝大部分是低级别的复杂度，个别情况是高级别复杂度且发生具有时序关系时，可以将个别高级别复杂度均摊到低级别复杂度上。基本上均摊结果就等于低级别复杂度。

举例说明：

```
// n 表示数组 array 的长度
function find(array, n, x) {
  let i = 0;
  let pos = -1;
  for (; i < n; ++i) {
    if (array[i] == x) {
      pos = i; 
      break;
    }
  }
  return pos;
}
```

find 函数实现的功能是在一个数组中找到值等于 x 的项，并返回索引值，如果没找到就返回 -1 。

**最好情况时间复杂度，最坏情况时间复杂度**

如果数组中第一个值就等于 x，那么时间复杂度为 O(1)，如果数组中不存在变量 x，那我们就需要把整个数组都遍历一遍，时间复杂度就成了 O(n)。所以，不同的情况下，这段代码的时间复杂度是不一样的。

所以上面代码的 `最好情况时间复杂度`为 O(1)，`最坏情况时间复杂度`为 O(n)。

**平均情况时间复杂度**

如何分析平均时间复杂度 ？代码在不同情况下复杂度出现量级差别，则用代码所有可能情况下执行次数的加权平均值表示。

要查找的变量 x 在数组中的位置，有 n+1 种情况：在数组的 0～n-1 位置中和不在数组中。我们把每种情况下，查找需要遍历的元素个数累加起来，然后再除以 n+1，就可以得到需要遍历的元素个数的平均值，即：

![](https://upload-images.jianshu.io/upload_images/12890819-d26874696f17beeb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

省略掉系数、低阶、常量，所以，这个公式简化之后，得到的`平均时间复杂度`就是 O(n)。

我们知道，要查找的变量 x，要么在数组里，要么就不在数组里。这两种情况对应的概率统计起来很麻烦，我们假设在数组中与不在数组中的概率都为 1/2。另外，要查找的数据出现在 0～n-1 这 n 个位置的概率也是一样的，为 1/n。所以，根据概率乘法法则，要查找的数据出现在 0～n-1 中任意位置的概率就是 1/(2n)。

因此，前面的推导过程中存在的最大问题就是，没有将各种情况发生的概率考虑进去。如果我们把每种情况发生的概率也考虑进去，那平均时间复杂度的计算过程就变成了这样：

![](https://upload-images.jianshu.io/upload_images/12890819-bdc97cea949dff77.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这个值就是概率论中的 **加权平均值**，也叫 **期望值**，所以平均时间复杂度的全称应该叫 **加权平均时间复杂度** 或者 **期望时间复杂度**。

所以，根据上面结论推导出，得到的 `平均时间复杂度` 仍然是 O(n)。

**均摊时间复杂度**

均摊时间复杂度就是一种特殊的平均时间复杂度 (应用场景非常特殊，非常有限，这里不说)。

### 3.6 时间复杂度总结

常用的时间复杂度所耗费的时间从小到大依次是：

**O(1) < O(logn) < (n) < O(nlogn) < O(n<sup>2</sup>) < O(n<sup>3</sup>) < O(2<sup>n</sup>) < O(n!) < O(n<sup>n</sup>)**

常见的时间复杂度：

![](https://upload-images.jianshu.io/upload_images/12890819-0fbba76f829055ff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/12890819-10170e78fbe1096d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/12890819-682a810f1a8ecb55.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/12890819-9b2c3a2844f82dbe.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 3.7 空间复杂度分析 

时间复杂度的全称是 **渐进时间复杂度**，表示 **算法的执行时间与数据规模之间的增长关系** 。

类比一下，空间复杂度全称就是 **渐进空间复杂度**（asymptotic space complexity），表示 **算法的存储空间与数据规模之间的增长关系** 。

定义：算法的空间复杂度通过计算算法所需的存储空间实现，算法的空间复杂度的计算公式记作：**S(n) = O(f(n))**，其中，n 为问题的规模，f(n) 为语句关于 n 所占存储空间的函数。

```
function print(n) {
 const newArr = []; // 第 2 行
 newArr.length = n; // 第 3 行
  for (let i = 0; i <n; ++i) {
    newArr[i] = i * i;
  }

  for (let j = n-1; j >= 0; --j) {
    console.log(newArr[i])
  }
}
```

跟时间复杂度分析一样，我们可以看到，第 2 行代码中，我们申请了一个空间存储变量 newArr ，是个空数组。第 3 行把 newArr 的长度修改为 n 的长度的数组，每项的值为 undefined ，除此之外，剩下的代码都没有占用更多的空间，所以整段代码的空间复杂度就是 O(n)。

我们常见的空间复杂度就是 O(1)、O(n)、O(n<sup>2</sup>)，像 O(logn)、O(nlogn) 这样的对数阶复杂度平时都用不到。

## 4. 如何掌握好复杂度分析方法 ？ 

> 复杂度分析关键在于多练，所谓孰能生巧。

平时我们在写代码时，是用 空间换时间 还是 时间换空间，可以根据算法的时间复杂度和空间复杂度来衡量。

## 5. 最后

如果你觉得本文章或者项目对你有启发，请给个赞或者  star 吧，点赞是一种美德，谢谢。

笔者文章常更地址：

[1. 微信公众号](https://mp.weixin.qq.com/s/-gwh7z1xjpBQ4IzD1ZJd-g)
[2. github](https://github.com/biaochenxuying/blog)
[3. 全栈修炼](https://biaochenxuying.cn/)

参考文章：

[复杂度分析（上）：如何分析、统计算法的执行效率和资源消耗？](https://time.geekbang.org/column/article/40036)
[(数据结构)十分钟搞定算法时间复杂度](https://www.jianshu.com/p/f4cca5ce055a)

![笔芯](https://upload-images.jianshu.io/upload_images/12890819-126d4fc9993d21ce.gif?imageMogr2/auto-orient/strip)
