# 十大经典算法

![JavaScript 数据结构与算法之美](https://upload-images.jianshu.io/upload_images/12890819-9f08a1abed2d7caf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 1. 前言

> 算法为王。

> 想学好前端，先练好内功，内功不行，就算招式练的再花哨，终究成不了高手；只有内功深厚者，前端之路才会走得更远。

笔者写的 **JavaScript 数据结构与算法之美** 系列用的语言是 **JavaScript** ，旨在入门数据结构与算法和方便以后复习。

文中包含了 `十大经典排序算法` 的思想、代码实现、一些例子、复杂度分析、动画、还有算法可视化工具。

这应该是目前比较全的 `JavaScript 十大经典排序算法` 的讲解了吧。


## 2. 如何分析一个排序算法

复杂度分析是整个算法学习的精髓。

- 时间复杂度: 一个算法执行所耗费的时间。 
- 空间复杂度: 运行完一个程序所需内存的大小。

时间和空间复杂度的详解，请看 [JavaScript 数据结构与算法之美 - 时间和空间复杂度](https://juejin.im/post/5cf37b6d6fb9a07eb15d3e88)。

学习排序算法，我们除了学习它的算法原理、代码实现之外，更重要的是要学会如何评价、分析一个排序算法。

分析一个排序算法，要从 `执行效率`、`内存消耗`、`稳定性` 三方面入手。

### 2.1 执行效率

**1. 最好情况、最坏情况、平均情况时间复杂度**

我们在分析排序算法的时间复杂度时，要分别给出最好情况、最坏情况、平均情况下的时间复杂度。
除此之外，你还要说出最好、最坏时间复杂度对应的要排序的原始数据是什么样的。


**2. 时间复杂度的系数、常数 、低阶**

我们知道，时间复杂度反应的是数据规模 n 很大的时候的一个增长趋势，所以它表示的时候会忽略系数、常数、低阶。

但是实际的软件开发中，我们排序的可能是 10 个、100 个、1000 个这样规模很小的数据，所以，在对同一阶时间复杂度的排序算法性能对比的时候，我们就要把系数、常数、低阶也考虑进来。

**3. 比较次数和交换（或移动）次数**

这一节和下一节讲的都是基于比较的排序算法。基于比较的排序算法的执行过程，会涉及两种操作，一种是元素比较大小，另一种是元素交换或移动。

所以，如果我们在分析排序算法的执行效率的时候，应该把比较次数和交换（或移动）次数也考虑进去。

### 2.2 内存消耗

也就是看空间复杂度。

还需要知道如下术语：

- **内排序**：所有排序操作都在内存中完成； 
- **外排序**：由于数据太大，因此把数据放在磁盘中，而排序通过磁盘和内存的数据传输才能进行；
- **原地排序**：原地排序算法，就是特指空间复杂度是 O(1) 的排序算法。

### 2.3 稳定性

- 稳定：如果待排序的序列中存在值`相等`的元素，经过排序之后，相等元素之间原有的先后顺序`不变`。
比如： a 原本在 b 前面，而 a = b，排序之后，a 仍然在 b 的前面； 
- 不稳定：如果待排序的序列中存在值`相等`的元素，经过排序之后，相等元素之间原有的先后顺序`改变`。
比如：a 原本在 b 的前面，而 a = b，排序之后， a 在 b 的后面；

## 3. 十大经典排序算法


### 3.1 冒泡排序（Bubble Sort）

![冒泡](https://upload-images.jianshu.io/upload_images/12890819-d6851592702b589c.gif?imageMogr2/auto-orient/strip)

**思想**

- 冒泡排序只会操作相邻的两个数据。
- 每次冒泡操作都会对相邻的两个元素进行比较，看是否满足大小关系要求。如果不满足就让它俩互换。
- 一次冒泡会让至少一个元素移动到它应该在的位置，重复 n 次，就完成了 n 个数据的排序工作。

**特点**

- 优点：排序算法的基础，简单实用易于理解。
- 缺点：比较次数多，效率较低。

**实现**

```javascript
// 冒泡排序（未优化）
const bubbleSort = arr => {
	console.time('改进前冒泡排序耗时');
	const length = arr.length;
	if (length <= 1) return;
	// i < length - 1 是因为外层只需要 length-1 次就排好了，第 length 次比较是多余的。
	for (let i = 0; i < length - 1; i++) {
		// j < length - i - 1 是因为内层的 length-i-1 到 length-1 的位置已经排好了，不需要再比较一次。
		for (let j = 0; j < length - i - 1; j++) {
			if (arr[j] > arr[j + 1]) {
				const temp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = temp;
			}
		}
	}
	console.log('改进前 arr :', arr);
	console.timeEnd('改进前冒泡排序耗时');
};
```

优化：当某次冒泡操作已经没有数据交换时，说明已经达到完全有序，不用再继续执行后续的冒泡操作。

```
// 冒泡排序（已优化）
const bubbleSort2 = arr => {
	console.time('改进后冒泡排序耗时');
	const length = arr.length;
	if (length <= 1) return;
	// i < length - 1 是因为外层只需要 length-1 次就排好了，第 length 次比较是多余的。
	for (let i = 0; i < length - 1; i++) {
		let hasChange = false; // 提前退出冒泡循环的标志位
		// j < length - i - 1 是因为内层的 length-i-1 到 length-1 的位置已经排好了，不需要再比较一次。
		for (let j = 0; j < length - i - 1; j++) {
			if (arr[j] > arr[j + 1]) {
				const temp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = temp;
				hasChange = true; // 表示有数据交换
			}
		}

		if (!hasChange) break; // 如果 false 说明所有元素已经到位，没有数据交换，提前退出
	}
	console.log('改进后 arr :', arr);
	console.timeEnd('改进后冒泡排序耗时');
};
```

**测试**

```
// 测试
const arr = [7, 8, 4, 5, 6, 3, 2, 1];
bubbleSort(arr);
// 改进前 arr : [1, 2, 3, 4, 5, 6, 7, 8]
// 改进前冒泡排序耗时: 0.43798828125ms

const arr2 = [7, 8, 4, 5, 6, 3, 2, 1];
bubbleSort2(arr2);
// 改进后 arr : [1, 2, 3, 4, 5, 6, 7, 8]
// 改进后冒泡排序耗时: 0.318115234375ms
```

**分析**

- 第一，冒泡排序是原地排序算法吗 ？
冒泡的过程只涉及相邻数据的交换操作，只需要常量级的临时空间，所以它的空间复杂度为 O(1)，是一个`原地`排序算法。
- 第二，冒泡排序是稳定的排序算法吗 ？
在冒泡排序中，只有交换才可以改变两个元素的前后顺序。
为了保证冒泡排序算法的稳定性，当有相邻的两个元素大小相等的时候，我们不做交换，相同大小的数据在排序前后不会改变顺序。
所以冒泡排序是`稳定`的排序算法。
- 第三，冒泡排序的时间复杂度是多少 ？
最佳情况：T(n) = O(n)，当数据已经是正序时。
最差情况：T(n) = O(n<sup>2</sup>)，当数据是反序时。
平均情况：T(n) = O(n<sup>2</sup>)。

**动画**

![冒泡排序动画](https://upload-images.jianshu.io/upload_images/12890819-68d55469ac439bc6.gif?imageMogr2/auto-orient/strip)


![冒泡排序动画](https://upload-images.jianshu.io/upload_images/12890819-3948de96d4a28530.gif?imageMogr2/auto-orient/strip)


### 3.2 插入排序（Insertion Sort）

插入排序又为分为 **直接插入排序** 和优化后的 **拆半插入排序** 与 **希尔排序**，我们通常说的插入排序是指直接插入排序。

**一、直接插入**

**思想**

一般人打扑克牌，整理牌的时候，都是按牌的大小（从小到大或者从大到小）整理牌的，那每摸一张新牌，就扫描自己的牌，把新牌插入到相应的位置。

插入排序的工作原理：通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。

**步骤**

- 从第一个元素开始，该元素可以认为已经被排序；
- 取出下一个元素，在已经排序的元素序列中从后向前扫描；
- 如果该元素（已排序）大于新元素，将该元素移到下一位置；
- 重复步骤 3，直到找到已排序的元素小于或者等于新元素的位置；
- 将新元素插入到该位置后；
- 重复步骤 2 ~ 5。

**实现**

```
// 插入排序
const insertionSort = array => {
	const len = array.length;
	if (len <= 1) return

	let preIndex, current;
	for (let i = 1; i < len; i++) {
		preIndex = i - 1; //待比较元素的下标
		current = array[i]; //当前元素
		while (preIndex >= 0 && array[preIndex] > current) {
			//前置条件之一: 待比较元素比当前元素大
			array[preIndex + 1] = array[preIndex]; //将待比较元素后移一位
			preIndex--; //游标前移一位
		}
		if (preIndex + 1 != i) {
			//避免同一个元素赋值给自身
			array[preIndex + 1] = current; //将当前元素插入预留空位
			console.log('array :', array);
		}
	}
	return array;
};
```

测试

```
// 测试
const array = [5, 4, 3, 2, 1];
console.log("原始 array :", array);
insertionSort(array);
// 原始 array:    [5, 4, 3, 2, 1]
// array:  		 [4, 5, 3, 2, 1]
// array:  		 [3, 4, 5, 2, 1]
// array: 		 [2, 3, 4, 5, 1]
// array:  		 [1, 2, 3, 4, 5]
```

**分析**

- 第一，插入排序是原地排序算法吗 ？
插入排序算法的运行并不需要额外的存储空间，所以空间复杂度是 O(1)，所以，这是一个`原地`排序算法。
- 第二，插入排序是稳定的排序算法吗 ？
在插入排序中，对于值相同的元素，我们可以选择将后面出现的元素，插入到前面出现元素的后面，这样就可以保持原有的前后顺序不变，所以插入排序是`稳定`的排序算法。
- 第三，插入排序的时间复杂度是多少 ？
最佳情况：T(n) = O(n)，当数据已经是正序时。
最差情况：T(n) = O(n<sup>2</sup>)，当数据是反序时。
平均情况：T(n) = O(n<sup>2</sup>)。

**动画**

![insertion-sort.gif](https://upload-images.jianshu.io/upload_images/12890819-8ba117506372e97e.gif?imageMogr2/auto-orient/strip)


**二、拆半插入**

插入排序也有一种优化算法，叫做`拆半插入`。

**思想**

折半插入排序是直接插入排序的升级版，鉴于插入排序第一部分为已排好序的数组，我们不必按顺序依次寻找插入点，只需比较它们的中间值与待插入元素的大小即可。

**步骤**

- 取 0 ~ i-1 的中间点 ( m = (i-1) >> 1 )，array[i] 与 array[m] 进行比较，若 array[i]  <  array[m]，则说明待插入的元素 array[i]  应该处于数组的 0 ~ m 索引之间；反之，则说明它应该处于数组的 m ~ i-1 索引之间。
- 重复步骤 1，每次缩小一半的查找范围，直至找到插入的位置。
- 将数组中插入位置之后的元素全部后移一位。
- 在指定位置插入第 i 个元素。


> 注：x >> 1 是位运算中的右移运算，表示右移一位，等同于 x 除以 2 再取整，即 x >> 1 == Math.floor(x/2) 。


```
// 折半插入排序
const binaryInsertionSort = array => {
	const len = array.length;
	if (len <= 1) return;

	let current, i, j, low, high, m;
	for (i = 1; i < len; i++) {
		low = 0;
		high = i - 1;
		current = array[i];

		while (low <= high) {
			//步骤 1 & 2 : 折半查找
			m = (low + high) >> 1; // 注: x>>1 是位运算中的右移运算, 表示右移一位, 等同于 x 除以 2 再取整, 即 x>>1 == Math.floor(x/2) .
			if (array[i] >= array[m]) {
				//值相同时, 切换到高半区，保证稳定性
				low = m + 1; //插入点在高半区
			} else {
				high = m - 1; //插入点在低半区
			}
		}
		for (j = i; j > low; j--) {
			//步骤 3: 插入位置之后的元素全部后移一位
			array[j] = array[j - 1];
			console.log('array2 :', JSON.parse(JSON.stringify(array)));
		}
		array[low] = current; //步骤 4: 插入该元素
	}
	console.log('array2 :', JSON.parse(JSON.stringify(array)));
	return array;
};
```

测试

```
const array2 = [5, 4, 3, 2, 1];
console.log('原始 array2:', array2);
binaryInsertionSort(array2);
// 原始 array2:  [5, 4, 3, 2, 1]
// array2 :     [5, 5, 3, 2, 1]
// array2 :     [4, 5, 5, 2, 1]
// array2 :     [4, 4, 5, 2, 1]
// array2 :     [3, 4, 5, 5, 1]
// array2 :     [3, 4, 4, 5, 1]
// array2 :     [3, 3, 4, 5, 1]
// array2 :     [2, 3, 4, 5, 5]
// array2 :     [2, 3, 4, 4, 5]
// array2 :     [2, 3, 3, 4, 5]
// array2 :     [2, 2, 3, 4, 5]
// array2 :     [1, 2, 3, 4, 5]
```


`注意`：和直接插入排序类似，折半插入排序每次交换的是相邻的且值为不同的元素，它并不会改变值相同的元素之间的顺序，因此它是稳定的。

**三、希尔排序**

希尔排序是一个平均时间复杂度为 O(n log n) 的算法，会在下一个章节和 归并排序、快速排序、堆排序 一起讲，本文就不展开了。

### 3.3 选择排序（Selection Sort）

**思路**

选择排序算法的实现思路有点类似插入排序，也分已排序区间和未排序区间。但是选择排序每次会从未排序区间中找到最小的元素，将其放到已排序区间的末尾。

**步骤**

 1. 首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置。
 2. 再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。
 3. 重复第二步，直到所有元素均排序完毕。

**实现**

```
const selectionSort = array => {
	const len = array.length;
	let minIndex, temp;
	for (let i = 0; i < len - 1; i++) {
		minIndex = i;
		for (let j = i + 1; j < len; j++) {
			if (array[j] < array[minIndex]) {
				// 寻找最小的数
				minIndex = j; // 将最小数的索引保存
			}
		}
		temp = array[i];
		array[i] = array[minIndex];
		array[minIndex] = temp;
		console.log('array: ', array);
	}
	return array;
};
```

测试

```
// 测试
const array = [5, 4, 3, 2, 1];
console.log('原始array:', array);
selectionSort(array);
// 原始 array:  [5, 4, 3, 2, 1]
// array:  		 [1, 4, 3, 2, 5]
// array:  		 [1, 2, 3, 4, 5]
// array: 		 [1, 2, 3, 4, 5]
// array:  		 [1, 2, 3, 4, 5]
```

**分析**

- 第一，选择排序是原地排序算法吗 ？
选择排序空间复杂度为 O(1)，是一种`原地`排序算法。
- 第二，选择排序是稳定的排序算法吗 ？
选择排序每次都要找剩余未排序元素中的最小值，并和前面的元素交换位置，这样破坏了稳定性。所以，选择排序是一种`不稳定`的排序算法。
- 第三，选择排序的时间复杂度是多少 ？
无论是正序还是逆序，选择排序都会遍历 n<sup>2</sup> / 2 次来排序，所以，最佳、最差和平均的复杂度是一样的。
最佳情况：T(n) = O(n<sup>2</sup>)。
最差情况：T(n) = O(n<sup>2</sup>)。
平均情况：T(n) = O(n<sup>2</sup>)。


**动画**

![selection-sort.gif](https://upload-images.jianshu.io/upload_images/12890819-27ddfb636eabff03.gif?imageMogr2/auto-orient/strip)


### 3.4 归并排序（Merge Sort）

**思想**

排序一个数组，我们先把数组从中间分成前后两部分，然后对前后两部分分别排序，再将排好序的两部分合并在一起，这样整个数组就都有序了。

归并排序采用的是`分治思想`。

分治，顾名思义，就是分而治之，将一个大问题分解成小的子问题来解决。小的子问题解决了，大问题也就解决了。

![merge-sort-example.png](https://upload-images.jianshu.io/upload_images/12890819-a186be41b62d6f65.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 注：x >> 1 是位运算中的右移运算，表示右移一位，等同于 x 除以 2 再取整，即 x >> 1 === Math.floor(x / 2) 。

**实现**

```javascript
const mergeSort = arr => {
	//采用自上而下的递归方法
	const len = arr.length;
	if (len < 2) {
		return arr;
	}
	// length >> 1 和 Math.floor(len / 2) 等价
	let middle = Math.floor(len / 2),
		left = arr.slice(0, middle),
		right = arr.slice(middle); // 拆分为两个子数组
	return merge(mergeSort(left), mergeSort(right));
};

const merge = (left, right) => {
	const result = [];

	while (left.length && right.length) {
		// 注意: 判断的条件是小于或等于，如果只是小于，那么排序将不稳定.
		if (left[0] <= right[0]) {
			result.push(left.shift());
		} else {
			result.push(right.shift());
		}
	}

	while (left.length) result.push(left.shift());

	while (right.length) result.push(right.shift());

	return result;
};
```

**测试**

```javascript
// 测试
const arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
console.time('归并排序耗时');
console.log('arr :', mergeSort(arr));
console.timeEnd('归并排序耗时');
// arr : [2, 3, 4, 5, 15, 19, 26, 27, 36, 38, 44, 46, 47, 48, 50]
// 归并排序耗时: 0.739990234375ms
```

**分析**

- 第一，归并排序是原地排序算法吗 ？
这是因为归并排序的合并函数，在合并两个有序数组为一个有序数组时，需要借助额外的存储空间。
实际上，尽管每次合并操作都需要申请额外的内存空间，但在合并完成之后，临时开辟的内存空间就被释放掉了。在任意时刻，CPU 只会有一个函数在执行，也就只会有一个临时的内存空间在使用。临时内存空间最大也不会超过 n 个数据的大小，所以空间复杂度是 O(n)。
所以，归并排序`不是`原地排序算法。

- 第二，归并排序是稳定的排序算法吗 ？
merge 方法里面的 left[0] <= right[0] ，保证了值相同的元素，在合并前后的先后顺序不变。归并排序`是稳定`的排序方法。

- 第三，归并排序的时间复杂度是多少 ？
从效率上看，归并排序可算是排序算法中的`佼佼者`。假设数组长度为 n，那么拆分数组共需 logn 步，又每步都是一个普通的合并子数组的过程，时间复杂度为 O(n)，故其综合时间复杂度为 O(n log n)。
最佳情况：T(n) = O(n log n)。
最差情况：T(n) = O(n log n)。
平均情况：T(n) = O(n log n)。


**动画**

![merge-sort.gif](https://upload-images.jianshu.io/upload_images/12890819-32372625906df3ae.gif?imageMogr2/auto-orient/strip)


### 3.5 快速排序 （Quick Sort）

快速排序的特点就是快，而且效率高！它是处理大数据最快的排序算法之一。

**思想**

- 先找到一个基准点（一般指数组的中部），然后数组被该基准点分为两部分，依次与该基准点数据比较，如果比它小，放左边；反之，放右边。
- 左右分别用一个空数组去存储比较后的数据。
- 最后递归执行上述操作，直到数组长度 <= 1;

特点：快速，常用。

缺点：需要另外声明两个数组，浪费了内存空间资源。

**实现**

方法一：

```javascript
const quickSort1 = arr => {
	if (arr.length <= 1) {
		return arr;
	}
	//取基准点
	const midIndex = Math.floor(arr.length / 2);
	//取基准点的值，splice(index,1) 则返回的是含有被删除的元素的数组。
	const valArr = arr.splice(midIndex, 1);
	const midIndexVal = valArr[0];
	const left = []; //存放比基准点小的数组
	const right = []; //存放比基准点大的数组
	//遍历数组，进行判断分配
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] < midIndexVal) {
			left.push(arr[i]); //比基准点小的放在左边数组
		} else {
			right.push(arr[i]); //比基准点大的放在右边数组
		}
	}
	//递归执行以上操作，对左右两个数组进行操作，直到数组长度为 <= 1
	return quickSort1(left).concat(midIndexVal, quickSort1(right));
};
const array2 = [5, 4, 3, 2, 1];
console.log('quickSort1 ', quickSort1(array2));
// quickSort1: [1, 2, 3, 4, 5]
```

方法二：

```javascript
// 快速排序
const quickSort = (arr, left, right) => {
	let len = arr.length,
		partitionIndex;
	left = typeof left != 'number' ? 0 : left;
	right = typeof right != 'number' ? len - 1 : right;

	if (left < right) {
		partitionIndex = partition(arr, left, right);
		quickSort(arr, left, partitionIndex - 1);
		quickSort(arr, partitionIndex + 1, right);
	}
	return arr;
};

const partition = (arr, left, right) => {
	//分区操作
	let pivot = left, //设定基准值（pivot）
		index = pivot + 1;
	for (let i = index; i <= right; i++) {
		if (arr[i] < arr[pivot]) {
			swap(arr, i, index);
			index++;
		}
	}
	swap(arr, pivot, index - 1);
	return index - 1;
};

const swap = (arr, i, j) => {
	let temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
};
```

测试

```javascript
// 测试
const array = [5, 4, 3, 2, 1];
console.log('原始array:', array);
const newArr = quickSort(array);
console.log('newArr:', newArr);
// 原始 array:  [5, 4, 3, 2, 1]
// newArr:     [1, 4, 3, 2, 5]
```


**分析**

- 第一，快速排序是原地排序算法吗 ？
因为 partition() 函数进行分区时，不需要很多额外的内存空间，所以快排是`原地排序`算法。

- 第二，快速排序是稳定的排序算法吗 ？
和选择排序相似，快速排序每次交换的元素都有可能不是相邻的，因此它有可能打破原来值为相同的元素之间的顺序。因此，快速排序并`不稳定`。

- 第三，快速排序的时间复杂度是多少 ？
极端的例子：如果数组中的数据原来已经是有序的了，比如 1，3，5，6，8。如果我们每次选择最后一个元素作为 pivot，那每次分区得到的两个区间都是不均等的。我们需要进行大约 n 次分区操作，才能完成快排的整个过程。每次分区我们平均要扫描大约 n / 2 个元素，这种情况下，快排的时间复杂度就从 O(nlogn) 退化成了 O(n<sup>2</sup>)。
最佳情况：T(n) = O(n log n)。
最差情况：T(n) = O(n<sup>2</sup>)。
平均情况：T(n) = O(n log n)。


**动画**

![quick-sort.gif](https://upload-images.jianshu.io/upload_images/12890819-708f5b687f6bde65.gif?imageMogr2/auto-orient/strip)

**解答开篇问题**

快排和归并用的都是分治思想，递推公式和递归代码也非常相似，那它们的区别在哪里呢 ？

![快速排序与归并排序](https://upload-images.jianshu.io/upload_images/12890819-3e29b9d2d936905d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以发现：

- 归并排序的处理过程是`由下而上`的，先处理子问题，然后再合并。
- 而快排正好相反，它的处理过程是`由上而下`的，先分区，然后再处理子问题。
- 归并排序虽然是稳定的、时间复杂度为 O(nlogn) 的排序算法，但是它是非原地排序算法。
- 归并之所以是非原地排序算法，主要原因是合并函数无法在原地执行。
- 快速排序通过设计巧妙的原地分区函数，可以实现原地排序，解决了归并排序占用太多内存的问题。


### 3.6 希尔排序（Shell Sort） 

**思想**

- 先将整个待排序的记录序列分割成为若干子序列。
- 分别进行直接插入排序。
- 待整个序列中的记录基本有序时，再对全体记录进行依次直接插入排序。

**过程**

1. 举个易于理解的例子：[35, 33, 42, 10, 14, 19, 27, 44]，我们采取间隔 4。创建一个位于 4 个位置间隔的所有值的虚拟子列表。下面这些值是 { 35, 14 }，{ 33, 19 }，{ 42, 27 } 和 { 10, 44 }。

![栗子](https://upload-images.jianshu.io/upload_images/12890819-e58310e3c89561da.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. 我们比较每个子列表中的值，并在原始数组中交换它们（如果需要）。完成此步骤后，新数组应如下所示。

![栗子](https://upload-images.jianshu.io/upload_images/12890819-4d6b2b51ca3f04bd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3. 然后，我们采用 2 的间隔，这个间隙产生两个子列表：{ 14, 27, 35, 42 }， { 19, 10, 33, 44 }。

![栗子](https://upload-images.jianshu.io/upload_images/12890819-38dcc34caa3a9d2c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

4. 我们比较并交换原始数组中的值（如果需要）。完成此步骤后，数组变成：[14, 10, 27, 19, 35, 33, 42, 44]，图如下所示，10 与 19 的位置互换一下。

![image.png](https://upload-images.jianshu.io/upload_images/12890819-4fdc3019a8c4ec11.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

5. 最后，我们使用值间隔 1 对数组的其余部分进行排序，Shell sort 使用插入排序对数组进行排序。

![栗子](https://upload-images.jianshu.io/upload_images/12890819-25f5e05762daaa49.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)




**实现**

```javascript
const shellSort = arr => {
	let len = arr.length,
		temp,
		gap = 1;
	console.time('希尔排序耗时');
	while (gap < len / 3) {
		//动态定义间隔序列
		gap = gap * 3 + 1;
	}
	for (gap; gap > 0; gap = Math.floor(gap / 3)) {
		for (let i = gap; i < len; i++) {
			temp = arr[i];
			let j = i - gap;
			for (; j >= 0 && arr[j] > temp; j -= gap) {
				arr[j + gap] = arr[j];
			}
			arr[j + gap] = temp;
			console.log('arr  :', arr);
		}
	}
	console.timeEnd('希尔排序耗时');
	return arr;
};
```

测试

```javascript
// 测试
const array = [35, 33, 42, 10, 14, 19, 27, 44];
console.log('原始array:', array);
const newArr = shellSort(array);
console.log('newArr:', newArr);
// 原始 array:   [35, 33, 42, 10, 14, 19, 27, 44]
// arr      :   [14, 33, 42, 10, 35, 19, 27, 44]
// arr      :   [14, 19, 42, 10, 35, 33, 27, 44]
// arr      :   [14, 19, 27, 10, 35, 33, 42, 44]
// arr      :   [14, 19, 27, 10, 35, 33, 42, 44]
// arr      :   [14, 19, 27, 10, 35, 33, 42, 44]
// arr      :   [14, 19, 27, 10, 35, 33, 42, 44]
// arr      :   [10, 14, 19, 27, 35, 33, 42, 44]
// arr      :   [10, 14, 19, 27, 35, 33, 42, 44]
// arr      :   [10, 14, 19, 27, 33, 35, 42, 44]
// arr      :   [10, 14, 19, 27, 33, 35, 42, 44]
// arr      :   [10, 14, 19, 27, 33, 35, 42, 44]
// 希尔排序耗时: 3.592041015625ms
// newArr:     [10, 14, 19, 27, 33, 35, 42, 44]
```

**分析**

- 第一，希尔排序是原地排序算法吗 ？
希尔排序过程中，只涉及相邻数据的交换操作，只需要常量级的临时空间，空间复杂度为 O(1) 。所以，希尔排序是`原地排序`算法。

- 第二，希尔排序是稳定的排序算法吗 ？
我们知道，单次直接插入排序是稳定的，它不会改变相同元素之间的相对顺序，但在多次不同的插入排序过程中，相同的元素可能在各自的插入排序中移动，可能导致相同元素相对顺序发生变化。
因此，希尔排序`不稳定`。

- 第三，希尔排序的时间复杂度是多少 ？
最佳情况：T(n) = O(n log n)。
最差情况：T(n) = O(n log<sup>2</sup> n)。
平均情况：T(n) = O(n log<sup>2</sup> n)。


**动画**

![shell-sort.gif](https://upload-images.jianshu.io/upload_images/12890819-cdac5dafc537a06a.gif?imageMogr2/auto-orient/strip)


### 3.7 堆排序（Heap Sort）

**堆的定义**

堆其实是一种特殊的树。只要满足这两点，它就是一个堆。

- 堆是一个完全二叉树。
完全二叉树：除了最后一层，其他层的节点个数都是满的，最后一层的节点都靠左排列。
- 堆中每一个节点的值都必须大于等于（或小于等于）其子树中每个节点的值。
也可以说：堆中每个节点的值都大于等于（或者小于等于）其左右子节点的值。这两种表述是等价的。

对于每个节点的值都`大于等于`子树中每个节点值的堆，我们叫作`大顶堆`。
对于每个节点的值都`小于等于`子树中每个节点值的堆，我们叫作`小顶堆`。

![区分堆、大顶堆、小顶堆](https://upload-images.jianshu.io/upload_images/12890819-ba0004cfc2c4c8d4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


其中图 1 和 图 2 是大顶堆，图 3 是小顶堆，图 4 不是堆。除此之外，从图中还可以看出来，对于同一组数据，我们可以构建多种不同形态的堆。

**思想**

1. 将初始待排序关键字序列 (R1, R2 .... Rn) 构建成大顶堆，此堆为初始的无序区；
2. 将堆顶元素 R[1] 与最后一个元素 R[n] 交换，此时得到新的无序区 (R1, R2, ..... Rn-1) 和新的有序区 (Rn) ，且满足 R[1, 2 ... n-1] <= R[n]。
3. 由于交换后新的堆顶 R[1] 可能违反堆的性质，因此需要对当前无序区 (R1, R2 ...... Rn-1) 调整为新堆，然后再次将 R[1] 与无序区最后一个元素交换，得到新的无序区 (R1, R2 .... Rn-2) 和新的有序区 (Rn-1, Rn)。不断重复此过程，直到有序区的元素个数为 n - 1，则整个排序过程完成。


**实现**

```javascript
// 堆排序
const heapSort = array => {
	console.time('堆排序耗时');
	// 初始化大顶堆，从第一个非叶子结点开始
	for (let i = Math.floor(array.length / 2 - 1); i >= 0; i--) {
		heapify(array, i, array.length);
	}
	// 排序，每一次 for 循环找出一个当前最大值，数组长度减一
	for (let i = Math.floor(array.length - 1); i > 0; i--) {
		// 根节点与最后一个节点交换
		swap(array, 0, i);
		// 从根节点开始调整，并且最后一个结点已经为当前最大值，不需要再参与比较，所以第三个参数为 i，即比较到最后一个结点前一个即可
		heapify(array, 0, i);
	}
	console.timeEnd('堆排序耗时');
	return array;
};

// 交换两个节点
const swap = (array, i, j) => {
	let temp = array[i];
	array[i] = array[j];
	array[j] = temp;
};

// 将 i 结点以下的堆整理为大顶堆，注意这一步实现的基础实际上是：
// 假设结点 i 以下的子堆已经是一个大顶堆，heapify 函数实现的
// 功能是实际上是：找到 结点 i 在包括结点 i 的堆中的正确位置。
// 后面将写一个 for 循环，从第一个非叶子结点开始，对每一个非叶子结点
// 都执行 heapify 操作，所以就满足了结点 i 以下的子堆已经是一大顶堆
const heapify = (array, i, length) => {
	let temp = array[i]; // 当前父节点
	// j < length 的目的是对结点 i 以下的结点全部做顺序调整
	for (let j = 2 * i + 1; j < length; j = 2 * j + 1) {
		temp = array[i]; // 将 array[i] 取出，整个过程相当于找到 array[i] 应处于的位置
		if (j + 1 < length && array[j] < array[j + 1]) {
			j++; // 找到两个孩子中较大的一个，再与父节点比较
		}
		if (temp < array[j]) {
			swap(array, i, j); // 如果父节点小于子节点:交换；否则跳出
			i = j; // 交换后，temp 的下标变为 j
		} else {
			break;
		}
	}
};
```


测试

```javascript
const array = [4, 6, 8, 5, 9, 1, 2, 5, 3, 2];
console.log('原始array:', array);
const newArr = heapSort(array);
console.log('newArr:', newArr);
// 原始 array:  [4, 6, 8, 5, 9, 1, 2, 5, 3, 2]
// 堆排序耗时: 0.15087890625ms
// newArr:     [1, 2, 2, 3, 4, 5, 5, 6, 8, 9]
```

**分析**

- 第一，堆排序是原地排序算法吗 ？
整个堆排序的过程，都只需要极个别临时存储空间，所以堆排序`是`原地排序算法。
- 第二，堆排序是稳定的排序算法吗 ？
因为在排序的过程，存在将堆的最后一个节点跟堆顶节点互换的操作，所以就有可能改变值相同数据的原始相对顺序。
所以，堆排序是`不稳定`的排序算法。

- 第三，堆排序的时间复杂度是多少 ？
堆排序包括建堆和排序两个操作，建堆过程的时间复杂度是 O(n)，排序过程的时间复杂度是 O(nlogn)，所以，堆排序整体的时间复杂度是 O(nlogn)。
最佳情况：T(n) = O(n log n)。
最差情况：T(n) = O(n log n)。
平均情况：T(n) = O(n log n)。

**动画**

![heap-sort.gif](https://upload-images.jianshu.io/upload_images/12890819-62cc8c35ce449e02.gif?imageMogr2/auto-orient/strip)


![heap-sort2.gif](https://upload-images.jianshu.io/upload_images/12890819-7946ab6ef624c184.gif?imageMogr2/auto-orient/strip)

### 3.8 桶排序（Bucket Sort）

桶排序是计数排序的升级版，也采用了`分治思想`。

**思想**

- 将要排序的数据分到有限数量的几个有序的桶里。
- 每个桶里的数据再单独进行排序（一般用插入排序或者快速排序）。
- 桶内排完序之后，再把每个桶里的数据按照顺序依次取出，组成的序列就是有序的了。

比如：

![](https://upload-images.jianshu.io/upload_images/12890819-fbe2b3e3d6d56b8e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

桶排序利用了函数的映射关系，高效与否的关键就在于这个映射函数的确定。

为了使桶排序更加高效，我们需要做到这两点：
- 在额外空间充足的情况下，尽量增大桶的数量。
- 使用的映射函数能够将输入的 N 个数据均匀的分配到 K 个桶中。

桶排序的核心：就在于怎么把元素平均分配到每个桶里，合理的分配将大大提高排序的效率。



**实现**

```javascript
// 桶排序
const bucketSort = (array, bucketSize) => {
  if (array.length === 0) {
    return array;
  }

  console.time('桶排序耗时');
  let i = 0;
  let minValue = array[0];
  let maxValue = array[0];
  for (i = 1; i < array.length; i++) {
    if (array[i] < minValue) {
      minValue = array[i]; //输入数据的最小值
    } else if (array[i] > maxValue) {
      maxValue = array[i]; //输入数据的最大值
    }
  }

  //桶的初始化
  const DEFAULT_BUCKET_SIZE = 5; //设置桶的默认数量为 5
  bucketSize = bucketSize || DEFAULT_BUCKET_SIZE;
  const bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
  const buckets = new Array(bucketCount);
  for (i = 0; i < buckets.length; i++) {
    buckets[i] = [];
  }

  //利用映射函数将数据分配到各个桶中
  for (i = 0; i < array.length; i++) {
    buckets[Math.floor((array[i] - minValue) / bucketSize)].push(array[i]);
  }

  array.length = 0;
  for (i = 0; i < buckets.length; i++) {
    quickSort(buckets[i]); //对每个桶进行排序，这里使用了快速排序
    for (var j = 0; j < buckets[i].length; j++) {
      array.push(buckets[i][j]);
    }
  }
  console.timeEnd('桶排序耗时');

  return array;
};

// 快速排序
const quickSort = (arr, left, right) => {
	let len = arr.length,
		partitionIndex;
	left = typeof left != 'number' ? 0 : left;
	right = typeof right != 'number' ? len - 1 : right;

	if (left < right) {
		partitionIndex = partition(arr, left, right);
		quickSort(arr, left, partitionIndex - 1);
		quickSort(arr, partitionIndex + 1, right);
	}
	return arr;
};

const partition = (arr, left, right) => {
	//分区操作
	let pivot = left, //设定基准值（pivot）
		index = pivot + 1;
	for (let i = index; i <= right; i++) {
		if (arr[i] < arr[pivot]) {
			swap(arr, i, index);
			index++;
		}
	}
	swap(arr, pivot, index - 1);
	return index - 1;
};

const swap = (arr, i, j) => {
	let temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
};
```

**测试**

```javascript
const array = [4, 6, 8, 5, 9, 1, 2, 5, 3, 2];
console.log('原始array:', array);
const newArr = bucketSort(array);
console.log('newArr:', newArr);
// 原始 array:  [4, 6, 8, 5, 9, 1, 2, 5, 3, 2]
// 堆排序耗时:   0.133056640625ms
// newArr:  	 [1, 2, 2, 3, 4, 5, 5, 6, 8, 9]
```

**分析**

- 第一，桶排序是原地排序算法吗 ？
因为桶排序的空间复杂度，也即内存消耗为 O(n)，所以`不是`原地排序算法。

- 第二，桶排序是稳定的排序算法吗 ？
取决于每个桶的排序方式，比如：快排就不稳定，归并就稳定。

- 第三，桶排序的时间复杂度是多少 ？
因为桶内部的排序可以有多种方法，是会对桶排序的时间复杂度产生很重大的影响。所以，桶排序的时间复杂度可以是多种情况的。
`总的来说`
最佳情况：当输入的数据可以均匀的分配到每一个桶中。
最差情况：当输入的数据被分配到了同一个桶中。
以下是`桶的内部排序`为`快速排序`的情况：
如果要排序的数据有 n 个，我们把它们均匀地划分到 m 个桶内，每个桶里就有 k  =n / m 个元素。每个桶内部使用快速排序，时间复杂度为 O(k * logk)。
m 个桶排序的时间复杂度就是 O(m * k * logk)，因为 k = n / m，所以整个桶排序的时间复杂度就是 O(n*log(n/m))。
当桶的个数 m 接近数据个数 n 时，log(n/m) 就是一个非常小的常量，这个时候桶排序的时间复杂度接近 O(n)。
最佳情况：T(n) = O(n)。当输入的数据可以均匀的分配到每一个桶中。
最差情况：T(n) = O(nlogn)。当输入的数据被分配到了同一个桶中。
平均情况：T(n) = O(n)。

> 桶排序最好情况下使用线性时间 O(n)，桶排序的时间复杂度，取决与对各个桶之间数据进行排序的时间复杂度，因为其它部分的时间复杂度都为 O(n)。
> 很显然，桶划分的越小，各个桶之间的数据越少，排序所用的时间也会越少。但相应的空间消耗就会增大。

**适用场景**

- 桶排序比较适合用在外部排序中。
- 外部排序就是数据存储在外部磁盘且数据量大，但内存有限，无法将整个数据全部加载到内存中。


**动画**

![bocket-sort.gif](https://upload-images.jianshu.io/upload_images/12890819-96021a791180eba0.gif?imageMogr2/auto-orient/strip)


### 3.9 计数排序（Counting Sort）

**思想**

- 找出待排序的数组中最大和最小的元素。
- 统计数组中每个值为 i 的元素出现的次数，存入新数组 countArr 的第 i 项。
- 对所有的计数累加（从 countArr 中的第一个元素开始，每一项和前一项相加）。
- 反向填充目标数组：将每个元素 i 放在新数组的第 countArr[i] 项，每放一个元素就将 countArr[i] 减去 1 。

关键在于理解最后反向填充时的操作。

**使用条件**

- 只能用在数据范围不大的场景中，若数据范围 k 比要排序的数据 n 大很多，就不适合用计数排序。
- 计数排序只能给非负整数排序，其他类型需要在不改变相对大小情况下，转换为非负整数。
- 比如如果考试成绩精确到小数后一位，就需要将所有分数乘以 10，转换为整数。

**实现**

方法一：

```javascript
const countingSort = array => {
	let len = array.length,
		result = [],
		countArr = [],
		min = (max = array[0]);
	console.time('计数排序耗时');
	for (let i = 0; i < len; i++) {
		// 获取最小，最大 值
		min = min <= array[i] ? min : array[i];
		max = max >= array[i] ? max : array[i];
		countArr[array[i]] = countArr[array[i]] ? countArr[array[i]] + 1 : 1;
	}
	console.log('countArr :', countArr);
	// 从最小值 -> 最大值,将计数逐项相加
	for (let j = min; j < max; j++) {
		countArr[j + 1] = (countArr[j + 1] || 0) + (countArr[j] || 0);
	}
	console.log('countArr 2:', countArr);
	// countArr 中,下标为 array 数值，数据为 array 数值出现次数；反向填充数据进入 result 数据
	for (let k = len - 1; k >= 0; k--) {
		// result[位置] = array 数据
		result[countArr[array[k]] - 1] = array[k];
		// 减少 countArr 数组中保存的计数
		countArr[array[k]]--;
		// console.log("array[k]:", array[k], 'countArr[array[k]] :', countArr[array[k]],)
		console.log('result:', result);
	}
	console.timeEnd('计数排序耗时');
	return result;
};
```

测试

```javascript
const array = [2, 2, 3, 8, 7, 1, 2, 2, 2, 7, 3, 9, 8, 2, 1, 4, 2, 4, 6, 9, 2];
console.log('原始 array: ', array);
const newArr = countingSort(array);
console.log('newArr: ', newArr);
// 原始 array:  [2, 2, 3, 8, 7, 1, 2, 2, 2, 7, 3, 9, 8, 2, 1, 4, 2, 4, 6, 9, 2]
// 计数排序耗时:   5.6708984375ms
// newArr:  	 [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 6, 7, 7, 8, 8, 9, 9]
```

![测试结果](https://upload-images.jianshu.io/upload_images/12890819-f2541143bcd69138.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

方法二：

```javascript
const countingSort2 = (arr, maxValue) => {
	console.time('计数排序耗时');
	maxValue = maxValue || arr.length;
	let bucket = new Array(maxValue + 1),
		sortedIndex = 0;
	(arrLen = arr.length), (bucketLen = maxValue + 1);

	for (let i = 0; i < arrLen; i++) {
		if (!bucket[arr[i]]) {
			bucket[arr[i]] = 0;
		}
		bucket[arr[i]]++;
	}

	for (let j = 0; j < bucketLen; j++) {
		while (bucket[j] > 0) {
			arr[sortedIndex++] = j;
			bucket[j]--;
		}
	}
	console.timeEnd('计数排序耗时');
	return arr;
};
```

测试

```javascript
const array2 = [2, 2, 3, 8, 7, 1, 2, 2, 2, 7, 3, 9, 8, 2, 1, 4, 2, 4, 6, 9, 2];
console.log('原始 array2: ', array2);
const newArr2 = countingSort2(array2, 21);
console.log('newArr2: ', newArr2);
// 原始 array:  [2, 2, 3, 8, 7, 1, 2, 2, 2, 7, 3, 9, 8, 2, 1, 4, 2, 4, 6, 9, 2]
// 计数排序耗时:   0.043212890625ms
// newArr:  	 [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 6, 7, 7, 8, 8, 9, 9]
```

**例子**

可以认为，**计数排序其实是桶排序的一种特殊情况**。

当要排序的 n 个数据，所处的范围并不大的时候，比如最大值是 k，我们就可以把数据划分成 k 个桶。每个桶内的数据值都是相同的，省掉了桶内排序的时间。

我们都经历过高考，高考查分数系统你还记得吗？我们查分数的时候，系统会显示我们的成绩以及所在省的排名。如果你所在的省有 50 万考生，如何通过成绩快速排序得出名次呢？

- 考生的满分是 900 分，最小是 0 分，这个数据的范围很小，所以我们可以分成 901 个桶，对应分数从 0 分到 900 分。
- 根据考生的成绩，我们将这 50 万考生划分到这 901 个桶里。桶内的数据都是分数相同的考生，所以并不需要再进行排序。
- 我们只需要依次扫描每个桶，将桶内的考生依次输出到一个数组中，就实现了 50 万考生的排序。
- 因为只涉及扫描遍历操作，所以时间复杂度是 O(n)。

**分析**

- 第一，计数排序是原地排序算法吗 ？
因为计数排序的空间复杂度为 O(k)，k 桶的个数，所以不是原地排序算法。 
- 第二，计数排序是稳定的排序算法吗 ？
计数排序不改变相同元素之间原本相对的顺序，因此它是稳定的排序算法。
- 第三，计数排序的时间复杂度是多少 ？
最佳情况：T(n) = O(n + k)
最差情况：T(n) = O(n + k)
平均情况：T(n) = O(n + k)
k 是待排序列最大值。



**动画**

![counting-sort.gif](https://upload-images.jianshu.io/upload_images/12890819-43b26f260d905c77.gif?imageMogr2/auto-orient/strip)


### 3.10 基数排序（Radix Sort）

**思想**

基数排序是一种非比较型整数排序算法，其原理是将整数按位数切割成不同的数字，然后按每个位数分别比较。

**例子**

假设我们有 10 万个手机号码，希望将这 10 万个手机号码从小到大排序，你有什么比较快速的排序方法呢 ？

这个问题里有这样的规律：假设要比较两个手机号码 a，b 的大小，如果在前面几位中，a 手机号码已经比 b 手机号码大了，那后面的几位就不用看了。所以是基于`位`来比较的。

桶排序、计数排序能派上用场吗 ？手机号码有 11 位，范围太大，显然不适合用这两种排序算法。针对这个排序问题，有没有时间复杂度是 O(n) 的算法呢 ？ 有，就是基数排序。


**使用条件**

- 要求数据可以分割独立的`位`来比较；
- 位之间由递进关系，如果 a 数据的高位比 b 数据大，那么剩下的地位就不用比较了；
- 每一位的数据范围不能太大，要可以用线性排序，否则基数排序的时间复杂度无法做到 O(n)。

**方案**

按照优先从高位或低位来排序有两种实现方案:

- MSD：由高位为基底，先按 k1 排序分组，同一组中记录, 关键码 k1 相等，再对各组按 k2 排序分成子组, 之后，对后面的关键码继续这样的排序分组，直到按最次位关键码 kd 对各子组排序后，再将各组连接起来，便得到一个有序序列。MSD 方式适用于位数多的序列。
- LSD：由低位为基底，先从 kd 开始排序，再对 kd - 1 进行排序，依次重复，直到对 k1 排序后便得到一个有序序列。LSD 方式适用于位数少的序列。


**实现**

```javascript
/**
	* name: 基数排序
	* @param  array 待排序数组
	* @param  max 最大位数
	*/
const radixSort = (array, max) => {
	console.time('计数排序耗时');
	const buckets = [];
	let unit = 10,
		base = 1;
	for (let i = 0; i < max; i++, base *= 10, unit *= 10) {
		for (let j = 0; j < array.length; j++) {
			let index = ~~((array[j] % unit) / base); //依次过滤出个位，十位等等数字
			if (buckets[index] == null) {
				buckets[index] = []; //初始化桶
			}
			buckets[index].push(array[j]); //往不同桶里添加数据
		}
		let pos = 0,
			value;
		for (let j = 0, length = buckets.length; j < length; j++) {
			if (buckets[j] != null) {
				while ((value = buckets[j].shift()) != null) {
					array[pos++] = value; //将不同桶里数据挨个捞出来，为下一轮高位排序做准备，由于靠近桶底的元素排名靠前，因此从桶底先捞
				}
			}
		}
	}
	console.timeEnd('计数排序耗时');
	return array;
};
```

测试

```javascript
const array = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
console.log('原始array:', array);
const newArr = radixSort(array, 2);
console.log('newArr:', newArr);
// 原始 array:  [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48]
// 堆排序耗时:   0.064208984375ms
// newArr:  	 [2, 3, 4, 5, 15, 19, 26, 27, 36, 38, 44, 46, 47, 48, 50]
```


**分析**

- 第一，基数排序是原地排序算法吗 ？
因为计数排序的空间复杂度为 O(n + k)，所以不是原地排序算法。 

- 第二，基数排序是稳定的排序算法吗 ？
基数排序不改变相同元素之间的相对顺序，因此它是稳定的排序算法。

- 第三，基数排序的时间复杂度是多少 ？
最佳情况：T(n) = O(n * k)
最差情况：T(n) = O(n * k)
平均情况：T(n) = O(n * k)
其中，k 是待排序列最大值。


**动画**

LSD 基数排序动图演示：

![radixSort.gif](https://upload-images.jianshu.io/upload_images/12890819-aff01ef4a1e19f74.gif?imageMogr2/auto-orient/strip)

## 4. 复杂度对比

十大经典排序算法的 **时间复杂度与空间复杂度** 比较。

| 名称 | 平均  | 最好 | 最坏 | 空间 | 稳定性 | 排序方式 |
|  :------: |  :------: |  :------: |  :------: |  :------: |  :------: |  :------: |
| 冒泡排序 | O(n<sup>2</sup>)  | O(n) | O(n<sup>2</sup>) | O(1) | Yes | In-place |
| 插入排序 | O(n<sup>2</sup>)  | O(n) | O(n<sup>2</sup>) | O(1) | Yes | In-place |
| 选择排序 | O(n<sup>2</sup>) | O(n<sup>2</sup>) | O(n<sup>2</sup>) | O(1) | No | In-place | 
| 归并排序 | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes | Out-place |
| 快速排序 | O(n log n) | O(n log n) | O(n<sup>2</sup>) | O(logn) | No | In-place |
| 希尔排序 | O(n log n) | O(n log<sup>2</sup> n) | O(n log<sup>2</sup> n) | O(1) | No | In-place | 
| 堆排序 | O(n log n) | O(n log n) | O(n log n) | O(1) | No | In-place | 
| 桶排序 | O(n + k) | O(n + k) | O(n<sup>2</sup>) | O(n + k) | Yes | Out-place | 
| 计数排序 | O(n + k) | O(n + k) | O(n + k) | O(k) | Yes | Out-place | 
| 基数排序 | O(n * k) | O(n * k) | O(n * k) | O(n + k) | Yes | Out-place | 

名词解释： 
- n：数据规模；
- k：桶的个数；
- In-place: 占用常数内存，不占用额外内存； 
- Out-place: 占用额外内存。


## 5. 算法可视化工具

- 算法可视化工具 [algorithm-visualizer](https://github.com/algorithm-visualizer/algorithm-visualizer) 
 算法可视化工具 algorithm-visualizer 是一个交互式的在线平台，可以从代码中可视化算法，还可以看到代码执行的过程。旨在通过交互式可视化的执行来揭示算法背后的机制。
效果如下图：
![算法可视化工具](https://upload-images.jianshu.io/upload_images/12890819-0af779615ee7fc27.gif?imageMogr2/auto-orient/strip)


- 算法可视化动画网站 [https://visualgo.net/en](https://visualgo.net/en)
效果如下图：
![quick-sort.gif](https://upload-images.jianshu.io/upload_images/12890819-661bf75741df7c9a.gif?imageMogr2/auto-orient/strip)

- 算法可视化动画网站 [www.ee.ryerson.ca](https://www.ee.ryerson.ca/~courses/coe428/sorting/insertionsort.html)
效果如下图：
![insert-sort.gif](https://upload-images.jianshu.io/upload_images/12890819-2453edc1c19e14b8.gif?imageMogr2/auto-orient/strip)


- [illustrated-algorithms](https://github.com/skidding/illustrated-algorithms)
变量和操作的可视化表示增强了控制流和实际源代码。您可以快速前进和后退执行，以密切观察算法的工作方式。
效果如下图：
![binary-search.gif](https://upload-images.jianshu.io/upload_images/12890819-22bd05d89a89af8c.gif?imageMogr2/auto-orient/strip)


## 6. 系列文章

**JavaScript 数据结构与算法之美** 系列文章，暂时写了如下的 11 篇文章，后续还有想写的内容，再补充。

所写的内容只是数据结构与算法内容的冰山一角，如果你还想学更多的内容，推荐学习王争老师的 [数据结构与算法之美](https://time.geekbang.org/column/intro/126)。

从时间和空间复杂度、基础数据结构到排序算法，文章的内容有一定的关联性，所以阅读时推荐按顺序来阅读，效果更佳。



- [1. JavaScript 数据结构与算法之美 - 时间和空间复杂度](https://github.com/biaochenxuying/blog/issues/29)
- [2. JavaScript 数据结构与算法之美 - 线性表（数组、队列、栈、链表）](https://github.com/biaochenxuying/blog/issues/34)
- [3. JavaScript 数据结构与算法之美 - 实现一个前端路由，如何实现浏览器的前进与后退 ？](https://github.com/biaochenxuying/blog/issues/30)
- [4. JavaScript 数据结构与算法之美 - 栈内存与堆内存 、浅拷贝与深拷贝](https://github.com/biaochenxuying/blog/issues/35)
- [5. JavaScript 数据结构与算法之美 - 递归](https://github.com/biaochenxuying/blog/issues/36)
- [6. JavaScript 数据结构与算法之美 - 非线性表（树、堆）](https://github.com/biaochenxuying/blog/issues/37)
- [7. JavaScript 数据结构与算法之美 - 冒泡排序、选择排序、插入排序](https://github.com/biaochenxuying/blog/issues/39)
- [8. JavaScript 数据结构与算法之美 - 归并排序、快速排序、希尔排序、堆排序](https://github.com/biaochenxuying/blog/issues/40)
- [9. JavaScript 数据结构与算法之美 - 计数排序、桶排序、基数排序](https://github.com/biaochenxuying/blog/issues/41) 
- [10. JavaScript 数据结构与算法之美 - 十大经典排序算法汇总](https://github.com/biaochenxuying/blog/issues/42) 
- [11. JavaScript 数据结构与算法之美 - 强烈推荐 GitHub 上值得前端学习的数据结构与算法项目](https://github.com/biaochenxuying/blog/issues/43)

> 如果有错误或者不严谨的地方，请务必给予指正，以免误人子弟，十分感谢。

## 7. 最后

文中所有的代码及测试事例都已经放到我的 [GitHub](https://github.com/biaochenxuying/blog/tree/master/data-structure-and-algorithms) 上了。

笔者为了写好这系列的文章，花费了大量的业余时间，边学边写，边写边修改，前后历时差不多 2 个月，入门级的文章总算是写完了。

如果你觉得有用或者喜欢，就点收藏，顺便点个赞吧，你的支持是我最大的鼓励 ！
 
<comment/> 
 