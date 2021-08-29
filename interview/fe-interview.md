![前端硬核面试专题](https://upload-images.jianshu.io/upload_images/12890819-143da2ac64b67a73.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


# 目录

- [目录](#目录)
  - [1. 前言](#1-前言)
  - [2. HTML](#2-html)
  - [3. CSS](#3-css)
  - [4. JavaScript](#4-javascript)
      - [js 经典面试知识文章](#js-经典面试知识文章)
  - [5. ES6 +](#5-es6-)
      - [ES6+ 面试知识文章](#es6-面试知识文章)
  - [6. webpack](#6-webpack)
  - [7. Vue](#7-vue)
      - [Vue 相关图解](#vue-相关图解)
      - [Vue 经典面试相关文章](#vue-经典面试相关文章)
  - [8. React](#8-react)
  - [9. Node](#9-node)
  - [10. HTTPS](#10-https)
  - [11. 数据结构与算法](#11-数据结构与算法)
      - [JavaScript 数据结构](#javascript-数据结构)
      - [十大经典排序算法](#十大经典排序算法)
  - [12. Git](#12-git)
  - [13. 最后](#13-最后)


## 1. 前言

本文面试的内容包含：HTML + CSS + JS + ES6 + Webpack + Vue  + React + Node + HTTPS + 数据结构与算法 + Git 。

> 复习前端面试的知识，是为了巩固前端的基础知识，最重要的还是平时的积累！

`注意`：文章的题与题之间用下划线分隔开，**答案仅供参考**。

笔者技术博客首发地址  [GitHub](https://github.com/biaochenxuying/blog)，欢迎关注。

## 2. HTML

**为什么利用多个域名来存储网站资源会更有效 ？**

[利用多个域名来存储网站资源](https://www.jianshu.com/p/4cf3b6d6b50a)

- 确保用户在不同地区能用最快的速度打开网站，其中某个域名崩溃用户也能通过其他域名访问网站。
- CDN 缓存更方便。简单来说，CDN 主要用来使用户就近获取资源。
- 突破浏览器并发限制。同一时间针对同一域名下的请求有一定数量限制，超过限制数目的请求会被阻塞。大多数浏览器的并发数量都控制在6以内。有些资源的请求时间很长，因而会阻塞其他资源的请求。因此，对于一些静态资源，如果放到不同的域名下面就能实现与其他资源的并发请求。
- Cookieless, 节省带宽，尤其是上行带宽 一般比下行要慢。
- 对于 UGC 的内容和主站隔离，防止不必要的安全问题。
- 数据做了划分，甚至切到了不同的物理集群，通过子域名来分流比较省事.  这个可能被用的不多。

---

**window 常用属性与方法有哪些 ？**

window 对象的常用属性

- window.self 返回当前窗口的引用
- window.parent   返回当前窗体的父窗体对象
- window.top 返回当前窗体最顶层的父窗体的引用
- window.outerwidth       返回当前窗口的外部宽
- window.outerheight  返回当前窗口的外部高
- window.innerwidth       返回当前窗口的可显示区域宽
- window.innerheight  返回当前窗口的可显示区域高
 
提示：通过直接在 Chrome 控制台中输入 console.log(window) 可以查看到其所有的被当前浏览器支持的属性及值。

window 对象的常用方法

- window.prompt()   弹出一个输入提示框，若用户点击了“取消”则返回 null
- window.alert()    弹出一个警告框
- window.confirm()  弹出一个确认框
- window.close()  关闭当前浏览器窗口。 有些浏览器对此方法有限制。
- window.open(uri, [name], [features])  打开一个浏览器窗口，显示指定的网页。name 属性值可以是“_blank”、“_self”、“_parent”、“_top”、任意指定的一个窗口名。
- window.blur( )    指定当前窗口失去焦点
- window.focus( ) 指定当前窗口获得焦点
- window.showModalDialog(uri, [dataFromParent])  打开一个“模态窗口”（打开的子窗口只要不关闭，其父窗口即无法获得焦点；且父子窗口间可以传递数据）

---

**document 常用属性与方法有哪些 ？**

document 常见的属性

- body 提供对 <body> 元素的直接访问。对于定义了框架集的文档，该属性引用最外层的 <frameset>。
- cookie 设置或返回与当前文档有关的所有 cookie。
- domain 返回当前文档的域名。
- lastModified 返回文档被最后修改的日期和时间。
- referrer 返回载入当前文档的文档的 URL。
- title 返回当前文档的标题。
- URL 返回当前文档的 URL。

document常见的方法

- write()：动态向页面写入内容
- createElement(Tag)：创建一个 HTML 标签对象
- getElementById(ID)：获得指定 id 的对象
- getElementsByName(Name)：获得之前 Name 的对象
- body.appendChild(oTag)：向 HTML 中插入元素对象

---


**简述一下 src 与 href 的区别**

- href 是指向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的链接，用于超链接。
- src 是指向外部资源的位置，指向的内容将会嵌入到文档中当前标签所在位置；
- 在请求 src 资源时会将其指向的资源下载并应用到文档内，例如 js 脚本，img 图片和 frame 等元素。
当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，图片和框架等元素也如此，类似于将所指向资源嵌入当前标签内。这也是为什么将 js 脚本放在底部而不是头部。

---

**写一个 div + css 布局，左边图片，右边文字，文字环绕图片，外面容器固定宽度，文字不固定。**

直接就一个 img，它 float：left，加文字加 p 标签就好了。

---

**html 中 title 属性和 alt 属性的区别 ？**

1. alt
   
```html
<img src="#" alt="alt 信息" />
```

当图片不输出信息的时候，会显示 alt 信息， 鼠标放上去没有信息。
当图片正常读取，不会出现 alt 信息。

1. title

```html
<img src="#" alt="alt 信息" title="title 信息" />
```
 
当图片不输出信息的时候，会显示 alt 信息，鼠标放上去会出现 title 信息。
当图片正常输出的时候，不会出现 alt 信息，鼠标放上去会出现 title 信息。

---

**讲述你对 reflow 和 repaint 的理解。**

repaint 就是重绘，reflow 就是回流。

严重性： 在性能优先的前提下，性能消耗 reflow 大于 repaint。

体现：repaint 是某个 DOM 元素进行重绘；reflow 是整个页面进行重排，也就是页面所有 DOM 元素渲染。

如何触发： style 变动造成 repaint 和 reflow。

1. 不涉及任何 DOM 元素的排版问题的变动为 repaint，例如元素的 color/text-align/text-decoration 等等属性的变动。
2. 除上面所提到的 DOM 元素 style 的修改基本为 reflow。例如元素的任何涉及 长、宽、行高、边框、display 等 style 的修改。

常见触发场景

触发 repaint：

- color 的修改，如 color=#ddd；
- text-align 的修改，如 text-align=center；
- a:hover 也会造成重绘。
- :hover 引起的颜色等不导致页面回流的 style 变动。

触发 reflow：

- width/height/border/margin/padding 的修改，如 width=778px；
- 动画，:hover 等伪类引起的元素表现改动，display=none 等造成页面回流；
- appendChild 等 DOM 元素操作；
- font 类 style 的修改；
- background 的修改，注意着字面上可能以为是重绘，但是浏览器确实回流了，经过浏览器厂家的优化，部分 background 的修改只触发 repaint，当然 IE 不用考虑；
- scroll 页面，这个不可避免；
- resize 页面，桌面版本的进行浏览器大小的缩放，移动端的话，还没玩过能拖动程序，resize 程序窗口大小的多窗口操作系统。
- 读取元素的属性（这个无法理解，但是技术达人是这么说的，那就把它当做定理吧）：读取元素的某些属性（offsetLeft、offsetTop、offsetHeight、offsetWidth、scrollTop/Left/Width/Height、clientTop/Left/Width/Height、getComputedStyle()、currentStyle(in IE))；

如何避免： 

- 尽可能在 DOM 末梢通过改变 class 来修改元素的 style 属性：尽可能的减少受影响的 DOM 元素。
- 避免设置多项内联样式：使用常用的 class 的方式进行设置样式，以避免设置样式时访问 DOM 的低效率。
- 设置动画元素 position 属性为 fixed 或者 absolute：由于当前元素从 DOM 流中独立出来，因此受影响的只有当前元素，元素 repaint。
- 牺牲平滑度满足性能：动画精度太强，会造成更多次的 repaint/reflow，牺牲精度，能满足性能的损耗，获取性能和平滑度的平衡。
- 避免使用 table 进行布局：table 的每个元素的大小以及内容的改动，都会导致整个 table 进行重新计算，造成大幅度的 repaint 或者 reflow。改用 div 则可以进行针对性的 repaint 和避免不必要的 reflow。
- 避免在 CSS 中使用运算式：学习 CSS 的时候就知道，这个应该避免，不应该加深到这一层再去了解，因为这个的后果确实非常严重，一旦存在动画性的 repaint/reflow，那么每一帧动画都会进行计算，性能消耗不容小觑。


参考文章：[你真的了解回流和重绘吗](https://segmentfault.com/a/1190000017329980)

---

- [我终于理解了伪类和伪元素](https://www.jianshu.com/p/996d021bced3)


---

**Doctype 作用 ？标准模式与兼容模式各有什么区别 ?**

- <!DOCTYPE> 声明位于位于 HTML 文档中的第一行，处于 <html> 标签之前。告知浏览器的解析器用什么文档标准解析这个文档。DOCTYPE 不存在或格式不正确会导致文档以兼容模式呈现。
- 标准模式的排版和 JS 运作模式都是以该浏览器支持的最高标准运行。在兼容模式中，页面以宽松的向后兼容的方式显示，模拟老式浏览器的行为以防止站点无法工作。

---

**HTML5 为什么只需要写 < !DOCTYPE HTML> ？**

HTML5 不基于 SGML(标准通用标记语言（以下简称“通用标言”)，因此不需要对 DTD 进行引用，但是需要 doctype 来规范浏览器的行为（让浏览器按照它们应该的方式来运行）；
而 HTML4.01 基于 SGML，所以需要对 DTD 进行引用，才能告知浏览器文档所使用的文档类型。

---

**行内元素有哪些 ？块级元素有哪些 ？ 空(void)元素有那些 ？**

CSS 规范规定，每个元素都有 display 属性，确定该元素的类型，每个元素都有默认的 display 值。
如 div 的 display 默认值为 “block”，则为“块级”元素；
span 默认 display 属性值为 “inline”，是“行内”元素。

- 行内元素有：a b span img input select strong（强调的语气）
- 块级元素有：div ul ol li dl dt dd h1 h2 h3 h4  p
- 常见的空元素： img input link meta br hr ，鲜为人知的是：area base col command embed keygen param source track wbr

---

**HTML5 有哪些新特性、移除了那些元素 ？如何处理 HTML5 新标签的浏览器兼容问题 ？如何区分 HTML 和 HTML5 ？**

HTML5 现在已经不是 SGML（标准通用标记语言）的子集，主要是关于图像，位置，存储，多任务等功能的增加。

新特性

- 绘画 canvas;
- 用于媒介回放的 video 和 audio 元素;
- 本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失;
- sessionStorage 的数据在浏览器关闭后自动删除;
- 语意化更好的内容元素，比如 article、footer、header、nav、section;
- 表单控件：calendar、date、time、email、url、search;
- 新的技术：webworker, websocket, Geolocation;

移除的元素

- 纯表现的元素：basefont，big，center，font, s，strike，tt，u;  
- 对可用性产生负面影响的元素：frame，frameset，noframes；

支持 HTML5 新标签

- IE8/IE7/IE6 支持通过 document.createElement 方法产生的标签，可以利用这一特性让这些浏览器支持 HTML5 新标签，浏览器支持新标签后，还需要添加标签默认的样式。
- 当然也可以直接使用成熟的框架、比如 html5shim;
```html
<!--[if lt IE 9]>
<script> src="http://html5shim.googlecode.com/svn/trunk/html5.js"</script>
<![endif]-->
```

---

**简述一下你对 HTML 语义化的理解 ？**

- 1、用正确的标签做正确的事情。
- 2、html 语义化让页面的内容结构化，结构更清晰，
- 3、便于对浏览器、搜索引擎解析;
- 4、即使在没有样式 CSS 情况下也以一种文档格式显示，并且是容易阅读的;
- 5、搜索引擎的爬虫也依赖于 HTML 标记来确定上下文和各个关键字的权重，利于 SEO;
- 6、使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。

---

**HTML5 的离线储存怎么使用，工作原理能不能解释一下 ？**

在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓存文件。

原理

HTML5 的离线存储是基于一个新建的 .appcache 文件的缓存机制(不是存储技术)，通过这个文件上的解析清单离线存储资源，这些资源就会像 cookie 一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示。

如何使用

- 1、页面头部像下面一样加入一个 manifest 的属性；
- 2、在 cache.manifest 文件的编写离线存储的资源；
```json
CACHE MANIFEST
#v0.11
CACHE:
js/app.js
css/style.css
NETWORK:
resourse/logo.png
FALLBACK:
//offline.html
```

- 3、在离线状态时，操作 window.applicationCache 进行需求实现。

---

**浏览器是怎么对 HTML5 的离线储存资源进行管理和加载的呢 ？**

在线的情况下，浏览器发现 html 头部有 manifest 属性，它会请求 manifest 文件，如果是第一次访问 app，那么浏览器就会根据 manifest 文件的内容下载相应的资源并且进行离线存储。

如果已经访问过 app 并且资源已经离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的 manifest 文件与旧的 manifest 文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储。

离线的情况下，浏览器就直接使用离线存储的资源。

--- 

**请描述一下 cookies，sessionStorage 和 localStorage 的区别 ？**

- cookie 是网站为了标示用户身份而储存在用户本地终端（Client Side）上的数据（通常经过加密）。
- cookie 数据始终在同源的 http 请求中携带（即使不需要），也会在浏览器和服务器间来回传递。
- sessionStorage 和 localStorage 不会自动把数据发给服务器，仅在本地保存。

存储大小

- cookie 数据大小不能超过 4k。
- sessionStorage 和 localStorage 虽然也有存储大小的限制，但比 cookie 大得多，可以达到 5M 或更大。

有期时间

- localStorage 存储持久数据，浏览器关闭后数据不丢失除非主动删除数据；
- sessionStorage 数据在当前浏览器窗口关闭后自动删除。
- cookie  设置的 cookie 过期时间之前一直有效，即使窗口或浏览器关闭。

---

**iframe 内嵌框架有那些缺点 ？**

内联框架 iframe一般用来包含别的页面，例如 我们可以在我们自己的网站页面加载别人网站的内容，为了更好的效果，可能需要使 iframe 透明效果；

- iframe 会阻塞主页面的 onload 事件；
- 搜索引擎的检索程序无法解读这种页面，不利于 SEO 搜索引擎优化（Search Engine Optimization）
- iframe 和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载。

如果需要使用 iframe，最好是通过 javascript 动态给 iframe 添加 src 属性值，这样可以绕开以上两个问题。

---

**Label 的作用是什么？是怎么用的 ？**

label 标签来定义表单控制间的关系，当用户选择该标签时，浏览器会自动将焦点转到和标签相关的表单控件上。
```html
<label for="Name">Number:</label>
<input type=“text“ name="Name"  id="Name"/>

<label>Date:<input type="text" name="B"/></label>
```

---

**HTML5 的 form 如何关闭自动完成功能 ？**

给不想要提示的 form 或某个 input 设置为 autocomplete=off。

---

**如何实现浏览器内多个标签页之间的通信 ? (阿里)**

- WebSocket、SharedWorker；
- 也可以调用 localstorge、cookies 等本地存储方式；
- localstorge 在另一个浏览上下文里被添加、修改或删除时，它都会触发一个事件，我们通过监听事件，控制它的值来进行页面信息通信；
注意 quirks：Safari 在无痕模式下设置 localstorge 值时会抛出 QuotaExceededError 的异常；

---

**webSocket 如何兼容低浏览器 ？(阿里)**

- Adobe Flash Socket 、
- ActiveX HTMLFile (IE) 、
- 基于 multipart 编码发送 XHR 、
- 基于长轮询的 XHR。

---

**页面可见性（Page Visibility API） 可以有哪些用途 ？**

- 通过 visibilityState 的值检测页面当前是否可见，以及打开网页的时间等;
- 在页面被切换到其他后台进程的时候，自动暂停音乐或视频的播放；

---


**网页验证码是干嘛的，是为了解决什么安全问题。**

- 区分用户是计算机还是人的公共全自动程序；
- 可以防止恶意破解密码、刷票、论坛灌水；
- 有效防止黑客对某一个特定注册用户用特定程序暴力破解方式进行不断的登陆尝试。

---

**title 与 h1 的区别、b 与 strong 的区别、i 与 em 的区别 ？**

- title 属性没有明确意义只表示是个标题，H1 则表示层次明确的标题，对页面信息的抓取也有很大的影响；
- strong 是标明重点内容，有语气加强的含义，使用阅读设备阅读网络时：`strong 会重读，而 b 是展示强调内容`。
- i 内容展示为斜体，em 表示强调的文本；

- Physical Style Elements -- 自然样式标签：b, i, u, s, pre
- Semantic Style Elements -- 语义样式标签：strong, em, ins, del, code
- 应该准确使用语义样式标签, 但不能滥用, 如果不能确定时，首选使用自然样式标签。

---


**谈谈以前端的角度出发，做好 SEO ，需要考虑什么 ？**

- 了解搜索引擎如何抓取网页和如何索引网页。
你需要知道一些搜索引擎的基本工作原理，各个搜索引擎之间的区别，搜索机器人（SE robot 或叫 web cra何进行工作，搜索引擎如何对搜索结果进行排序等等。
- Meta 标签优化
主要包括主题（Title)，网站描述(Description)，和关键词（Keywords）。还有一些其它的隐藏文字比如 Au 者），Category（目录），Language（编码语种）等。
- 如何选取关键词并在网页中放置关键词。
搜索就得用关键词。关键词分析和选择是 SEO 最重要的工作之一。首先要给网站确定主关键词（一般在 5 个上后针对这些关键词进行优化，包括关键词密度（Density），相关度（Relavancy），突出性（Prominency）等等。
- 了解主要的搜索引擎。
虽然搜索引擎有很多，但是对网站流量起决定作用的就那么几个。比如英文的主要有 Google，Yahoo，Bing 等有百度，搜狗，有道等。
不同的搜索引擎对页面的抓取和索引、排序的规则都不一样。
还要了解各搜索门户和搜索的关系，比如 AOL 网页搜索用的是 Google 的搜索技术，MSN 用的是 Bing 的技术。
- 主要的互联网目录。
Open Directory 自身不是搜索引擎，而是一个大型的网站目录，他和搜索引擎的主要区别是网站内容的收集方目录是人工编辑的，主要收录网站主页；搜索引擎是自动收集的，除了主页外还抓取大量的内容页面。
- 按点击付费的搜索引擎。
搜索引擎也需要生存，随着互联网商务的越来越成熟，收费的搜索引擎也开始大行其道。最典型的有 Overture 当然也包括 Google 的广告项目 Google Adwords。越来越多的人通过搜索引擎的点击广告来定位商业网站，这里面化和排名的学问，你得学会用最少的广告投入获得最多的点击。
- 搜索引擎登录。
网站做完了以后，别躺在那里等着客人从天而降。要让别人找到你，最简单的办法就是将网站提交（submit）擎。如果你的是商业网站，主要的搜索引擎和目录都会要求你付费来获得收录（比如 Yahoo 要 299 美元），但是好消少到目前为止）最大的搜索引擎 Google 目前还是免费，而且它主宰着 60％ 以上的搜索市场。
- 链接交换和链接广泛度（Link Popularity）。
网页内容都是以超文本（Hypertext）的方式来互相链接的，网站之间也是如此。除了搜索引擎以外，人们也不同网站之间的链接来 Surfing（“冲浪”）。其它网站到你的网站的链接越多，你也就会获得更多的访问量。更重你的网站的外部链接数越多，会被搜索引擎认为它的重要性越大，从而给你更高的排名。
- 标签的合理使用。

---

**前端页面有哪三层构成，分别是什么？作用是什么？**

网页分成三个层次，即：结构层、表示层、行为层。

- 网页的结构层（structurallayer）由 HTML 或 XHTML 之类的标记语言负责创建。
标签，也就是那些出现在尖括号里的单词，对网页内容的语义含义做出这些标签不包含任何关于如何显示有关内容的信息。例如，P 标签表达了这样一种语义：“这是一个文本段。”
- 网页的表示层（presentationlayer）由 CSS 负责创建。CSS 对“如何显示有关内容”的问题做出了回答。
- 网页的行为层（behaviorlayer）负责回答 “内容应该如何对事件做出反应” 这一问题。
这是 Javascript 语言和 DOM 主宰的领域。

---



**有这么一段 HTML，请挑毛病**

<P> 哥写的不是HTML，是寂寞。< br>< br> 我说：< br>不要迷恋哥，哥只是一个传说

答案：缺少 p 标记的结束标记。

---

[⬆️ 返回顶部](#目录)

## 3. CSS

**盒子模型的理解 ?**

- 标准模式和混杂模式（IE）。
- 在标准模式下浏览器按照规范呈现页面；
- 在混杂模式下，页面以一种比较宽松的向后兼容的方式显示。
- 混杂模式通常模拟老式浏览器的行为以防止老站点无法工作。

![](https://upload-images.jianshu.io/upload_images/12890819-b9c3230377a2a0d2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/12890819-f0e6a3f07947a2e0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


CSS 盒子模型具有内容 (content)、填充 (padding)、边框 (border)、边界 (margin)这些属性。

我们所说的 width，height 指的是内容 (content) 的宽高。

一个盒子模型的中：

- 宽度 = width+ pdding(宽) + border(宽)。
- 高度 = height + padding(高) + border(高)。

---

**如何在页面上实现一个圆形的可点击区域 ？**

- 1、map+area 或者 svg
- 2、border-radius
- 3、纯 js 实现，需要求一个点在不在圆上简单算法、获取鼠标坐标等等

---

**实现不使用 border 画出 1px 高的线，在不同浏览器的标准模式与怪异模式下都能保持一致的效果。**

```html
<div style="height:1px;overflow:hidden;background:red"></div>
```

---

**CSS 中哪些属性可以同父元素继承 ?**

继承：(X)HTML 元素可以从其父元素那里继承部分 CSS 属性，即使当前元素并没有定义该属性，比如： color，font-size。

---


**box-sizing 常用的属性有哪些 ？分别有什么作用 ？**

常用的属性：box-sizing: content-box border-box inherit;

作用

content-box(默认)：宽度和高度分别应用到元素的内容框。在宽度和高度之外绘制元素的内边距和边框(元素默认效果)。
border-box：元素指定的任何内边距和边框都将在已设定的宽度和高度内进行绘制。通过从已设定的宽度和高度分别减去边框和内边距才能得到内容的宽度和高度。

---

**页面导入样式时，使用 link 和 @import 有什么区别 ？**

- link 属于 XHTML 标签，除了加载 CSS 外，还能用于定义 RSS(是一种描述和同步网站内容的格式，是使用最广泛的 XML 应用), 定义 rel 连接属性等作用；
- 而 @import 是 CSS 提供的，只能用于加载 CSS;
- 页面被加载的时，link 会同时被加载，而 @import 引用的 CSS 会等到页面被加载完再加载;
- import 是 CSS2.1 提出的，只在 IE5 以上才能被识别，而 link 是 XHTML 标签，无兼容问题。
- 总之，link 要优于 @import。

---

**常见兼容性问题？**

- 浏览器默认的 margin 和 padding 不同。解决方案是加一个全局的 *{margin: 0; padding: 0;} 来统一。
- IE下 event 对象有 event.x，event.y 属性，而 Firefox 下没有。Firefox 下有 event.pageX，event.PageY 属性，而 IE 下没有。
解决办法：var mx = event.x?event.x:event.pageX;

- Chrome 中文界面下默认会将小于 12px 的文本强制按照 12px 显示, 可通过加入 CSS 属性 -webkit-text-size-adjust: none; 解决.

- 超链接访问过后 hover 样式就不出现了，被点击访问过的超链接样式不在具有 hover 和 active 了，解决方法是改变 CSS 属性的排列顺序:
L-V-H-A : a:link {} a:visited {} a:hover {} a:active {}

---

**清除浮动，什么时候需要清除浮动，清除浮动都有哪些方法 ？**

一个块级元素如果没有设置 height，那么其高度就是由里面的子元素撑开，如果子元素使用浮动，脱离了标准的文档流，那么父元素的高度会将其忽略，如果不清除浮动，父元素会出现高度不够，那样如果设置 border 或者 background 都得不到正确的解析。

正是因为浮动的这种特性，导致本属于普通流中的元素浮动之后，包含框内部由于不存在其他普通流元素了，也就表现出高度为 0（`高度塌陷`）。在实际布局中，往往这并不是我们所希望的，所以需要闭合浮动元素，使其包含框表现出正常的高度。

清除浮动的方式

- 父级 div 定义 height，原理：父级 div 手动定义 height，就解决了父级 div 无法自动获取到高度的问题。 
- 结尾处加空 div 标签 clear: both，原理：添加一个空 div，利用 css 提高的 clear: both 清除浮动，让父级 div 能自动获取到高度。
- 父级 div 定义 overflow: hidden，  原理：必须定义 width 或 zoom: 1，同时不能定义 height，使用 overflow: hidden 时，浏览器会自动检查浮动区域的高度。 
- 父级 div 也一起浮动 。
- 父级 div 定义 display: table 。
- 父级 div 定义 伪类 :after 和 zoom 。
- 结尾处加 br 标签 clear: both， 原理：父级 div 定义 zoom: 1 来解决 IE 浮动问题，结尾处加 br 标签 clear: both。

总结：比较好的是倒数第 2 种方式，简洁方便。

---

**如何保持浮层水平垂直居中 ？**

一、水平居中 

（1）行内元素解决方案

只需要把行内元素包裹在一个属性 display 为 block 的父层元素中，并且把父层元素添加如下属性即可。

```css
.parent {
    text-align: center;
}
```

（2）块状元素解决方案
 
```css
.item {
    /* 这里可以设置顶端外边距 */
    margin: 10px auto;
}
```
（3）多个块状元素解决方案将元素的 display 属性设置为 inline-block，并且把父元素的 text-align 属性设置为 center 即可:
```css
.parent {
    text-align:center;
}
```
（4）多个块状元素解决方案

使用 flexbox 布局，只需要把待处理的块状元素的父元素添加属性 display: flex 及 justify-content: center 即可。

```css
.parent {
    display: flex;
    justify-content: center;
}
```

二、垂直居中

（1）单行的行内元素解决方案

```css
.parent {
    background: #222;
    height: 200px;
}

/* 以下代码中，将 a 元素的 height 和 line-height 设置的和父元素一样高度即可实现垂直居中 */
a {
    height: 200px;
    line-height:200px; 
    color: #FFF;
}
```

（2）多行的行内元素解决方案组合

使用 display: table-cell 和 vertical-align: middle 属性来定义需要居中的元素的父容器元素生成效果，如下：
```
.parent {
    background: #222;
    width: 300px;
    height: 300px;
    /* 以下属性垂直居中 */
    display: table-cell;
    vertical-align: middle;
}
```
（3）已知高度的块状元素解决方案

```css 
.item{
    position: absolute;
    top: 50%;
    margin-top: -50px;  /* margin-top值为自身高度的一半 */
    padding:0;
}
```

三、水平垂直居中

（1）已知高度和宽度的元素解决方案 1

这是一种不常见的居中方法，可自适应，比方案 2 更智能，如下：
```css
.item{
    position: absolute;
    margin:auto;
    left:0;
    top:0;
    right:0;
    bottom:0;
}
```
（2）已知高度和宽度的元素解决方案 2

```css
.item{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -75px;  /* 设置margin-left / margin-top 为自身高度的一半 */
    margin-left: -75px;
}
```

（3）未知高度和宽度元素解决方案

```css
.item{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);  /* 使用 css3 的 transform 来实现 */
}
```

（4）使用 flex 布局实现

```css
.parent{
    display: flex;
    justify-content: center;
    align-items: center;
    /* 注意这里需要设置高度来查看垂直居中效果 */
    background: #AAA;
    height: 300px;
}
```

---

**position 、float 和 display 的取值和各自的意思和用法**

position

- position 属性取值：static(默认)、relative、absolute、fixed、inherit、sticky。
- postision：static；始终处于文档流给予的位置。看起来好像没有用，但它可以快速取消定位，让 top，right，bottom，left 的值失效。在切换的时候可以尝试这个方法。
- 除了 static 值，在其他三个值的设置下，z-index 才会起作用。确切地说 z-index 只在定位元素上有效。
- position：relative 和 absolute 都可以用于定位，区别在于前者的 div 还属于正常的文档流，后者已经是脱离了正常文档流，不占据空间位置，不会将父类撑开。
定位原点 relative 是相对于它在正常流中的默认位置偏移，它原本占据的空间任然保留；absolute 相对于第一个 position 属性值不为 static 的父类。所以设置了 position：absolute，其父类的该属性值要注意，而且 overflow：hidden 也不能乱设置，因为不属于正常文档流，不会占据父类的高度，也就不会有滚动条。
- fixed 旧版本 IE 不支持，却是很有用，定位原点相对于浏览器窗口，而且不能变。
常用于 header，footer 或者一些固定的悬浮 div，随滚动条滚动又稳定又流畅，比 JS 好多了。fixed 可以有很多创造性的布局和作用，兼容性是问题。
- position：inherit。
规定从父类继承 position 属性的值，所以这个属性也是有继承性的，但需要注意的是 IE8 以及往前的版本都不支持 inherit 属性。
- sticky ：设置了sticky 的元素，在屏幕范围（viewport）时该元素的位置并不受到定位影响（设置是 top、left 等属性无效），当该元素的位置将要移出偏移范围时，定位又会变成 fixed，根据设置的 left、top 等属性成固定位置的效果。
  
float

- float：left (或 right)，向左（或右）浮动，直到它的边缘碰到包含框或另一个浮动框为止。
且脱离普通的文档流，会被正常文档流内的块框忽略。不占据空间，无法将父类元素撑开。
- 任何元素都可以浮动，浮动元素会生成一个块级框，不论它本身是何种元素。因此，没有必要为浮动元素设置 display：block。
- 如果浮动非替换元素，则要指定一个明确的 width，否则它们会尽可能的窄。
什么叫替换元素 ？根据元素本身的特点定义的， (X)HTML中的 img、input、textarea、select、object 都是替换元素，这些元素都没有实际的内容。 (X)HTML 的大多数元素是不可替换元素，他们将内容直接告诉浏览器，将其显示出来。

display

- display 属性取值：none、inline、inline-block、block、table 相关属性值、inherit。
- display 属性规定元素应该生成的框的类型。文档内任何元素都是框，块框或行内框。
- display：none 和 visiability：hidden 都可以隐藏 div，区别有点像 absolute 和 relative，前者不占据文档的空间，后者还是占据文档的位置。
- display：inline 和 block，又叫行内元素和块级元素。
表现出来的区别就是 block 独占一行，在浏览器中通常垂直布局，可以用 margin 来控制块级元素之间的间距（存在 margin 合并的问题，只有普通文档流中块框的垂直外边距才会发生外边距合并。行内框、浮动框或绝对定位之间的外边距不会合并。）；
而 inline 以水平方式布局，垂直方向的 margin 和 padding 都是无效的，大小跟内容一样，且无法设置宽高。
inline 就像塑料袋，内容怎么样，就长得怎么样；block 就像盒子，有固定的宽和高。
- inline-block 就介于两者之间。
- table 相关的属性值可以用来垂直居中，效果一般。
- flex

定位机制

上面三个属性都属于 CSS 定位属性。CSS 三种基本的定位机制：普通流、浮动、绝对定位。

---


**css3 动画效果属性有哪些 ?**

- animation-name：规定需要绑定到选择器的 keyframe 名称。。
- animation-duration：规定完成动画所花费的时间，以秒或毫秒计。
- animation-timing-function：规定动画的速度曲线。
- animation-delay：规定在动画开始之前的延迟。
- animation-iteration-count：规定动画应该播放的次数。
- animation-direction：规定是否应该轮流反向播放动画。

---



**会不会用 ps 扣图，png、jpg、gif 这些图片格式解释一下，分别什么时候用。如何优化图像、图像格式的区别 ?**

JPG 的特性

- 支持摄影图像或写实图像的高级压缩，并且可利用压缩比例控制图像文件大小。
- 有损压缩会使图像数据质量下降，并且在编辑和重新保存 JPG 格式图像时，这种下降损失会累积。
- JPG 不适用于所含颜色很少、具有大块颜色相近的区域或亮度差异十分明显的较简单的图片。

PNG 的特性

- 能在保证最不失真的情况下尽可能压缩图像文件的大小。
- PNG 用来存储灰度图像时，灰度图像的深度可多到 16 位，存储彩色图像时，彩色图像的深度可多到 48 位，并且还可存储多到 16 位的 α 通道数据。
- 对于需要高保真的较复杂的图像，PNG 虽然能无损压缩，但图片文件较大，不适合应用在 Web 页面上。
- 另外还有一个原则就是用于页面结构的基本视觉元素，**如容器的背景、按钮、导航的背景等应该尽量用 PNG 格式进行存储，这样才能更好的保证设计品质**。而其他一些内容元素，**如广告 Banner、商品图片 等对质量要求不是特别苛刻的，则可以用 JPG 去进行存储从而降低文件大小**。

GIF格式特点
 
- 透明性: Gif 是一种布尔透明类型，既它可以是全透明，也可以是全不透明，但是它并没有半透明（alpha 透明）。 
- 动画：Gif 这种格式支持动画。 
- 无损耗性：Gif 是一种无损耗的图像格式，这也意味着你可以对 gif 图片做任何操作也不会使得图像质量产生损耗。 
- 水平扫描：Gif 是使用了一种叫作 LZW 的算法进行压缩的，当压缩 gif 的过程中，像素是由上到下水平压缩的，这也意味着同等条件下，横向的 gif 图片比竖向的 gif 图片更加小。
例如 500*10 的图片比 10*500 的图片更加小。
间隔渐进显示：Gif 支持可选择性的间隔渐进显示。 

由以上特点看出只有 256 种颜色的 gif 图片不适合作为照片，它适合做对颜色要求不高的图形。

---

**我们知道可以以外链的方式引入 CSS 文件，请谈谈外链引入 CSS 有哪些方式，这些方式的性能有区别吗 ？**

CSS 的引入方式最常用的有三种

第一：外链式

这种方法可以说是现在占统治地位的引入方法。

如同 IE 与浏览器。这也是最能体现 CSS 特点的方法；

最能体现 DIV+CSS 中的内容离的思想，也最易改版维护，代码看起来也是最美观的一种。

第二：内部样式表

这种方法的使用情况要少的多，最长见得就是访问量大的门户网站。或者访问量较大的企业网站的首页。

与第一种方法比起来，优弊端也明显。

优点：速度快，所有的 CSS 控制都是针对本页面标签的，没有多余的 CSS 命令；再者不用外链 CSS 文件。直接在文档中读取样式。

缺点：就是改版麻烦些，单个页面显得臃肿，CSS 不能被其他 HTML 引用造成代码量相对较多，维护也麻烦些采用这种方法的公司大多有钱，对他们来说用户量是关键，他们不缺人进行复杂的维护工作。

第三：行内样式

认为 HTML 里不能出现 CSS 命令。其实有时候没有什么大不了。比如通用性差，效果特殊，使用 CSS 命令较少，并且不常改动的地方，使用这种方法反而是很好的选择。

第四、@import 引入方式

```css
<style type="text/css">
@import url(my.css);
</style>
```

---

**CSS Sprite 是什么，谈谈这个技术的优缺点。**

加速的关键，不是降低重量，而是减少个数。传统切图讲究精细，图片规格越小越好，重量越小越好，其实规格大小无计算机统一都按 byte 计算。客户端每显示一张图片都会向服务器发送请求。所以，图片越多请求次数越多，造成延迟的可越大。

- 利用 CSS Sprites 能很好地减少了网页的 http 请求，从而大大的提高了页面的性能，这也是CSS Sprites 的优点，也是其被广泛传播和应用的主要原因；
- CSS Sprites 能减少图片的字节，曾经比较过多次 3 张图片合并成 1 张图片的字节总是小于这 3 张图片的和。
- 解决了网页设计师在图片命名上的困扰，只需对一张集合的图片上命名就可以了，不需要对每一个小元素名，从而提高了网页的制作效率。
- 更换风格方便，只需要在一张或少张图片上修改图片的颜色或样式，整个网页的风格就可以改变。维护起方便。

诚然 CSS Sprites 是如此的强大，但是也存在一些不可忽视的缺点，如下：

- 在图片合并的时候，你要把多张图片有序的合理的合并成一张图片，还要留好足够的空间，防止板块内不不必要的背景；这些还好，最痛苦的是在宽屏，高分辨率的屏幕下的自适应页面，你的图片如果不够宽，很容背景断裂；
- CSS Sprites 在开发的时候比较麻烦，你要通过 photoshop 或其他工具测量计算每一个背景单元的精确位是针线活，没什么难度，但是很繁琐；
- CSS Sprites 在维护的时候比较麻烦，如果页面背景有少许改动，一般就要改这张合并的图片，无需改的好不要动，这样避免改动更多的 css，如果在原来的地方放不下，又只能（最好）往下加图片，这样图片的字加了，还要改动 css。

CSS Sprites 非常值得学习和应用，特别是页面有一堆 ico（图标）。总之很多时候大家要权衡一下再决定是不是应用 CSS Sprites。

---

**以 CSS3 标准定义一个 webkit 内核浏览器识别的圆角（尺寸随意）**

```css
-moz-border-radius: 10px; 
-webkit-border-radius: 10px;
 border-radius: 10px;。
```

---

**优先级算法如何计算？内联和 important 哪个优先级高 ？**

- 优先级就近原则，样式定义最近者为准
- 载入样式以最后载入的定位为准
- 优先级为 !important > [ id > class > tag ]
- !mportant 比内联优先级高

---

**css 的基本语句构成是 ？**

回答：选择器、属性和属性值。

---

**如果让你来制作一个访问量很高的大型网站，你会如何来管理所有 CSS 文件、JS 与图片？**

回答：涉及到人手、分工、同步；

- 先期团队必须确定好全局样式（globe.css），编码模式 (utf-8) 等
- 编写习惯必须一致（例如都是采用继承式的写法，单样式都写成一行）；
- 标注样式编写人，各模块都及时标注（标注关键样式调用的地方）；
- 页面进行标注（例如页面模块开始和结束）；
- CSS 跟 HTML 分文件夹并行存放，命名都得统一（例如 style.css）
- JS 分文件夹存放，命名以该 JS 功能为准
- 图片采用整合的 png8 格式文件使用，尽量整合在一起使用，方便将来的管理。

---

**CSS 选择符有哪些 ？哪些属性可以继承 ？优先级算法如何计算 ？新增伪类有那些 ？**

CSS 选择符

1. id选择器（ # myid）
2. 类选择器（.myclassname）
3. 标签选择器（div, h1, p）
4. 相邻选择器（h1 + p）
5. 子选择器（ul > li）
6. 后代选择器（li a）
7. 通配符选择器（ * ）
8. 属性选择器（a[rel = "external"]）
9. 伪类选择器（a: hover, li: nth - child）

可继承的样式

font-size，font-family，color，ul，li，dl，dd，dt；

不可继承的样式

border padding margin width height
事实上，宽度也不是继承的，而是如果你不指定宽度，那么它就是 100%。由于你子 DIV 并没有指定宽度，那它就是 100%，也就是与父 DIV 同宽，但这与继承无关，高度自然也没有继承一说。

优先级算法

优先级就近原则，同权重情况下样式定义最近者为准;
载入样式以最后载入的定位为准;
优先级为: !important > id > class > tag , important 比 内联优先级高

---

**CSS3 新增伪类举例**

- :root 选择文档的根元素，等同于 html 元素
- :empty 选择没有子元素的元素
- :target 选取当前活动的目标元素
- :not(selector) 选择除 selector 元素以外的元素
- :enabled 选择可用的表单元素
- :disabled 选择禁用的表单元素
- :checked 选择被选中的表单元素
- :after 选择器在被选元素的内容后面插入内容
- :before 选择器在被选元素的内容前面插入内容
- :nth-child(n) 匹配父元素下指定子元素，在所有子元素中排序第 n
- :nth-last-child(n) 匹配父元素下指定子元素，在所有子元素中排序第 n，从后向前数
- :nth-child(odd) 奇数
- :nth-child(even) 偶数
- :nth-child(3n+1)
- :first-child
- :last-child
- :only-child
- :nth-of-type(n) 匹配父元素下指定子元素，在同类子元素中排序第 n
- :nth-last-of-type(n) 匹配父元素下指定子元素，在同类子元素中排序第 n，从后向前数
- :nth-of-type(odd)
- :nth-of-type(even)
- :nth-of-type(3n+1)
- :first-of-type
- :last-of-type
- :only-of-type
- ::selection 选择被用户选取的元素部分
- :first-line 选择元素中的第一行
- :first-letter 选择元素中的第一个字符

---

**CSS3 有哪些新特性 ?**

- CSS3 实现圆角（border-radius:8px）
- 阴影（box-shadow:10px）
- 对文字加特效（text-shadow） 
- 线性渐变（gradient） 
- 旋转、缩放、定位、倾斜 
```css
 transform: rotate(9deg) scale(0.85,0.90) translate(0px,-30px) skew(-9deg,0deg); 
```
- 增加了更多的 CSS 选择器 
- 多背景 rgba

---

**一个满屏 品字布局 如何设计 ？**

第一种方式

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>满屏品字布局</title>
    <style type="text/css">
        *{
            margin: 0;
            padding: 0;
        }
        html,body{
            height: 100%;/*此设置非常关键，因为默认的 body，HTML 高度为 0，所以后面设置的 div 的高度无法用百分比显示*/
        }       
        .header{
            height:50%; /*此步结合 html,body 高度为 100%，解决元素相对窗口的定位问题*/
            width: 50%;     
            background: #ccc;           
            margin:0 auto;
        }
        .main{
            width: 100%;
            height: 50%;
            background: #ddd;
        }
        .main .left,.main .right{
            float: left;/*采用 float 方式，对元素进行左右定位*/
            width:50%;/*此步解决元素相对窗口的定位问题*/
            height:100%;/*此步解决元素相对窗口的定位问题*/
            background: yellow;
        }
        .main .right{
            background: green;
        }
    </style>
</head>
<body>
<div class="header"></div>
<div class="main">
    <div class="left"></div>
    <div class="right"></div>
</div>
</body>
</html>
```

效果如下： 

![](https://upload-images.jianshu.io/upload_images/12890819-14fd939f04b7ce27.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

---

**为什么要初始化 CSS 样式 ?**

因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对 CSS 初始化往往会出现浏览器之间的页面显示差异。
初始化样式会对 SEO 有一定的影响，但鱼和熊掌不可兼得，但力求影响最小的情况下初始化。

初始化 CSS 样式例子

```css
html,
body {
  padding: 0; 
  margin: 0;
} 
...
```

---

**请解释一下CSS3 的 Flexbox（弹性盒布局模型），以及适用场景 ？**

http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html

任何一个容器都可以指定为 Flex 布局，行内元素也可以使用 Flex 布局。

注意：设为 Flex 布局以后，子元素的 float、clear 和 vertical-align 属性将失效。

---

**flex 布局最常用的是什么场景 ？**

一般实现垂直居中是一件很麻烦的事，但 flex 布局轻松解决。

```css
.demo {
  display: flex;            
  justify-content: center;                    
  align-items: center;
}
```

---

**用纯 CSS 创建一个三角形的原理是什么？**

把上、左、右三条边隐藏掉（颜色设为 transparent）

```css
#demo {
 width: 0;
 height: 0;
 border-width: 20px;
 border-style: solid;
 border-color: transparent transparent red transparent;
}
```
---

**absolute 的 containing block(容器块) 计算方式跟正常流有什么不同 ？**

无论属于哪种，都要先找到其祖先元素中最近的 position 值不为 static 的元素，然后再判断：

- 若此元素为 inline 元素，则 containing block 为能够包含这个元素生成的第一个和最后一个 inline box 的 padding box (除 margin, border 外的区域) 的最小矩形；
- 否则，则由这个祖先元素的 padding box 构成。
- 如果都找不到，则为 initial containing block。

补充：

1. static / relative：简单说就是它的父元素的内容框（即去掉 padding 的部分）
2. absolute: 向上找最近的定位为 absolute / relative 的元素
3. fixed: 它的 containing block 一律为根元素(html / body)，根元素也是 initialcontaining block
 
---

**对 BFC 规范(块级格式化上下文：blockformatting context)的理解 ？**

W3C CSS 2.1 规范中的一个概念，它是一个独立容器，决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用。

- 一个页面是由很多个 Box 组成的，元素的类型和 display 属性，决定了这个 Box 的类型。
- 不同类型的 Box，会参与不同的 Formatting Context（决定如何渲染文档的容器），因此 Box 内的元素会以不同的方式渲染，也就是说 BFC 内部的元素和外部的元素不会互相影响。

---

**用 position: absolute 跟用 float 有什么区别吗 ？**

- 都是脱离标准流，只是 position: absolute 定位用的时候，位置可以给的更精确(想放哪就放哪)，而 float 用的更简洁，向右，左，两个方向浮动，用起来就一句代码。
- 还有就是 position: absolute 不管在哪个标签里，都可以定位到任意位置，毕竟 top，left，bottom，right 都可以给正值或负值；
- float 只是向左或向右浮动，不如 position: absolute 灵活，浮动后再想改变位置就要加各种 margin，padding 之类的通过间距的改变来改变位置，我自身觉得这样的话用起来不方便，也不太好。
- 但在菜单栏，或者一些图标的横向排列时，用起来特别方便，一个 float 就解决了，而且每个元素之间不会有任何间距(所以可以用 float 消除元素间的距离)；

---


**canvas 与 svg 的区别 ？**

- Canvas 是基于像素的即时模式图形系统，最适合较小的表面或较大数量的对象，Canvas 不支持鼠标键盘等事件。
- SVG 是基于形状的保留模式图形系统，更加适合较大的表面或较小数量的对象。
- Canvas 和 SVG 在修改方式上还存在着不同。绘制 Canvas 对象后，不能使用脚本和 CSS 对它进行修改。因为 SVG 对象是文档对象模型的一部分，所以可以随时使用脚本和 CSS 修改它们。

现在对两种技术做对比归纳如下：

Canvas

1) 依赖分辨率
2) 不支持事件处理器
3) 弱的文本渲染能力
4) 能够以 .png 或 .jpg 格式保存结果图像
5) 最适合图像密集型的游戏，其中的许多对象会被频繁重绘

SVG

1) 不依赖分辨率
2) 支持事件处理器
3) 最适合带有大型渲染区域的应用程序（比如谷歌地图）
4) 复杂度高会减慢渲染速度（任何过度使用 DOM 的应用都不快）
5) 不适合游戏应用

---

**svg 与 canvas 的区别 ？**

- svg 绘制出来的每一个图形的元素都是独立的 DOM 节点，能够方便的绑定事件或用来修改，而 canvas 输出的是一整幅画布；
- svg 输出的图形是矢量图形，后期可以修改参数来自由放大缩小，不会是真和锯齿。而 canvas 输出标量画布，就像一张图片一样，放大会失真或者锯齿。

---

**何时应当时用 padding 和 margin ？**

何时应当使用 margin

- 需要在 border 外侧添加空白时。
- 空白处不需要背景（色）时。
- 上下相连的两个盒子之间的空白，需要相互抵消时。
如 15px + 20px 的 margin，将得到 20px 的空白。

何时应当使用 padding

- 需要在 border 内测添加空白时。
- 空白处需要背景（色）时。
- 上下相连的两个盒子之间的空白，希望等于两者之和时。
如 15px + 20px 的 padding，将得到 35px 的空白。

个人认为：`margin 是用来隔开元素与元素的间距；padding 是用来隔开元素与内容的间隔，让内容（文字）与（包裹）元素之间有一段 呼吸距离`。

---

**文字在超出长度时，如何实现用省略号代替 ? 超长长度的文字在省略显示后，如何在鼠标悬停时，以悬浮框的形式显示出全部信息 ?**

注意：设置 width，overflow: hidden, white-space: nowrap (规定段落中的文本不进行换行), text-overflow: ellipsis，四个属性缺一不可。这种写法在所有的浏览器中都能正常显示。


---

**CSS 里的 visibility 属性有个 collapse 属性值 ？在不同浏览器下有什么区别 ？**

collapse

- 当在表格元素中使用时，此值可删除一行或一列，但是它不会影响表格的布局，被行或列占据的空间会留给其他内容使用。
- 如果此值被用在其他的元素上，会呈现为 hidden。
- 当一个元素的 visibility 属性被设置成 collapse 值后，对于一般的元素，它的表现跟 hidden 是一样的。

- chrome中，使用 collapse 值和使用 hidden 没有区别。
- firefox，opera 和 IE，使用 collapse 值和使用 display：none 没有什么区别。

---

**position 跟 display、overflow、float 这些特性相互叠加后会怎么样 ？**

- display 属性规定元素应该生成的框的类型；
- position 属性规定元素的定位类型；
- float 属性是一种布局方式，定义元素在哪个方向浮动。
- 类似于优先级机制：position：absolute / fixed 优先级最高，有他们在时，float 不起作用，display 值需要调整。float 或者 absolute 定位的元素，只能是块元素或表格。


---

**对 BFC 规范(块级格式化上下文：block formatting context) 的理解 ？**

BFC 规定了内部的 Block Box 如何布局。

定位方案：

- 内部的 Box 会在垂直方向上一个接一个放置。
- Box 垂直方向的距离由 margin 决定，属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠。
- 每个元素的 margin box 的左边，与包含块 border box 的左边相接触。
- BFC 的区域不会与 float box 重叠。
- BFC 是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。

计算 BFC 的高度时，浮动元素也会参与计算。

满足下列条件之一就可触发 BFC：

- 1、根元素，即 html
- 2、float 的值不为 none（默认）
- 3、overflow 的值不为 visible（默认）
- 4、display 的值为 inline-block、table-cell、table-caption
- 5、position 的值为 absolute 或 fixed


---

**浏览器是怎样解析 CSS 选择器的 ？**

- CSS 选择器的解析是从右向左解析的。
- 若从左向右的匹配，发现不符合规则，需要进行回溯，会损失很多性能。
- 若从右向左匹配，先找到所有的最右节点，对于每一个节点，向上寻找其父节点直到找到根元素或满足条件的匹配规则，则结束这个分支的遍历。
- 两种匹配规则的性能差别很大，是因为从右向左的匹配在第一步就筛选掉了大量的不符合条件的最右节点（叶子节点），而从左向右的匹配规则的性能都浪费在了失败的查找上面。
- 而在 CSS 解析完毕后，需要将解析的结果与 DOM Tree 的内容一起进行分析建立一棵 Render Tree，最终用来进行绘图。
- 在建立 Render Tree 时（WebKit 中的「Attachment」过程），浏览器就要为每个 DOM Tree 中的元素根据 CSS 的解析结果（Style Rules）来确定生成怎样的 Render Tree。


---

**元素竖向的百分比设定是相对于容器的高度吗 ？**

当按百分比设定一个元素的宽度时，它是相对于父容器的宽度计算的。

---

**全屏滚动的原理是什么 ？用到了 CSS 的哪些属性 ？**

原理

- 有点类似于轮播，整体的元素一直排列下去，假设有 5  个需要展示的全屏页面，那么高度是 500%，只是展示 100%，剩下的可以通过 transform 进行 y 轴定位，也可以通过 margin-top 实现。
- overflow：hidden；transition：all 1000ms ease；

---

**什么是响应式设计 ？响应式设计的基本原理是什么 ？如何兼容低版本的 IE ？**


- 响应式网站设计( Responsive Web design ) 是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本。
- 基本原理是通过媒体查询检测不同的设备屏幕尺寸做处理。
- 页面头部必须有 meta 声明的 viewport。

```html
<meta name="viewport" content="” width="device-width" initial-scale="1" maximum-scale="1" user-scalable="no"/>
```

---

**视差滚动效果 ？**

视差滚动（Parallax Scrolling）通过在网页向下滚动的时候，`控制背景的移动速度比前景的移动速度慢`来创建出令人惊叹的 3D 效果。

- CSS3 实现。
优点：开发时间短、性能和开发效率比较好，缺点是不能兼容到低版本的浏览器
- jQuery 实现。
通过控制不同层滚动速度，计算每一层的时间，控制滚动效果。优点：能兼容到各个版本的，效果可控性好。缺点：开发起来对制作者要求高。
- 插件实现方式。
例如：parallax-scrolling，兼容性十分好。

---

**::before 和 :after 中双冒号和单冒号有什么区别 ？解释一下这 2 个伪元素的作用**

- 单冒号 (:) 用于 CSS3 伪类，双冒号 (::) 用于 CSS3 伪元素。
- ::before 就是以一个子元素的存在，定义在元素主体内容之前的一个伪元素。并不存在于 dom 之中，只存在在页面之中。

:before 和 :after 这两个伪元素，是在 CSS2.1 里新出现的。
起初，伪元素的前缀使用的是单冒号语法，但随着 Web 的进化，在 CSS3 的规范里，伪元素的语法被修改成使用双冒号，成为 ::before、 ::after 。

---

**怎么让 Chrome 支持小于 12px 的文字 ？**

```css
p {
  font-size: 10px;
  -webkit-transform: scale(0.8);  // 0.8 是缩放比例
} 
```

---

**让页面里的字体变清晰，变细用 CSS 怎么做 ？**

-webkit-font-smoothing 在 window 系统下没有起作用，但是在 IOS 设备上起作用 -webkit-font-smoothing：antialiased 是最佳的，灰度平滑。

---

**如果需要手动写动画，你认为最小时间间隔是多久，为什么 ？**

多数显示器默认频率是 60Hz，即 1 秒刷新 60 次，所以理论上最小间隔为：1/60＊1000ms ＝ 16.7ms。

---

**有一个高度自适应的 div，里面有两个 div，一个高度 100px，如何让另一个填满剩下的高度 ？**

- 外层 div 使用 position：relative；
- 高度要求自适应的 div 使用 position: absolute; top: 100px; bottom: 0; left: 0

---

**style 标签写在 body 后与 body 前有什么区别？**

页面加载自上而下，当然是先加载样式。

写在 body 标签后，由于浏览器以逐行方式对 HTML 文档进行解析，当解析到写在尾部的样式表（外联或写在style标签）会导致浏览器停止之前的渲染，等待加载且解析样式表完成之后重新渲染，在 windows 的 IE 下可能会出现 FOUC 现象（即样式失效导致的页面闪烁问题）

---

**阐述一下CSS Sprites**

将一个页面涉及到的所有图片都包含到一张大图中去，然后利用 CSS 的 background-image，background-repeat，background-position 的组合进行背景定位。

利用 CSS Sprites 能很好地减少网页的 http 请求，从而大大的提高页面的性能；
CSS Sprites 能减少图片的字节。

---

**用 css 实现左侧宽度自适应，右侧固定宽度 ？**

1、标准浏览器的方法

当然，以不折腾人为标准的 w3c 标准早就为我们提供了制作这种自适应宽度的标准方法。

- 把 container 设为 display: table 并指定宽度 100%；
- 然后把 main + sidebar 设为 display: table-cell; 
- 然后只给 sidebar 指定一个宽度，那么 main 的宽度就变成自适应了。

代码很少，而且不会有额外标签。不过这是 IE7 及以下都无效的方法。

```css
.container {
    display: table;
    width: 100%;
}
.main {
    display: table-cell;
}
.sidebar {
    display: table-cell;
    width: 300px;
}
```

![](https://upload-images.jianshu.io/upload_images/12890819-ce4324bfc2c4f839.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



2、固定区域浮动，自适应区域不设置宽度但设置 margin

```css
.container {
    overflow: hidden;
    *zoom: 1;
}
.sidebar {
    float: right;
    width: 300px;
    background: #333;
}
.main {
    margin-right: 320px;
    background: #666;
}
.footer {
    margin-top: 20px;
    background: #ccc;
}
```

其中，sidebar 让它浮动，并设置了一个宽度；而 main 没有设置宽度。

大家要注意 html 中必须使用 div 标签，不要妄图使用什么 p 标签来达到目的。因为 div 有个默认属性，即如果不设置宽度，那它会自动填满它的父标签的宽度。这里的 main 就是例子。

当然我们不能让它填满了，填满了它就不能和 sidebar 保持同一行了。我们给它设置一个 margin。由于 sidebar 在右边，所以我们设置 main 的 margin-right 值，值比 sidebar 的宽度大一点点——以便区分它们的范围，例子中是 320。

假设 main 的默认宽度是 100%，那么它设置了 margin 后，它的宽度就变成了 100% - 320，此时 main 发现自己的宽度可以与 sidebar 挤在同一行了，于是它就上来了。 
而宽度 100% 是相对于它的父标签来的，如果我们改变了它父标签的宽度，那 main 的宽度也就会变——比如我们把浏览器窗口缩小，那 container  的宽度就会变小，而 main 的宽度也就变小，但它的实际宽度 100% - 320 始终是不会变的。

这个方法看起来很完美，只要我们记得清除浮动(这里我用了最简单的方法)，那 footer 也不会错位。而且无论 main 和 sidebar 谁更长，都不会对布局造成影响。

但实际上这个方法有个很老火的限制——html 中 sidebar 必须在 main 之前！
但我需要 sidebar 在 main 之后！因为我的 main 里面才是网页的主要内容，我不想主要内容反而排在次要内容后面。
但如果 sidebar 在 main 之后，那上面的一切都会化为泡影。


![](https://upload-images.jianshu.io/upload_images/12890819-47c872107fcc93aa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



3、固定区域使用定位，自适应区域不设置宽度，但设置 margin

```css
.container {
    position: relative;
}
.sidebar {
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    background: #333;
}
.main {
    margin-right: 320px;
    background: #666;
}
```

![](https://upload-images.jianshu.io/upload_images/12890819-767262ae18002121.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


咦，好像不对，footer 怎么还是在那儿呢？怎么没有自动往下走呢？footer 说——我不给绝对主义者让位！
其实这与 footer 无关，而是因为 container 对 sidebar 的无视造成的——你再长，我还是没感觉。
看来这种定位方式只能满足 sidebar 自己，但对它的兄弟们却毫无益处。

4、左边浮动，右边 overflow: hidden;

```css
*{margin:0; padding: 0;}
html,body{
   height: 100%;/*高度百分百显示*/
}
#left{
    width: 300px;
    height: 100%;
    background-color: #ccc;
    float: left;
}
#right{
    height: 100%;
    overflow: hidden;
    background-color: #eee;
}
```

这个方法，我利用的是创建一个新的 BFC（块级格式化上下文）来防止文字环绕的原理来实现的。

BFC 就是一个相对独立的布局环境，它内部元素的布局不受外面布局的影响。
它可以通过以下任何一种方式来创建： 

- float 的值不为 none 
- position 的值不为 static 或者 relative 
- display 的值为 table-cell , table-caption , inline-block , flex , 或者 inline-flex 中的其中一个 
- overflow 的值不为 visible

关于 BFC，在 w3c 里是这样描述的：在 BFC 中，每个盒子的左外边框紧挨着 包含块 的 左边框 （从右到左的格式化时，则为右边框紧挨）。
即使在浮动里也是这样的（尽管一个包含块的边框会因为浮动而萎缩），除非这个包含块的内部创建了一个新的 BFC。
这样，当我们给右侧的元素单独创建一个 BFC 时，它将不会紧贴在包含块的左边框，而是紧贴在左元素的右边框。

---

**问：浮动的原理和工作方式，会产生什么影响呢，要怎么处理 ？**

工作方式：浮动元素脱离文档流，不占据空间。浮动元素碰到包含它的边框或者浮动元素的边框停留。

影响

- 浮动会导致父元素无法被撑开，影响与父元素同级的元素。
- 与该浮动元素同级的非浮动元素，如果是块级元素，会移动到该元素下方，而块级元素内部的行内元素会环绕浮动元素；而如果是内联元素则会环绕该浮动元素。
- 与该元素同级的浮动元素，对于同一方向的浮动元素(同级)，两个元素将会跟在碰到的浮动元素后；而对于不同方向的浮动元素，在宽度足够时，将分别浮动向不同方向，在宽度不同是将导致一方换行(换行与 HTML 书写顺序有关，后边的将会浮动到下一行)。
- 浮动元素将被视作为块元素。
- 而浮动元素对于其父元素之外的元素，如果是非浮动元素，则相当于忽视该浮动元素，如果是浮动元素，则相当于同级的浮动元素。
- 而常用的清除浮动的方法，则如使用空标签，overflow，伪元素等。

在使用基于浮动设计的 CSS 框架时，自会提供清除的方法，个人并不习惯使用浮动进行布局。

---

**对 CSS Grid 布局的使用**

[5 分钟学会 CSS Grid 布局](http://www.css88.com/archives/8506)

---

**rem、em、px、vh 与 vw 的区别 ？**

一、 rem 的特点

1. rem 的大小是根据 `html` 根目录下的字体大小进行计算的。
2. 当我们改变根目录下的字体大小的时候，下面字体都改变。
3. rem 不仅可以设置字体的大小，也可以设置元素宽、高等属性。
4. rem 是 CSS3 新增的一个相对单位（root em，根em），这个单位与 em 区别在于使用 rem 为元素设定字体大小时，仍然是相对大小，但相对的只是 HTML 根元素。
   
这个单位可谓集相对大小和绝对大小的优点于一身，通过它既可以做到只修改根元素就成比例地调整所有字体大小，又可以避免字体大小逐层复合的连锁反应。
目前，除了 IE8 及更早版本外，所有浏览器均已支持 rem。
对于不支持它的浏览器，应对方法也很简单，就是多写一个绝对单位的声明。这些浏览器会忽略用 rem 设定的字体大小。

二、px 特点

1. px 像素（Pixel）。相对长度单位。像素 px 是相对于显示器屏幕分辨率而言的。

三、em 特点 

1. em 的值并不是固定的；
2. em 会继承父级元素的字体大小。
3. em 是相对长度单位。当前对行内文本的字体尺寸未被人为设置，相对于当前对象内文本的字体尺寸。如则相对于浏览器的默认字体尺寸。
4. 任意浏览器的默认字体高都是 16px。
   
所有未经调整的浏览器一般都符合: 1em = 16px。那么 12px = 0.75em，10px = 0.625em。
为了简化 font-size 的换算，需要在 css 中的 body 选择器中声明 Fontsize = 62.5%，这就使 em 值变为 16px*62.5%=10px, 这样 12px = 1.2em, 10px = 1em, 也就是说只需要将你的原来的 px 数值除以 10，然后换上 em 作为单位就行了。



四、vh 与 vw 

视口 

- 在桌面端，指的是浏览器的可视区域；
- 在移动端，它涉及 3个 视口：Layout Viewport（布局视口），Visual Viewport（视觉视口），Ideal Viewport（理想视口）。
- 视口单位中的 “视口”，桌面端指的是浏览器的可视区域；移动端指的就是 Viewport 中的 Layout Viewport。

vh / vw 与 % 

| 单位 | 解释                       |
| :--- | :------------------------- |
| vw   | 1vw = 视口宽度的 1%        |
| vh   | 1vh = 视口高度的 1%        |
| vmin | 选取 vw 和 vh 中最小的那个 |
| vmax | 选取 vw 和 vh 中最大的那个 |

比如：浏览器视口尺寸为 370px，那么 1vw = 370px * 1% = 6.5px (浏览器会四舍五入向下取 7)

vh / vw 与 % 区别

| 单位    | 解释           |
| :------ | :------------- |
| %       | 元素的祖先元素 |
| vh / vw | 视口的尺寸     |

不过由于 vw 和 vh 是 css3 才支持的长度单位，所以在不支持 css3 的浏览器中是无效的。

---

**什么叫优雅降级和渐进增强 ？**

- 渐进增强 progressive enhancement：针对低版本浏览器进行构建页面，保证最基本的功能，然后再针对高级浏览器进行效果、交互等改进和追加功能达到更好的用户体验。
- 优雅降级 graceful degradation：一开始就构建完整的功能，然后再针对低版本浏览器进行兼容。

区别

- 优雅降级是从复杂的现状开始，并试图减少用户体验的供给；
- 渐进增强则是从一个非常基础的，能够起作用的版本开始，并不断扩充，以适应未来环境的需要；
- 降级（功能衰减）意味着往回看；而渐进增强则意味着朝前看，同时保证其根基处于安全地带。

---
**width 和 height 的百分比是相对谁讲的 ？margin 和 padding 呢？**

- width 是相对于直接父元素的 width
- height 是相对于直接父元素的 height
- padding 是相对于直接父元素的 width
- margin 是相对于直接父元素的 margin

```
<style>
    #wrapper {
        width: 500px;
        height: 800px;
        background-color: #ccc;
    }
    .parent {
        width: 300px;
        height: 400px;
        background-color: yellow;
    }
    .son {
        /* 90*40 */
        width: 30%;
        height: 10%;
        /* 30 30 */
        padding-left: 10%;
        margin-left: 10%;
        background-color: green;
    }
</style>
<div id="wrapper">
    <div class="parent">
        <div class="son">
        </div>
    </div>
</div>
```

相关文章：

- [transform，transition，animation，keyframes区别](https://segmentfault.com/a/1190000012698032)
- [width 和 height 的百分比是相对谁讲的 ？margin 和 padding 呢？](https://www.jianshu.com/p/075839c8e2f2)
- [彻底搞懂 CSS 层叠上下文、层叠等级、层叠顺序、z-index](https://juejin.im/post/5b876f86518825431079ddd6)


---


[⬆️ 返回顶部](#目录)

## 4. JavaScript 

**常见的浏览器内核有哪些 ？**

- Trident 内核：IE, 360，搜狗浏览器 MaxThon、TT、The World,等。[又称 MSHTML]
- Gecko 内核：火狐，FF，MozillaSuite / SeaMonkey 等
- Presto 内核：Opera7 及以上。[Opera 内核原为：Presto，现为：Blink]
- Webkit 内核：Safari，Chrome 等。 [ Chrome 的：Blink（WebKit 的分支）]

---

**try/catch 无法捕获 promise.reject 的问题**

try..catch 结构，它只能是同步的，无法用于异步代码模式。

https://segmentfault.com/q/1010000014905440

---

**error 事件的事件处理程序**

https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onerror

---

**一个简易版的 Function.prototype.bind 实现**

```js
Function.prototype.bind = function (context) {
    var self = this;
    return function () {
        return self.apply(context, arguments);
    };
};

var obj = {
    name: '前端架构师'
};
var func = function () {
    console.log(this.name);
}.bind(obj);
func();
```

- [【JavaScript】Function.prototype.bind 实现原理](https://blog.csdn.net/w390058785/article/details/83185847)


---

**call、apply、bind**

1. 怎么利用 call、apply 来求一个数组中最大或者最小值 ?
2. 如何利用 call、apply 来做继承 ?
3. apply、call、bind 的区别和主要应用场景 ?

- call 跟 apply 的用法几乎一样，唯一的不同就是传递的参数不同，call 只能一个参数一个参数的传入。
- apply 则只支持传入一个数组，哪怕是一个参数也要是数组形式。最终调用函数时候这个数组会拆成一个个参数分别传入。
- 至于 bind 方法，他是直接改变这个函数的 this 指向并且返回一个新的函数，之后再次调用这个函数的时候 this 都是指向 bind 绑定的第一个参数。
- bind 传参方式跟 call 方法一致。

适用场景：

求一个数组中最大或者最小值

```js
// 如果一个数组我们已知里面全都是数字，想要知道最大的那个数，由于 Array 没有 max 方法，Math 对象上有
// 我们可以根据 apply 传递参数的特性将这个数组当成参数传入
// 最终 Math.max 函数调用的时候会将 apply 的数组里面的参数一个一个传入，恰好符合 Math.max 的参数传递方式
// 这样变相的实现了数组的 max 方法。min 方法也同理
const arr = [1,2,3,4,5,6]
const max = Math.max.apply(null, arr)
console.log(max)    // 6
```

参数都会排在之后

```js
// 如果你想将某个函数绑定新的`this`指向并且固定先传入几个变量可以在绑定的时候就传入，之后调用新函数传入的参数都会排在之后
const obj = {}
function test(...args) { console.log(args) }
const newFn = test.bind(obj, '静态参数1', '静态参数2')
newFn('动态参数3', '动态参数4')
```

利用 call 和 apply 做继承

```js
function Animal(name){
  this.name = name;
  this.showName = function(){
    console.log(this.name);
  }
}

function Cat(name){
  Animal.call(this, name);
}

// Animal.call(this) 的意思就是使用 this 对象代替 Animal 对象，那么
// Cat 中不就有 Animal 的所有属性和方法了吗，Cat 对象就能够直接调用 Animal 的方法以及属性了
var cat = new Cat("TONY");
cat.showName(); //TONY
```

将伪数组转化为数组（含有 length 属性的对象，dom 节点, 函数的参数 arguments）

```js
// case1: dom节点：
<div class="div1">1</div>
<div class="div1">2</div>
<div class="div1">3</div>

let div = document.getElementsByTagName('div');
console.log(div); // HTMLCollection(3) [div.div1, div.div1, div.div1] 里面包含length属性
let arr2 = Array.prototype.slice.call(div);
console.log(arr2); // 数组 [div.div1, div.div1, div.div1]


//case2：fn 内的 arguments
function fn10() {
    return Array.prototype.slice.call(arguments);
}
console.log(fn10(1,2,3,4,5)); // [1, 2, 3, 4, 5]


// case3: 含有 length 属性的对象
let obj4 = {
    0: 1,
    1: 'thomas',
    2: 13,
    length: 3 // 一定要有length属性
};
console.log(Array.prototype.slice.call(obj4)); // [1, "thomas", 13]
```

判断变量类型

```js
let arr1 = [1,2,3];
let str1 = 'string';
let obj1 = { name: 'thomas' };
//
function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}
console.log(fn1(arr1)); // true

// 判断类型的方式，这个最常用语判断 array 和 object ，null( 因为 typeof null 等于 object )
console.log(Object.prototype.toString.call(arr1)); // [object Array]
console.log(Object.prototype.toString.call(str1)); // [object String]
console.log(Object.prototype.toString.call(obj1)); // [object Object]
console.log(Object.prototype.toString.call(null)); // [object Null]
```

总结：

1. 当我们使用一个函数需要改变 this 指向的时候才会用到 `call` `apply` `bind`
2. 如果你要传递的参数不多，则可以使用 fn.call(thisObj, arg1, arg2 ...)
3. 如果你要传递的参数很多，则可以用数组将参数整理好调用 fn.apply(thisObj, [arg1, arg2 ...])
4. 如果你想生成一个新的函数长期绑定某个函数给某个对象使用，则可以使用 const newFn = fn.bind(thisObj); newFn(arg1, arg2...)


手写 bind

```js
Function.prototype.myBind = function(context, ...args) {
  // 设置 fn 为调用 myCall 的方法
  const fn = this
  args = args ? args : []

  // 设置返回的一个新方法
  const result = function(...newFnArgs) {

    // 如果是通过 new 调用的，绑定 this 为实例对象
    if (this instanceof result) {
      fn.apply(this, [...args, ...newFnArgs]);
    } else { // 否则普通函数形式绑定 context
      fn.apply(context, [...args, ...newFnArgs]);
    }
  }

  // 绑定原型链
  result.prototype = Object.create(fn.prototype);

  // 返回结果
  return result;
};

this.a = 1;

const fn = function() {
  this.a = 2;
  console.log(this.a);
}

fn.myBind(fn);
fn();
```


实现 apply

```js
Function.prototype.myApply = function (context, args) {
    //这里默认不传就是给window,也可以用es6给参数设置默认参数
    context = context || window
    args = args ? args : []
    //给context新增一个独一无二的属性以免覆盖原有属性
    const key = Symbol()
    context[key] = this
    //通过隐式绑定的方式调用函数
    const result = context[key](...args)
    //删除添加的属性
    delete context[key]
    //返回函数调用的返回值
    return result
}
```


实现 call

```js
//传递参数从一个数组变成逐个传参了,不用...扩展运算符的也可以用arguments代替
Function.prototype.myCall = function (context, ...args) {
    //这里默认不传就是给window,也可以用es6给参数设置默认参数
    context = context || window
    args = args ? args : []
    //给context新增一个独一无二的属性以免覆盖原有属性
    const key = Symbol()
    context[key] = this
    //通过隐式绑定的方式调用函数
    const result = context[key](...args)
    //删除添加的属性
    delete context[key]
    //返回函数调用的返回值
    return result
}
```

参考文章：

- [手写 bind, apply, call](https://juejin.cn/post/6844903891092389901)
- [call、apply、bind 的区别](https://www.jianshu.com/p/bbeadae6127e)
- [聊一聊 call、apply、bind 的区别](https://segmentfault.com/a/1190000012772040)


---

[彻底弄清 js 继承的几种实现方式](https://segmentfault.com/a/1190000022677985)
[理解 js 继承的 6 种方式](https://www.cnblogs.com/Grace-zyy/p/8206002.html)

---

**mouseenter 和 mouseover 的区别** 

- 不论鼠标指针穿过被选元素或其子元素，都会触发 mouseover 事件，对应 mouseout。
- 只有在鼠标指针穿过被选元素时，才会触发 mouseenter 事件，对应 mouseleave。

---

**用正则表达式匹配字符串，以字母开头，后面是数字、字符串或者下划线，长度为 9 - 20** 

```javascript
var re = new RegExp("^[a-zA-Z][a-zA-Z0-9_]{8,19}$");
```


---

**js 字符串两边截取空白的 trim 的原型方法的实现**


```javascript
// 删除左右两端的空格
function trim(str){
 return str.replace(/(^\s*)|(\s*$)/g, "");
}
// 删除左边的空格 /(^\s*)/g
// 删除右边的空格 /(\s*$)/g
```

---


**介绍一下你对浏览器内核的理解 ?**

内核主要分成两部分：渲染引擎(layout engineer 或 Rendering Engine) 和 JS 引擎。

渲染引擎

负责取得网页的内容（HTML、XML、图像等等）、整理讯息（例如加入 CSS 等），以及计算网页的显示方式，然后会输出至显示器或打印机。
浏览器的内核的不同对于网页的语法解释会有不同，所以渲染的效果也不相同。 
所有网页浏览器、电子邮件客户端以及其它需要编辑、显示网络内容的应用程序都需要内核。

JS 引擎

解析和执行 javascript 来实现网页的动态效果。 

最开始渲染引擎和 JS 引擎并没有区分的很明确，后来 JS 引擎越来越独立，内核就倾向于只指渲染引擎。

---

**哪些常见操作会造成内存泄漏 ？**

内存泄漏指任何对象在您不再拥有或需要它之后仍然存在。 

垃圾回收器定期扫描对象，并计算引用了每个对象的其他对象的数量。如果一个对象的引用数量为 0（没有其他对象引用过该对象），或对该对象的惟一引用是循环的，那么该对象的内存即可回收。 

- setTimeout 的第一个参数使用字符串而非函数的话，会引发内存泄漏。
- 闭包、控制台日志、循环（在两个对象彼此引用且彼此保留时，就会产生一个循环）。

---

**线程与进程的区别 ？**

- 一个程序至少有一个进程，一个进程至少有一个线程。
- 线程的划分尺度小于进程，使得多线程程序的并发性高。 
- 另外，进程在执行过程中拥有独立的内存单元，而多个线程共享内存，从而极大地提高了程序的运行效率。 

线程在执行过程中与进程还是有区别的。

- 每个独立的线程有一个程序运行的入口、顺序执行序列和程序的出口。但是线程不能够独立执行，必须依存在应用程序中，由应用程序提供多个线程执行控制。
- 从逻辑角度来看，多线程的意义在于一个应用程序中，有多个执行部分可以同时执行。
但操作系统并没有将多个线程看做多个独立的应用，来实现进程的调度和管理以及资源分配。这就是进程和线程的重要区别。

---

**eval() 函数有什么用 ？**

eval() 函数可计算某个字符串，并执行其中的的 JavaScript 代码。

---

**实现一个方法，使得：add(2, 5) 和 add(2)(5) 的结果都为 7**

```javascript
var add = function (x, r) {
	if (arguments.length === 1) {
		return function (y) { return x + y; };
	} else {
		return x + r;
	}
};
console.log(add(2)(5));  // 7
console.log(add(2,5));  // 7
```

---

**alert(1 && 2) 和 alert(1 || 0) 的结果是 ？**

alert(1 &&2 ) 的结果是 2

- 只要 “&&” 前面是 false，无论 “&&” 后面是 true 还是 false，结果都将返 “&&” 前面的值;
- 只要 “&&” 前面是 true，无论 “&&” 后面是 true 还是 false，结果都将返 “&&” 后面的值;

alert(0 || 1) 的结果是 1

- 只要 “||” 前面为 false，不管 “||” 后面是 true 还是 false，都返回 “||” 后面的值。
- 只要 “||” 前面为 true，不管 “||” 后面是 true 还是 false，都返回 “||” 前面的值。

> 只要记住 0 与 任何数都是 0，其他反推。

---

**下面的输出结果是 ？**

```javascript
var out = 25,
   inner = {
        out: 20,
        func: function () {
            var out = 30;
            return this.out;
        }
    };
console.log((inner.func, inner.func)());
console.log(inner.func());
console.log((inner.func)());
console.log((inner.func = inner.func)());
```

结果：25，20，20，25

代码解析：这道题的考点分两个 

1. 作用域
2. 运算符（赋值预算，逗号运算）

先看第一个输出：25，因为 ( inner.func, inner.func ) 是进行逗号运算符，逗号运算符就是运算前面的 ”,“ 返回最后一个，举个栗子

```javascript
var i = 0, j = 1, k = 2;
console.log((i++, j++, k)) // 返回的是 k 的值 2 ，如果写成 k++ 的话  这里返回的就是 3
console.log(i); // 1
console.log(j); // 2
console.log(k); // 2   
```

回到原题 ( inner.func, inner.func ) 就是返回 inner.func ，而 inner.func 只是一个匿名函数 

```javascript
function () {
    var out = 30;
    return this.out;
}
```

而且这个匿名函数是属于 window 的，则变成了

```javascript
(function () {
    var out = 30;
    return this.out;
})()
```
此刻的 this => window

所以 out 是 25。

第二和第三个 console.log 的作用域都是 inner，也就是他们执行的其实是 inner.func();
inner 作用域中是有 out 变量的，所以结果是 20。

第四个 console.log 考查的是一个等号运算 inner.func = inner.func ，其实返回的是运算的结果，
举个栗子

```javascript
var a = 2, b = 3;
console.log(a = b) // 输出的是 3
```

所以 inner.func = inner.func 返回的也是一个匿名函数

```javascript
function () {
    var out = 30;
    return this.out;
}
```
此刻，道理就和第一个 console.log 一样了，输出的结果是 25。

---

**下面程序输出的结果是 ？**

```javascript
if (!("a" in window)) {
    var a = 1;
}
alert(a);
```

代码解析：如果 window 不包含属性 a，就声明一个变量 a，然后赋值为 1。

你可能认为 alert 出来的结果是 1，然后实际结果是 “undefined”。

要了解为什么，需要知道 JavaScript 里的 3 个概念。

首先，在 es6 之前，所有的全局变量都是 window 的属性，语句 var a = 1; 等价于 window.a = 1;
你可以用如下方式来检测全局变量是否声明："变量名称" in window。

第二，所有的变量声明都在范围作用域的顶部，看一下相似的例子：

```javascript   
alert("b" in window);
var b;
```

此时，尽管声明是在 alert 之后，alert 弹出的依然是 true，这是因为 JavaScript 引擎首先会扫描所有的变量声明，然后将这些变量声明移动到顶部，最终的代码效果是这样的：

```javascript
var a;
alert("a" in window);
```

这样看起来就很容易解释为什么 alert 结果是 true 了。

第三，你需要理解该题目的意思是，变量声明被提前了，但变量赋值没有，因为这行代码包括了变量声明和变量赋值。

你可以将语句拆分为如下代码：

```javascript
var a;    //声明
a = 1;    //初始化赋值
```

当变量声明和赋值在一起用的时候，JavaScript 引擎会自动将它分为两部以便将变量声明提前，
不将赋值的步骤提前，是因为他有可能影响代码执行出不可预期的结果。

所以，知道了这些概念以后，重新回头看一下题目的代码，其实就等价于：

```javascript
var a;
if (!("a" in window)) {
    a = 1;
}
alert(a);
```

这样，题目的意思就非常清楚了：首先声明 a，然后判断 a 是否在存在，如果不存在就赋值为1，很明显 a 永远在 window 里存在，这个赋值语句永远不会执行，所以结果是 undefined。

提前这个词语显得有点迷惑了，你可以理解为：预编译。

---

**下面程序输出的结果是 ？**

```javascript
var a = 1;
var b = function a(x) {
  x && a(--x);
};
alert(a);
```

这个题目看起来比实际复杂，alert 的结果是 1。

这里依然有 3 个重要的概念需要我们知道。

- 首先，第一个是 `变量声明在进入执行上下文就完成了`；
- 第二个概念就是`函数声明也是提前的，所有的函数声明都在执行代码之前都已经完成了声明，和变量声明一样`。

澄清一下，函数声明是如下这样的代码：

```javascript
function functionName(arg1, arg2){
    //函数体
}
```

如下不是函数，而是函数表达式，相当于变量赋值：

```javascript
var functionName = function(arg1, arg2){
       //函数体
   };
```

澄清一下，函数表达式没有提前，就相当于平时的变量赋值。

- 第三需要知道的是，`函数声明会覆盖变量声明，但不会覆盖变量赋值`。

为了解释这个，我们来看一个例子：

```javascript
function value(){
    return 1;
}
var value;
alert(typeof value);    //"function"
```

尽管变量声明在下面定义，但是变量 value 依然是 function，也就是说这种情况下，函数声明的优先级高于变量声明的优先级，但如果该变量 value 赋值了，那结果就完全不一样了：

```javascript
function value(){
    return 1;
}
var value = 1;
alert(typeof value);    //"number"
```

该 value 赋值以后，变量赋值初始化就覆盖了函数声明。

重新回到题目，这个函数其实是一个有名函数表达式，函数表达式不像函数声明一样可以覆盖变量声明，但你可以注意到，变量 b 是包含了该函数表达式，而该函数表达式的名字是 a。

不同的浏览器对 a 这个名词处理有点不一样，在 IE 里，会将 a 认为函数声明，所以它被变量初始化覆盖了，就是说如果调用 a(–x) 的话就会出错，而其它浏览器在允许在函数内部调用 a(–x)，因为这时候 a 在函数外面依然是数字。
基本上，IE 里调用 b(2) 的时候会出错，但其它浏览器则返回 undefined。

理解上述内容之后，该题目换成一个更准确和更容易理解的代码应该像这样：

```javascript
var a = 1,
    b = function(x) {
      x && b(--x);
    };
alert(a);
```
这样的话，就很清晰地知道为什么 alert 的总是 1 了。

---

**下面程序输出的结果是 ？**

```javascript
function a(x) {
    return x * 2;
}
var a;
alert(a);
```

alert 的值是下面的函数 

```javascript
function a(x) {
    return x * 2;
}
```

这个题目比较简单：即函数声明和变量声明的关系和影响，遇到同名的函数声明，不会重新定义。

---

**下面程序输出的结果是 ？**

```javascript
function b(x, y, a) {
        arguments[2] = 10;
        alert(a);
}
b(1, 2, 3);
```

结果为 10。

活动对象是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化。

---

**三道判断输出的题都是经典的题**

```javascript
var a = 4;
function b() {
  a = 3;
  console.log(a);
  function a(){};
}
b();
```

明显输出是 3，因为里面修改了 a 这个全局变量，那个 function a(){} 是用来干扰的，虽然函数声明会提升，就被 a 给覆盖掉了，这是我的理解。

不记得具体的，就类似如下

```javascript
var baz = 3;
var bazz ={
  baz: 2,
  getbaz: function() {
    return this.baz
  }
}
console.log(bazz.getbaz())
var g = bazz.getbaz;
console.log(g()) ;
```

第一个输出是 2，第二个输出是 3。

这题考察的就是 this 的指向，函数作为对象本身属性调用的时候，this 指向对象，作为普通函数调用的时候，就指向全局了。

还有下面的题：

```javascript
var arr = [1,2,3,4,5];
for(var i = 0; i < arr.length; i++){
  arr[i] = function(){
    alert(i)
  }
}
arr[3]();
```

典型的闭包，弹出 5 。

---

**解释清楚 null 和 undefined**

null 用来表示尚未存在的对象，常用来表示函数企图返回一个不存在的对象。  null 表示"没有对象"，即该处不应该有值。
null 典型用法是： 
- 作为函数的参数，表示该函数的参数不是对象。 
- 作为对象原型链的终点。

当声明的变量还未被初始化时，变量的默认值为 undefined。 undefined 表示"缺少值"，就是此处应该有一个值，但是还没有定义。 
- 变量被声明了，但没有赋值时，就等于 undefined。 
- 调用函数时，应该提供的参数没有提供，该参数等于 undefined。 
- 对象没有赋值的属性，该属性的值为 undefined。 
- 函数没有返回值时，默认返回 undefined。

未定义的值和定义未赋值的为 undefined，null 是一种特殊的 object，NaN 是一种特殊的 number。

---

**讲一下 1 和 Number(1) 的区别***

- 1 是一个原始定义好的 number 类型；
- Number(1) 是一个函数类型，是我们自己声明的一个函数（方法）。

---

**讲一下 prototype 是什么东西，原型链的理解，什么时候用 prototype ？**

prototype 是函数对象上面预设的对象属性。


[深入JavaScript系列（六）：原型与原型链](https://juejin.cn/post/6844903749345886216)

---

**实现 add(1)(2)(3) = 6**

这题考察的是柯里化,做这题之前呢,我们得知道柯里化的概念:

柯里化就是把接收多个参数的函数变换成接收一个单一参数(最初函数的第一个参数)的函数。

```js
const curry = (fn, ...args) => 
            args.length < fn.length 
            // 参数长度不足时,重新柯里化函数,等待接受新参数
            ? (...arguments) => curry(fn, ...args, ...arguments)
            // 函数长度满足时,执行函数
             : fn(...args);

function sumFn(a, b, c){
    return a + b + c;
}
var sum = curry(sumFn);
console.log(sum(1)(2)(3)); //6
```

---

**script 标签的 defer 和 async**


- 一个普通的 `<script>` 标签的加载和解析都是同步的，会阻塞 DOM 的渲染，这也就是我们经常会把 `<script>` 写在 `<body>`底部的原因之一，为了防止加载资源而导致的长时间的白屏。
- 另一个原因是 js 可能会进行 DOM 操作，所以要在 DOM 全部渲染完后再执行。


defer

```
如果 script 标签设置了该属性，则浏览器会异步的下载该文件并且不会影响到后续 DOM 的渲染；
如果有多个设置了 defer 的 script 标签存在，则会按照顺序执行所有的 script；
defer 脚本会在文档渲染完毕后，DOMContentLoaded 事件调用前执行。
```

async

```
async 的设置，会使得 script 脚本异步的加载并在允许的情况下执行 async 的执行，
并不会按着 script 在页面中的顺序来执行，而是谁先加载完谁执行。
```

- 概括来讲，就是这两个属性都会使 script 标签异步加载，然而执行的时机是不一样的。
- 也就是说 async 是乱序的，而 defer 是顺序执行，这也就决定了async 比较适用于百度分析或者谷歌分析这类不依赖其他脚本的库。


推荐的应用场景

defer

如果你的脚本代码依赖于页面中的 DOM 元素（文档是否解析完毕），或者被其他脚本文件依赖。

例：

- 评论框
- 代码语法高亮
- polyfill.js

async

如果你的脚本并不关心页面中的 DOM 元素（文档是否解析完毕），并且也不会产生其他脚本需要的数据。

例：百度统计

如果不太能确定的话，用 defer 总是会比 async 稳定。。。

参考：[浅谈 script 标签中的 async 和 defer](https://www.cnblogs.com/jiasm/p/7683930.html)

---

**函数里的 this 什么含义，什么情况下，怎么用 ？**

- this 是 Javascript 语言的一个关键字。
- 它代表函数运行时，自动生成的一个内部对象，只能在函数内部使用。
- 随着函数使用场合的不同，this 的值会发生变化。
- 但是有一个总的原则，那就是 `this 指的是，调用函数的那个对象`。

情况一：纯粹的函数调用 

这是函数的最通常用法，`属于全局性调用，因此 this 就代表全局对象 window`。    　　

```javascript
function test(){    　　　
  this.x = 1;    　　　　
  alert(this.x);    　　
}    　　
test(); // 1
```

为了证明 this 就是全局对象，我对代码做一些改变：    　　

```javascript
var x = 1;    　　
function test(){    　　　　
  alert(this.x);    　　
}    　　
test(); // 1    
```
运行结果还是 1。

再变一下：    　　

```javascript
var x = 1;    　　
function test(){    　　　　
  this.x = 0;    　　
}    　　
test();
alert(x); // 0
```

情况二：作为对象方法的调用    

`函数还可以作为某个对象的方法调用，这时 this 就指这个上级对象`。   
 　　
```javascript
function test(){    　　　　
  alert(this.x);    　　
}
var x = 2    　　
var o = {};    　　
o.x = 1;    　　
o.m = test;    　　
o.m(); // 1
```

情况三： 作为构造函数调用   
 
所谓构造函数，就是通过这个函数生成一个新对象（object）。这时的 this 就指这个新对象。

```javascript
function Test(){    　　　　
  this.x = 1;    　　
}    　　
var o = new Test();
alert(o.x); // 1    
```

运行结果为 1。为了表明这时 this 不是全局对象，对代码做一些改变： 
   　　
```javascript
var x = 2;    　　
function Test(){    　　　　
  this.x = 1;    　　
}    　　
var o = new Test();    　　
alert(x); // 2
```
运行结果为 2，表明全局变量 x 的值没变。

情况四： apply 调用    

apply() 是函数对象的一个方法，它的作用是改变函数的调用对象，它的第一个参数就表示改变后的调用这个函数的对象。因此，this 指的就是这第一个参数。    　　

```javascript
var x = 0;    　　
function test(){    　　　　
  alert(this.x);    　　
}    　　
var o = {};    　　
o.x = 1;    　　
o.m = test;    　　
o.m.apply(); // 0    
```

apply() 的参数为空时，默认调用全局对象。因此，这时的运行结果为 0，证明 this 指的是全局对象。
    
如果把最后一行代码修改为

```javascript
o.m.apply(o); // 1
```

运行结果就变成了 1，证明了这时 this 代表的是对象 o。

---

**apply 和 call  什么含义，什么区别 ？什么时候用 ？**

call，apply 都属于 Function.prototype 的一个方法，它是 JavaScript 引擎内在实现的，因为属于 Function.prototype，所以每个 Function 对象实例(就是每个方法)都有 call，apply 属性。

既然作为方法的属性，那它们的使用就当然是针对方法的了，这两个方法是容易混淆的，因为它们的作用一样，只是使用方式不同。

语法：

```javascript
foo.call(this, arg1, arg2, arg3) == foo.apply(this, arguments) == this.foo(arg1, arg2, arg3);
```

- 相同点：两个方法产生的作用是完全一样的。
- 不同点：方法传递的参数不同。

每个函数对象会有一些方法可以去修改函数执行时里面的 this，比较常见得到就是 call 和 apply，通过 call 和 apply 可以重新定义函数的执行环境，即 this 的指向。

```javascript
function add(c, d) {
  console.log(this.a + this.b + c + d);
}

var o = { a: 1, b: 3 };
add.call(o, 5, 7);    //1+3+5+7=16
//传参的时候是扁平的把每个参数传进去

add.apply(o, [10, 20]);   //1+3+10+20=34
//传参的时候是把参数作为一个数组传进去

//什么时候使用 call 或者 apply
function bar() {
  console.log(Object.prototype.toString.call(this));
  // 用来调用一些无法直接调用的方法
}

bar.call(7); // "[object Number]"
```

---

**异步过程的构成要素有哪些？和异步过程是怎样的 ？**

总结一下，一个异步过程通常是这样的：

- 主线程发起一个异步请求，相应的工作线程接收请求并告知主线程已收到(异步函数返回)；
- 主线程可以继续执行后面的代码，同时工作线程执行异步任务；
- 工作线程完成工作后，通知主线程；
- 主线程收到通知后，执行一定的动作(调用回调函数)。

1. 异步函数通常具有以下的形式：A(args..., callbackFn)。
2. 它可以叫做异步过程的发起函数，或者叫做异步任务注册函数。
3. args 和 callbackFn 是这个函数的参数。

所以，从主线程的角度看，一个异步过程包括下面两个要素：

- 发起函数(或叫注册函数) A。
- 回调函数 callbackFn。

它们都是在主线程上调用的，其中注册函数用来发起异步过程，回调函数用来处理结果。

举个具体的例子：

```javascript
setTimeout(fn, 1000);
```
其中的 setTimeout 就是异步过程的发起函数，fn 是回调函数。

注意：前面说的形式 A(args..., callbackFn) 只是一种抽象的表示，并不代表回调函数一定要作为发起函数的参数。

例如：

```javascript
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = xxx; // 添加回调函数
xhr.open('GET', url);
xhr.send(); // 发起函数
```

发起函数和回调函数就是分离的。

---

**说说消息队列和事件循环**

![](https://upload-images.jianshu.io/upload_images/12890819-b606f7eed6ba42d1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 主线程在执行完当前循环中的所有代码后，就会到消息队列取出这条消息(也就是 message 函数)，并执行它。
- 完成了工作线程对主线程的通知，回调函数也就得到了执行。
- 如果一开始主线程就没有提供回调函数，AJAX 线程在收到 HTTP 响应后，也就没必要通知主线程，从而也没必要往消息队列放消息。

> 异步过程的回调函数，一定不在当前的这一轮事件循环中执行。

---


**session 与 cookie 的区别**

- session 保存在服务器，客户端不知道其中的信息；
- cookie 保存在客户端，服务器能够知道其中的信息。 
- session 中保存的是对象，cookie 中保存的是字符串。   
- session 不能区分路径，同一个用户在访问一个网站期间，所有的 session 在任何一个地方都可以访问到。
- 而 cookie 中如果设置了路径参数，那么同一个网站中不同路径下的 cookie 互相是访问不到的。  

---

**cookies 是干嘛的，服务器和浏览器之间的 cookies 是怎么传的，httponly 的 cookies 和可读写的 cookie 有什么区别，有无长度限制 ?**

- cookies 是一些存储在用户电脑上的小文件。
- 它是被设计用来保存一些站点的用户数据，这样能够让服务器为这样的用户定制内容，后者页面代码能够获取到 cookie 值然后发送给服务器。
- 比如 cookie 中存储了所在地理位置，以后每次进入地图就默认定位到改地点即可。

---

**请描述一下 cookies，sessionStorage 和 localStorage 的区别**

共同点

- 都是保存在浏览器端，且同源的。

区别

- cookie 数据始终在同源的 http 请求中携带（即使不需要），即 cookie 在浏览器和服务器间来回传递。
- 而 sessionStorage 和 localStorage 不会自动把数据发给服务器，仅在本地保存。
- cookie 数据还有路径（path）的概念，可以限制 cookie 只属于某个路径下。
- 存储大小限制也不同，cookie 数据不能超过 4k，同时因为每次 http 请求都会携带 cookie，所以 cookie 只适合保存很小的数据，如会话标识。
- sessionStorage 和 localStorage 虽然也有存储大小的限制，但比 cookie 大得多，可以达到 5M 或更大。
- 数据有效期不同，sessionStorage：仅在当前浏览器窗口关闭前有效，自然也就不可能持久保持；localStorage：始终有效，窗口或浏览器关闭也一直保存，因此用作持久数据；cookie 只在设置的 cookie 过期时间之前一直有效，即使窗口或浏览器关闭。
- 作用域不同，sessionStorage 在不同的浏览器窗口中`不共享`，即使是同一个页面；cookie 和 localStorage 在所有同源窗口中都是共享的。


---

**从敲入 URL 到渲染完成的整个过程，包括 DOM 构建的过程，说的约详细越好**

- 用户输入 url 地址，浏览器根据域名寻找 IP 地址
- 浏览器向服务器发送 http 请求，如果服务器段返回以 301 之类的重定向，浏览器根据相应头中的 location 再次发送请求
- 服务器端接受请求，处理请求生成 html 代码，返回给浏览器，这时的 html 页面代码可能是经过压缩的
- 浏览器接收服务器响应结果，如果有压缩则首先进行解压处理，紧接着就是页面解析渲染
-  解析渲染该过程主要分为以下步骤：解析 HTML、构建 DOM 树、DOM 树与 CSS 样式进行附着构造呈现树
- 布局
- 绘制

详情：[面试题之从敲入 URL 到浏览器渲染完成](https://juejin.im/post/5b9ba9c15188255c8320fe27)

---

**是否了解公钥加密和私钥加密。如何确保表单提交里的密码字段不被泄露。**

公钥用于对数据进行加密，私钥用于对数据进行解密。

很直观的理解：公钥就是公开的密钥，其公开了大家才能用它来加密数据。私钥是私有的密钥，谁有这个密钥才能够解密密文。

解决方案 1:

form 在提交的过程中，对密码字段是不进行加密而是以明码的形式进行数据传输的。
如果要对数据进行加密，你可以自己写一个脚本对内容进行编码后传输，只是这个安全性也并不高。

解决方案 2:

如果想对数据进行加密，你可以使用 HTTPS 安全传输协议，这个协议是由系统进行密码加密处理的，在数据传输中是绝对不会被拦截获取的，只是 HTTPS 的架设会相对麻烦点。一些大型网站的登录、银行的在线网关等都是走这条路。

---

**验证码是干嘛的，是为了解决什么安全问题。**

所谓验证码，就是将一串随机产生的数字或符号，生成一幅图片， 图片里加上一些干扰象素（防止OCR），由用户肉眼识别其中的验证码信息，输入表单提交网站验证，验证成功后才能使用某项功能。

- 验证码一般是防止批量注册的，人眼看起来都费劲，何况是机器。
- 像百度贴吧未登录发贴要输入验证码大概是防止大规模匿名回帖的发生。
- 目前，不少网站为了防止用户利用机器人自动注册、登录、灌水，都采用了验证码技术。

---


**截取字符串 abcdefg 的 efg。**

从第四位开始截取

```javascript
alert('abcdefg'.substring(4));
alert ('abcdefg'.slice(4))
```
---

**判断一个字符串中出现次数最多的字符，统计这个次数**

步骤

- 将字符串转化数组 
- 创建一个对象 
- 遍历数组，判断对象中是否存在数组中的值，如果存在值 +1，不存在赋值为 1
- 定义两个变量存储字符值，字符出现的字数

```javascript
var str = 'abaasdffggghhjjkkgfddsssss3444343';
// 1.将字符串转换成数组
var newArr = str.split("");
// 2.创建一个对象
var json = {};
// 3. 所有字母出现的次数，判断对象中是否存在数组中的值，如果存在值 +1，不存在赋值为 1
for(var i = 0; i < newArr.length; i++){
      // 类似：json : { ‘a’: 3, ’b’: 1 }
      if(json[newArr[i]]){
         json[newArr[i]] +=1;
      } else {
           json[newArr[i]] = 1;
      }
}
// 4 定义两个变量存储字符值，字符出现的字数
var num = 0 ; //次数
var element = ""; //最多的项
for(var k in json){
   if(json[k] > num){
     num = json[k];
     element = k ;
   }
}
console.log("出现次数："+num +"最多的字符："+ element);
```

---

**document.write 和 innerHTML 的区别**

- document.write 是直接写入到页面的内容流，如果在写之前没有调用 document.open, 浏览器会自动调用 open。每次写完关闭之后重新调用该函数，会导致页面被重写。
- innerHTML 则是 DOM 页面元素的一个属性，代表该元素的 html 内容。你可以精确到某一个具体的元素来进行更改。如果想修改 document 的内容，则需要修改 document.documentElement.innerElement。
- innerHTML 将内容写入某个 DOM 节点，不会导致页面全部重绘。
- innerHTML 很多情况下都优于 document.write，其原因在于其允许更精确的控制要刷新页面的那一个部分。
- document.write 是重写整个 document, 写入内容是字符串的 html；innerHTML 是 HTMLElement 的属性，是一个元素的内部 html 内容 

---

**JS 识别不同浏览器信息**

```javascript
function myBrowser() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
  var isOpera = userAgent.indexOf("Opera") > -1;
  if (isOpera) {
    return "Opera"
  }; //判断是否Opera浏览器  
  if (userAgent.indexOf("Firefox") > -1) {
    return "Firefox";
  }  //判断是否Firefox浏览器  
  if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  }   //判断是否Google浏览器  
  if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  } //判断是否Safari浏览器  
  if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
    return "IE";
  }; //判断是否IE浏览器  
} 
```

---

**JavaScript 常见的内置对象**

有 Object、Math、String、Array、Number、Function、Boolean、JSON 等，其中 Object 是所有对象的基类，采用了原型继承方式。

---

**编写一个方法，求一个字符串的字节长度**

假设：一个英文字符占用一个字节，一个中文字符占用两个字节

```javascript
function getBytes(str){
    var len = str.length;
    var bytes = len;
    for(var i = 0; i < len; i++){
        if (str.charCodeAt(i) > 255)  bytes++;
    }
    return bytes;
}
alert(getBytes("你好,as"));
```

---

**JS 组成**

- 核心（ECMAScript） 描述了该语言的语法和基本对象
- 文档对象模型(DOM) 描述了处理网页内容的方法和接口
- 浏览器对象模型(BOM) 描述了与浏览器进行交互的方法和接口

---

**new 操作符具体干了什么呢 ?**

- 创建一个空对象，并且 this 变量引用该对象，同时还继承了该函数的原型。
- 属性和方法被加入到 this 引用的对象中。
- 新创建的对象由 this 所引用，并且最后隐式的返回 this 。

--- 

**JSON 的了解？**

- JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式。
- 它是基于 JavaScript 的一个子集。
- 数据格式简单，易于读写，占用带宽小。 
- 格式：采用键值对。例如：{ “age‟: ‟12‟, ”name‟: ‟back‟ }

---



**你有哪些性能优化的方法 ？**

web 前端是应用服务器处理之前的部分，前端主要包括：HTML、CSS、javascript、image 等各种资源，针对不同的资源有不同的优化方式。

内容优化

- 减少 HTTP 请求数。这条策略是最重要最有效的，因为一个完整的请求要经过 DNS 寻址，与服务器建立连接，发送数据，等待服务器响应，接收数据这样一个消耗时间成本和资源成本的复杂的过程。
常见方法：合并多个 CSS 文件和 js 文件，利用 CSS Sprites 整合图像，Inline Images (使用 data：URL scheme 在实际的页面嵌入图像数据 )，合理设置 HTTP 缓存等。
- 减少 DNS 查找
- 避免重定向
- 使用 Ajax 缓存
- 延迟加载组件，预加载组件
- 减少 DOM 元素数量。页面中存在大量 DOM 元素，会导致 javascript 遍历 DOM 的效率变慢。
- 最小化 iframe 的数量。iframes 提供了一个简单的方式把一个网站的内容嵌入到另一个网站中。但其创建速度比其他包括 JavaScript 和 CSS 的 DOM 元素的创建慢了 1-2 个数量级。
- 避免 404。HTTP 请求时间消耗是很大的，因此使用 HTTP 请求来获得一个没有用处的响应（例如 404 没有找到页面）是完全没有必要的，它只会降低用户体验而不会有一点好处。

服务器优化

- 使用内容分发网络（CDN）。把网站内容分散到多个、处于不同地域位置的服务器上可以加快下载速度。
- GZIP 压缩
- 设置 ETag：ETags（Entity tags，实体标签）是 web 服务器和浏览器用于判断浏览器缓存中的内容和服务器中的原始内容是否匹配的一种机制。
- 提前刷新缓冲区
- 对 Ajax 请求使用 GET 方法
- 避免空的图像 src

Cookie 优化

- 减小 Cookie 大小
- 针对 Web 组件使用域名无关的 Cookie

CSS 优化

- 将 CSS 代码放在 HTML 页面的顶部
- 避免使用 CSS 表达式
- 使用 < link> 来代替 @import
- 避免使用 Filters

javascript 优化

- 将 JavaScript 脚本放在页面的底部。
- 将 JavaScript 和 CSS 作为外部文件来引用。
在实际应用中使用外部文件可以提高页面速度，因为 JavaScript 和 CSS 文件都能在浏览器中产生缓存。
- 缩小 JavaScript 和 CSS
- 删除重复的脚本
- 最小化 DOM 的访问。使用 JavaScript 访问 DOM 元素比较慢。
- 开发智能的事件处理程序
- javascript 代码注意：谨慎使用 with，避免使用 eval Function 函数，减少作用域链查找。

图像优化

- 优化图片大小
- 通过 CSS Sprites 优化图片
- 不要在 HTML 中使用缩放图片
- favicon.ico 要小而且可缓存


[前端性能优化 24 条建议（2020）](https://juejin.cn/post/6892994632968306702)


---

**JS 格式化数字（每三位加逗号）**

从后往前取。

```javascript
function toThousands(num) {  
    var num = (num || 0).toString(), result = '';  
    while (num.length > 3) {  
        result = ',' + num.slice(-3) + result;  
        num = num.slice(0, num.length - 3);  
    }  
    if (num) { result = num + result; }  
    return result;  
}  
```

---

**合并数组**

如果你需要合并两个数组的话，可以使用 Array.concat()

```javascript
var array1 = [1, 2, 3];
var array2 = [4, 5, 6];
console.log(array1.concat(array2)); // [1,2,3,4,5,6];
```

然而，这个函数并不适用于合并大的数组，因为它需要创建一个新的数组，而这会消耗很多内存。

这时，你可以使用 Array.push.apply(arr1, arr2) 来代替创建新的数组，它可以把第二个数组合并到第一个中，从而较少内存消耗。

```javascript
var array1 = [1, 2, 3];
var array2 = [4, 5, 6];
console.log(array1.push.apply(array1, array2)); // [1, 2, 3, 4, 5, 6]
```

---

**把节点列表 (NodeList) 转换为数组**

如果你运行 document.querySelectorAll("p") 方法，它可能会返回一个 DOM 元素的数组 — 节点列表对象。
但这个对象并不具有数组的全部方法，如 sort()，reduce()， map()，filter()。
为了使用数组的那些方法，你需要把它转换为数组。

只需使用 [].slice.call(elements) 即可实现：

```javascript
var elements = document.querySelectorAll("p"); // NodeList
var arrayElements = [].slice.call(elements); // 现在 NodeList 是一个数组

var arrayElements = Array.from(elements); // 这是另一种转换 NodeList 到 Array  的方法
```

---

**打乱数组元素的顺序**

不适用 Lodash 等这些库打乱数组元素顺序，你可以使用这个技巧：

```javascript
var list = [1, 2, 3];
console.log(list.sort(function() { Math.random() - 0.5 })); // [2, 1, 3]
```
---

**js 的 ready 和 onload 事件的区别**

- onload 是等 HTML 的所有资源都加载完成后再执行 onload 里面的内容，所有资源包括 DOM 结构、图片、视频 等资源;
- ready 是当 DOM 结构加载完成后就可以执行了，相当于 jQuery 中的 $(function(){ js 代码 }); 
- 另外，onload 只能有一个，ready 可以有多个。

---

**js 的两种回收机制**

标记清除（mark and sweep）

从语义上理解就比较好理解了，大概就是当变量进入到某个环境中的时候就把这个变量标记一下，比如标记为“进入环境”，当离开的时候就把这个变量的标记给清除掉，比如是“离开环境”。而在这后面还有标记的变量将被视为准备删除的变量。

- 垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记（可以使用任何标记方式）。
- 然后，它会去掉环境中的变量以及被环境中的变量引用的变量的标记。
- 而在此之后再被加上的标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。
- 最后，垃圾收集器完成内存清除工作。销毁那些带标记的值并回收它们所占用的内存空间。

这是 javascript 最常见的垃圾回收方式。至于上面有说道的标记，到底该如何标记 ？
好像是有很多方法，比如特殊位翻转，维护一个列表什么的。

引用计数（reference counting）

- 引用计数的含义是跟踪记录每个值被引用的次数，当声明一个变量并将一个引用类型的值赋给该变量时，这个时候的引用类型的值就会是引用次数 +1 了。如果同一个值又被赋给另外一个变量，则该值的引用次数又 +1。
- 相反如果包含这个值的引用的变量又取得另外一个值，即被重新赋了值，那么这个值的引用就 -1 。当这个值的引用次数编程 0 时，表示没有用到这个值，这个值也无法访问，因此环境就会收回这个值所占用的内存空间回收。
- 这样，当垃圾收集器下次再运行时，它就会释放引用次数为 0 的值所占用的内存。

---


**[三张图搞懂 JavaScript 的原型对象与原型链](https://www.cnblogs.com/shuiyi/p/5305435.html)**



对于新人来说，JavaScript 的原型是一个很让人头疼的事情，一来 prototype 容易与 ____proto____ 混淆， 

一、prototype 和 ____proto____  的区别

![](https://upload-images.jianshu.io/upload_images/12890819-e1ef55b9143a3efc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```javascript
var a = {};
console.log(a.prototype);  //undefined
console.log(a.__proto__);  //Object {}

var b = function(){}
console.log(b.prototype);  //b {}
console.log(b.__proto__);  //function() {}
```

结果：

![](https://upload-images.jianshu.io/upload_images/12890819-72e28fa1e97cb219.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![](https://upload-images.jianshu.io/upload_images/12890819-2b2dae330851635e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```javascript
/*1、字面量方式*/
var a = {};
console.log("a.__proto__ ：", a.__proto__);  // Object {}
console.log("a.__proto__ === a.constructor.prototype：", a.__proto__ === a.constructor.prototype); // true

/*2、构造器方式*/
var A = function(){};
var a2 = new A();
console.log("a2.__proto__：", a2.__proto__); // A {}
console.log("a2.__proto__ === a2.constructor.prototype：", a2.__proto__ === a2.constructor.prototype); // true

/*3、Object.create()方式*/
var a4 = { a: 1 }
var a3 = Object.create(a4);
console.log("a3.__proto__：", a3.__proto__); // Object {a: 1}
console.log("a3.__proto__ === a3.constructor.prototype：", a3.__proto__ === a3.constructor.prototype); // false（此处即为图1中的例外情况）
```
结果：


![](https://upload-images.jianshu.io/upload_images/12890819-83632220f64d5ac8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![](https://upload-images.jianshu.io/upload_images/12890819-998ad2efae997f6a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```javascript
var A = function(){};
var a = new A();
console.log(a.__proto__); // A {}（即构造器 function A 的原型对象）
console.log(a.__proto__.__proto__); // Object {}（即构造器 function Object 的原型对象）
console.log(a.__proto__.__proto__.__proto__); // null
```

结果：

![](https://upload-images.jianshu.io/upload_images/12890819-f0b646091fd42102.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


---

**闭包的理解 ？**

一、变量的作用域

要理解闭包，首先必须理解 Javascript 特殊的变量作用域。
变量的作用域无非就是两种：全局变量和局部变量。

Javascript语言的特殊之处，就在于函数内部可以直接读取全局变量。

```javascript
var n = 999;
function f1(){
  alert(n);
}
f1(); // 999
```

另一方面，在函数外部自然无法读取函数内的局部变量。

```javascript
function f1(){　　　　
  var n = 999;
}
alert(n); // error
```

这里有一个地方需要注意，函数内部声明变量的时候，一定要使用 var 命令。
如果不用的话，你实际上声明了一个全局变量！

```javascript
function f1(){
  n = 999;
}
f1();
alert(n); // 999
```

二、如何从外部读取局部变量 ？

```javascript
function f1() {
  var n = 999;
  function f2() {
    alert(n);
  }
  return f2;
}
var result = f1();
result(); // 999
```

既然 f2 可以读取 f1 中的局部变量，那么只要把 f2 作为返回值，我们不就可以在 f1 外部读取它的内部变量了吗！

三、闭包的概念

上一节代码中的 f2 函数，就是闭包。
我的理解是，`闭包就是能够读取其他函数内部变量的函数`。

由于在 Javascript 语言中，只有函数内部的子函数才能读取局部变量，因此可以把闭包简单理解成 `定义在一个函数内部的函数`。
所以，在本质上，`闭包就是将函数内部和函数外部连接起来的一座桥梁`。

四、闭包的用途

闭包可以用在许多地方。它的最大用处有两个，一个是前面提到的可以读取函数内部的变量，另一个就是让这些变量的值始终保持在内存中。

怎么来理解呢 ？请看下面的代码。

```javascript
function f1() {
  var n = 999;
  nAdd = function () { n += 1 }
  function f2() {
    alert(n);
  }
  return f2;
}
var result = f1();
result(); // 999
nAdd();
result(); // 1000
```

在这段代码中，result 实际上就是闭包 f2 函数。它一共运行了两次，第一次的值是 999，第二次的值是 1000。这证明了，函数 f1 中的局部变量 n 一直保存在内存中，并没有在 f1 调用后被自动清除。

为什么会这样呢 ？

原因就在于 f1 是 f2 的父函数，而 f2 被赋给了一个全局变量，这导致 f2 始终在内存中，而 f2 的存在依赖于 f1，因此 f1 也始终在内存中，不会在调用结束后，被垃圾回收机制（garbage collection）回收。

这段代码中另一个值得注意的地方，就是 
- "nAdd=function(){ n+=1 }" 这一行，首先在 nAdd 前面没有使用 var 关键字，因此 nAdd 是一个全局变量，而不是局部变量。
- 其次，nAdd 的值是一个匿名函数（anonymous function），而这个匿名函数本身也是一个闭包，所以 nAdd 相当于是一个 setter，可以在函数外部对函数内部的局部变量进行操作。

五、使用闭包的注意点

- 由于闭包会使得函数中的变量都被保存在内存中，内存消耗很大，所以不能滥用闭包，否则会造成网页的性能问题，在 IE 中可能导致内存泄露。解决方法是，在退出函数之前，将不使用的局部变量全部删除。
- 闭包会在父函数外部，改变父函数内部变量的值。所以，如果你把父函数当作对象（object）使用，把闭包当作它的公用方法（Public Method），把内部变量当作它的私有属性（private value），这时一定要小心，不要随便改变父函数内部变量的值。

---

**闭包面试经典问题**


问题：想每次点击对应目标时弹出对应的数字下标 0~4 ，但实际是无论点击哪个目标都会弹出数字 5。

```javascript
function onMyLoad() {
  var arr = document.getElementsByTagName("p");
  for (var i = 0; i < arr.length; i++) {
    arr[i].onclick = function () {
      alert(i);
    }
  }
}
```

问题所在：arr 中的每一项的 onclick 均为一个函数实例(Function 对象)，这个函数实例也产生了一个闭包域，这个闭包域引用了外部闭包域的变量，其 function scope 的 closure 对象有个名为 i 的引用，外部闭包域的私有变量内容发生变化，内部闭包域得到的值自然会发生改变。


解决办法一

解决思路：增加若干个对应的闭包域空间(这里采用的是匿名函数)，专门用来存储原先需要引用的内容(下标)，不过只限于基本类型(基本类型值传递，对象类型引用传递)。

```javascript
//声明一个匿名函数，若传进来的是基本类型则为值传递，故不会对实参产生影响,
//该函数对象有一个本地私有变量 arg(形参) ，该函数的 function scope 的 closure 对象属性有两个引用，一个是 arr，一个是 i
//尽管引用 i 的值随外部改变 ，但本地私有变量(形参) arg 不会受影响，其值在一开始被调用的时候就决定了
for (var i = 0; i < arr.length; i++) {
  (function (arg) {
    arr[i].onclick = function () {
      // onclick 函数实例的 function scope 的 closure 对象属性有一个引用 arg,
      alert(arg);
      //只要 外部空间的 arg 不变，这里的引用值当然不会改变
    }
  })(i); //立刻执行该匿名函数，传递下标 i (实参)
}
```

解决办法二

解决思路：将事件绑定在新增的匿名函数返回的函数上，此时绑定的函数中的 function scope 中的 closure 对象的 引用 arg 是指向将其返回的匿名函数的私有变量 arg

```javascript
for (var i = 0; i < arr.length; i++) {
  arr[i].onclick = (function (arg) {
    return function () {
      alert(arg);
    }
  })(i);
}
```

解决办法三

使用 ES6 新语法 let 关键字

```javascript
for (var i = 0; i < arr.length; i++) {
  let j = i; // 创建一个块级变量
  arr[i].onclick = function () {
    alert(j);
  }
}
```

[js闭包的9个使用场景](https://www.jb51.net/article/203104.htm)


---

**JavaScript 判断一个变量是对象还是数组 ？**

typeof 都返回 object

在 JavaScript 中所有数据类型严格意义上都是对象，但实际使用中我们还是有类型之分，如果要判断一个变量是数组还是对象使用 typeof 搞不定，因为它全都返回 object。

第一，使用 typeof 加 length 属性

数组有 length 属性，object 没有，而 typeof 数组与对象都返回 object，所以我们可以这么判断

```javascript
var getDataType = function(o){
    if(typeof o == 'object'){
        if( typeof o.length == 'number' ){
            return 'Array';
        } else {
            return 'Object';   
        }
    } else {
        return 'param is no object type';
    }
};
```

第二，使用 instanceof

利用 instanceof 判断数据类型是对象还是数组时应该优先判断 array，最后判断 object。

```javascript
var getDataType = function(o){
    if(o instanceof Array){
        return 'Array'
    } else if ( o instanceof Object ){
        return 'Object';
    } else {
        return 'param is no object type';
    }
};
```

---

**ES5 的继承和 ES6 的继承有什么区别 ？**

ES5 的继承时通过 prototype 或构造函数机制来实现。

- `ES5 的继承实质上是先创建子类的实例对象，然后再将父类的方法添加到 this 上（Parent.apply(this)）`。
- `ES6 的继承机制完全不同，实质上是先创建父类的实例对象 this（所以必须先调用父类的 super()方法），然后再用子类的构造函数修改 this`。

具体的：ES6 通过 class 关键字定义类，里面有构造方法，类之间通过 extends 关键字实现继承。子类必须在 constructor 方法中调用 super 方法，否则新建实例报错。因为子类没有自己的 this 对象，而是继承了父类的 this 对象，然后对其进行加工。如果不调用 super 方法，子类得不到 this 对象。

ps：super 关键字指代父类的实例，即父类的 this 对象。在子类构造函数中，调用 super 后，才可使用 this 关键字，否则报错。

---

**JS 中数据类型的判断 typeof，instanceof，constructor，Object.prototype.toString.call() 的区别**

参考文章：

1. [JS 中数据类型的判断](https://blog.csdn.net/zjy_android_blog/article/details/81023177)
2. [JS类型判断---typeof, constructor, instanceof, toString](https://juejin.im/post/5d99b56f518825222b5b6737)

---

**翻转一个字符串**

先将字符串转成一个数组，然后用数组的 reverse() + join() 方法。

```javascript
let a = "hello word";
let b = [...str].reverse().join(""); // drow olleh
```

---


**说说堆和栈的区别 ？**
　

一、堆栈空间分配区别
　　
- 栈（操作系统）：由操作系统自动分配释放 ，存放函数的参数值，局部变量的值等。其操作方式类似于数据结构中的栈；　　
- 堆（操作系统）： 一般由程序员分配释放， 若程序员不释放，程序结束时可能由 OS 回收，分配方式倒是类似于链表。　　

二、堆栈缓存方式区别

- 栈使用的是一级缓存， 他们通常都是被调用时处于存储空间中，调用完毕立即释放；　　
- 堆是存放在二级缓存中，生命周期由虚拟机的垃圾回收算法来决定（并不是一旦成为孤儿对象就能被回收）。所以调用这些对象的速度要相对来得低一些。　　

三、堆栈数据结构区别

- 堆（数据结构）：堆可以被看成是一棵树，如：堆排序；　　
- 栈（数据结构）：一种先进后出的数据结构。

---


#### js 经典面试知识文章

- [js 异步执行顺序](https://www.cnblogs.com/xiaozhumaopao/p/11066005.html)
- [JS 是单线程，你了解其运行机制吗 ？](https://github.com/biaochenxuying/blog/issues/8)
- [7 分钟理解 JS 的节流、防抖及使用场景](https://juejin.im/post/5b8de829f265da43623c4261)
- [JavaScript 常见的六种继承方式](https://juejin.im/post/5bb091a7e51d450e8477d9ba)
- [JS 继承的 6 种实现方式](https://www.cnblogs.com/humin/p/4556820.html)
- [九种跨域方式实现原理（完整版）](https://juejin.im/post/5c23993de51d457b8c1f4ee1)
- [常见六大Web安全攻防解析](https://juejin.im/post/5c446eb1e51d45517624f7db)
- [一文读懂 HTTP/2 及 HTTP/3 特性](https://juejin.im/post/5c658309e51d4542331c442e)
- [深入理解 HTTPS 工作原理](https://juejin.im/post/5ca6a109e51d4544e27e3048#heading-0)
- [JavaScript 中的垃圾回收和内存泄漏](https://juejin.im/post/5cb33660e51d456e811d2687)
- [你不知道的浏览器页面渲染机制](https://juejin.im/post/5ca0c0abe51d4553a942c17d)
- [JavaScript设计模式](https://juejin.im/post/59df4f74f265da430f311909)
- [深入 javascript——构造函数和原型对象](https://segmentfault.com/a/1190000000602050)
- [高级函数技巧-函数柯里化](https://segmentfault.com/a/1190000018265172)
- [JavaScript之bind及bind的模拟实现](https://blog.csdn.net/c__dreamer/article/details/79673725)
- [Http Cookie 机制及 Cookie 的实现原理](https://blog.csdn.net/aa5305123/article/details/83247041)
- [一个dom,点击事件触发两个事件是同步还是异步](https://blog.csdn.net/u012129607/article/details/78117483)
- [16种JavaScript设计模式（中）](https://juejin.im/post/5c038df96fb9a04a0378f600)

---

[⬆️ 返回顶部](#目录)

## 5. ES6 +

**ES6 函数默认参数和 es5 的实现有什么区别 ？es6 中又有什么需要注意的 ？**

[ES6函数默认参数](https://www.jianshu.com/p/e4ea0d43529c)

---


**ES6 声明变量的六种方法**

- ES5 只有两种声明变量的方法：var 和 function 。
- ES6 除了添加 let 和 const 命令。
- 还有两种声明变量的方法：import 命令和 class 命令。

---

**Promise 的队列与 setTimeout 的队列有何关联 ？**

```javascript
setTimeout(function(){ console.log(4) }, 0);
new Promise(function(resolve){
    console.log(1)
    for( var i = 0 ; i < 10000 ; i++ ){
        i == 9999 && resolve()
    }
    console.log(2)
}).then(function(){
    console.log(5)
});
console.log(3);
```

为什么结果是：1, 2, 3, 5, 4；而不是：1, 2, 3, 4, 5 ？

js 里面有宏任务（macrotask）和微任务（microtask）。因为 setTimeout 是属于 macrotask 的，而整个 script 也是属于一个 macrotask，promise.then 回调是 microtask，执行过程大概如下：

- 由于整个 script 也属于一个 macrotask，由于会先执行 macrotask 中的第一个任务，再加上 promise 构造函数因为是同步的，所以会先打印出 1 和 2；
- 然后继续同步执行末尾的 console.log(3) 打印出 3；
- 此时 setTimeout 被推进到 macrotask 队列中， promise.then 回调被推进到 microtask 队列中；
- 由于在第一步中已经执行完了第一个 macrotask ，所以接下来会顺序执行所有的 microtask，也就是 promise.then 的回调函数，从而打印出 5；
- microtask 队列中的任务已经执行完毕，继续执行剩下的 macrotask 队列中的任务，也就是 setTimeout，所以打印出 4。

---

**防抖与节流**

节流

throttle 的中心思想在于：在某段时间内，不管你触发了多少次回调，我都只认第一次，并在计时结束时给予响应。

```javascript
// fn 是我们需要包装的事件回调, delay 是时间间隔的阈值
function throttle(fn, delay) {
  // last 为上一次触发回调的时间
  let last = 0
  
  // 将 throttle 处理结果当作函数返回
  return function () {
      // 保留调用时的 this 上下文
      let context = this
      // 保留调用时传入的参数
      let args = arguments
      // 记录本次触发回调的时间
      let now = +new Date()
      
      // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
      if (now - last >= delay) {
          // 如果时间间隔大于我们设定的时间间隔阈值，则执行回调
          last = now;
          fn.apply(context, args);
      }
    }
}

// 用 throttle 来包装 scroll 的回调
const better_scroll = throttle(() => console.log('触发了滚动事件'), 1000)

document.addEventListener('scroll', better_scroll)
```

防抖

防抖的中心思想在于：我会等你到底。在某段时间内，不管你触发了多少次回调，我都只认最后一次。


```javascript
// fn  是我们需要包装的事件回调, delay 是每次推迟执行的等待时间
function debounce(fn, delay) {
  // 定时器
  let timer = null
  
  // 将 debounce 处理结果当作函数返回
  return function () {
    // 保留调用时的 this 上下文
    let context = this
    // 保留调用时传入的参数
    let args = arguments

    // 每次事件被触发时，都去清除之前的旧定时器
    if(timer) {
        clearTimeout(timer)
    }
    // 设立新定时器
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

// 用 debounce 来包装 scroll 的回调
const better_scroll = debounce(() => console.log('触发了滚动事件'), 1000)

document.addEventListener('scroll', better_scroll)
```

`用 Throttle 来优化 Debounce`

思想：在 delay 时间内，我可以为你重新生成定时器；但只要 delay 的时间到了，我必须要给用户一个响应。

```javascript
// fn 是我们需要包装的事件回调, delay 是时间间隔的阈值
function throttle(fn, delay) {
  // last 为上一次触发回调的时间, timer 是定时器
  let last = 0, timer = null

  // 将 throttle 处理结果当作函数返回
  return function () { 
    // 保留调用时的 this 上下文
    let context = this
    // 保留调用时传入的参数
    let args = arguments
    // 记录本次触发回调的时间
    let now = +new Date()
    
    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
        // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
        clearTimeout(timer)
        timer = setTimeout(function () {
          last = now
          fn.apply(context, args)
        }, delay)
    } else {
        // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
        last = now
        fn.apply(context, args)
    }
  }
}

// 用新的 throttle 包装 scroll 的回调
const better_scroll = throttle(() => console.log('触发了滚动事件'), 1000)

document.addEventListener('scroll', better_scroll)
```


以上答案来自于：[事件的节流（throttle）与防抖（debounce）](https://juejin.im/book/5b936540f265da0a9624b04b/section/5bb6212be51d451a3f4c3570)

---

手写实现一个简单版本的 promise

```js
// 三个常量用于表示状态
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise(fn) {
    const that = this
    this.state = PENDING

    // value 变量用于保存 resolve 或者 reject 中传入的值
    this.value = null

    // 用于保存 then 中的回调，因为当执行完 Promise 时状态可能还是等待中，这时候应该把 then 中的回调保存起来用于状态改变时使用
    that.resolvedCallbacks = []
    that.rejectedCallbacks = []


    function resolve(value) {
         // 首先两个函数都得判断当前状态是否为等待中
        if(that.state === PENDING) {
            that.state = RESOLVED
            that.value = value

            // 遍历回调数组并执行
            that.resolvedCallbacks.map(cb=>cb(that.value))
        }
    }
    function reject(value) {
        if(that.state === PENDING) {
            that.state = REJECTED
            that.value = value
            that.rejectedCallbacks.map(cb=>cb(that.value))
        }
    }

    // 完成以上两个函数以后，我们就该实现如何执行 Promise 中传入的函数了
    try {
        fn(resolve,reject)
    }cach(e){
        reject(e)
    }
}

// 最后我们来实现较为复杂的 then 函数
MyPromise.prototype.then = function(onFulfilled,onRejected){
  const that = this

  // 判断两个参数是否为函数类型，因为这两个参数是可选参数
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
  onRejected = typeof onRejected === 'function' ? onRejected : e => throw e;

  // 当状态不是等待态时，就去执行相对应的函数。如果状态是等待态的话，就往回调函数中 push 函数
  if(this.state === PENDING) {
      this.resolvedCallbacks.push(onFulfilled)
      this.rejectedCallbacks.push(onRejected)
  }
  if(this.state === RESOLVED) {
      onFulfilled(that.value)
  }
  if(this.state === REJECTED) {
      onRejected(that.value)
  }
}
```

---

#### ES6+ 面试知识文章

- [那些必会用到的 ES6 精粹](https://github.com/biaochenxuying/blog/issues/1)
- [promise、Generator 函数、async 函数的区别与理解](https://blog.csdn.net/deng1456694385/article/details/83831931)
- [Typescript 中的 interface 和 type 到底有什么区别](https://blog.csdn.net/weixin_33724659/article/details/88040828)
- [进大厂必会 20 道 JS 原理题](https://github.com/Geek-James/Blog/issues/27)
- [AST 抽象语法树——最基础的 javascript 重点知识，99% 的人根本不了解](https://segmentfault.com/a/1190000016231512)


---

[⬆️ 返回顶部](#目录)

## 6. webpack


**说下 webpack 的几大特色 ?**

- code splitting（可以自动完成）(根据代码的分割并对文件进行分块)
- loader 可以处理各种类型的静态文件，并且支持串联操作
- webpack 是以 commonJS 的形式来书写脚本滴，但对 AMD/CMD 的支持也很全面，方便旧项目进行代码迁移
- webpack 具有 requireJs 和 browserify 的功能，但仍有很多自己的新特性：
- 对 CommonJS 、 AMD 、ES6 的语法做了兼容
- 对 js、css、图片等资源文件都支持打包
- 串联式模块加载器以及插件机制，让其具有更好的灵活性和扩展性，例如：提供对 CoffeeScript、ES6 的支持
- 有独立的配置文件 webpack.config.js
- 可以将代码切割成不同的 chunk，实现按需加载，降低了初始化时间
- 支持 SourceUrls 和 SourceMaps，易于调试
- 具有强大的 Plugin 接口，大多是内部插件，使用起来比较灵活
- webpack 使用异步 IO 并具有多级缓存。这使得 webpack 很快且在增量编译上更加快

---

**说说对 webpack 的理解，优点、原理、打包的过程**

优点

- 依赖管理：方便引用第三方模块、让模块更容易复用、避免全局注入导致的冲突、避免重复加载或加载不需要的模块。
- 合并代码：把各个分散的模块集中打包成大文件，减少 HTTP 的请求链接数，配合 UglifyJS 可以减少、优化代码的体积。
- 各路插件：babel 把 ES6+ 转译成 ES5 ，eslint 可以检查编译期的错误……

原理

一切皆为模块，由于 webpack 并不支持除 .js 以外的文件，从而需要使用 loader 转换成 webpack 支持的模块，plugin 用于扩展 webpack 的功能，在 webpack 构建生命周期的过程在合适的时机做了合适的事情。

webpack 从构建到输出文件结果的过程

- 解析配置参数，合并从 shell 传入和 webpack.config.js 文件的配置信息，输出最终的配置信息
- 注册配置中的插件，好让插件监听 webpack 构建生命周期中的事件节点，做出对应的反应
- 解析配置文件中 entry 入口文件，并找出每个文件依赖的文件，递归下去
- 在递归每个文件的过程中，根据文件类型和配置文件中 loader 找出相对应的 loader 对文件进行转换
- 递归结束之后得到每个文件最终的结果，根据 entry 配置生成代码 chunk
- 输出所有 chunk 到文件系统

---

- [webpack 系列--浅析 webpack 的原理](https://www.cnblogs.com/chengxs/p/11022842.html)
- [一看就懂之 webpack 原理解析与实现一个简单的 webpack](https://segmentfault.com/a/1190000020353337)

---


[⬆️ 返回顶部](#目录)

## 7. Vue

**对 MVC、MVP 、MVVM 的理解**

MVC 模式的意思是，软件可以分成三个部分。

![](https://upload-images.jianshu.io/upload_images/12890819-1cd8a44ad265101f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


- 视图（View）：用户界面。
- 控制器（Controller）：业务逻辑。
- 模型（Model）：数据保存。

各部分之间的通信方式如下。

![](https://upload-images.jianshu.io/upload_images/12890819-a6cb79a0ba433c50.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


- View 传送指令到 Controller
- Controller 完成业务逻辑后，要求 Model 改变状态
- Model 将新的数据发送到 View，用户得到反馈
- 所有通信都是单向的（逆时针）。

MVP 模式将 Controller 改名为 Presenter，同时改变了通信方向。

![](https://upload-images.jianshu.io/upload_images/12890819-480b96ff581e8cc0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 各部分之间的通信，都是双向的（顺时针）。
- View 与 Model 不发生联系，都通过 Presenter 传递。
- View 非常薄，不部署任何业务逻辑，称为 "被动视图"（Passive View），即没有任何主动性，而 Presenter非常厚，所有逻辑都部署在那里。

MVVM 模式将 Presenter 改名为 ViewModel，基本上与 MVP 模式完全一致。

![](https://upload-images.jianshu.io/upload_images/12890819-51457e62e079b247.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

唯一的区别是，它采用双向绑定（data-binding）：View 的变动，自动反映在 ViewModel，反之亦然。Angular 和 Ember 都采用这种模式。

---
**如何理解 Vue 是异步执行 DOM 更新的 ？**

- Vue 是异步执行 DOM 更新。
- 只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。
- 如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作上非常重要。
- 然后，在下一个的事件循环 `tick` 中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部尝试对异步队列使用原生的 Promise.then 和 MessageChannel，如果执行环境不支持，会采用 setTimeout(fn, 0) 代替。

例如，当你设置 vm.someData = 'new value' ，该组件不会立即重新渲染。

- 当刷新队列时，组件会在事件循环队列清空时的下一个 `tick` 更新。
- 多数情况我们不需要关心这个过程，但是如果你想在 DOM 状态更新后做点什么，这就可能会有些棘手。
- 虽然 Vue.js 通常鼓励开发人员沿着 “数据驱动” 的方式思考，避免直接接触 DOM，但是有时我们确实要这么做。为了在数据变化之后等待 Vue 完成更新 DOM ，可以在数据变化之后立即使用 Vue.nextTick(callback) 。这样回调函数在 DOM 更新完成后就会调用。

---

**深入响应式原理**

如何追踪变化

- 当你把一个普通的 JavaScript 对象传给 Vue 实例的 data 选项，Vue 将遍历此对象所有的属性，并使用 Object.defineProperty 把这些属性全部转 getter/setter。
- Object.defineProperty 是 ES5 中一个无法 shim 的特性，这也就是为什么 Vue 不支持 IE8 以及更低版本浏览器的原因。
- 这些 getter/setter 对用户来说是不可见的，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。这里需要注意的问题是浏览器控制台在打印数据对象时 getter/setter 的格式化并不同，所以你可能需要安装 vue-devtools 来获取更加友好的检查接口。
- 每个组件实例都有相应的 watcher 实例对象，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。
- 观察者订阅了可观察对象，当可观察对象发布事件，则就直接调度观察者的行为，所以这里观察者和可观察对象其实就产生了一个依赖的关系。

![](https://upload-images.jianshu.io/upload_images/12890819-ef98bb2a32114735.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

---

**说下对 Virtual DOM 算法的理解 ？**

包括几个步骤：

- 1、用 JavaScript 对象结构表示 DOM 树的结构，然后用这个树构建一个真正的 DOM 树，插到文档当中；
- 2、当状态变更的时候，重新构造一棵新的对象树，然后用新的树和旧的树进行比较，记录两棵树差异；
- 3、把 2 所记录的差异应用到步骤 1 所构建的真正的 DOM 树上，视图就更新了。

Virtual DOM 本质上就是在 JS 和 DOM 之间做了一个缓存。可以类比 CPU 和硬盘，既然硬盘这么慢，我们就在它们之间加个缓存：既然 DOM 这么慢，我们就在它们 JS 和 DOM 之间加个缓存。CPU（JS）只操作内存（Virtual DOM），最后的时候再把变更写入硬盘（DOM）。

---

**比较两棵虚拟 DOM 树的差异**

比较两棵 DOM 树的差异是 Virtual DOM 算法最核心的部分，这也是所谓的 Virtual DOM 的 diff 算法。
两个树的完全的 diff 算法是一个时间复杂度为 O(n^3) 的问题。但是在前端当中，你很少会跨越层级地移动 DOM 元素。

所以 Virtual DOM 只会对同一个层级的元素进行对比：

![](https://upload-images.jianshu.io/upload_images/12890819-56dd79f34cfb17e8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


上面的 div 只会和同一层级的 div 对比，第二层级的只会跟第二层级对比。这样算法复杂度就可以达到 O(n)。

深度优先遍历，记录差异

在实际的代码中，会对新旧两棵树进行一个深度优先的遍历，这样每个节点都会有一个唯一的标记：

![](https://upload-images.jianshu.io/upload_images/12890819-6161f0fb0e562d6d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


在深度优先遍历的时候，每遍历到一个节点就把该节点和新的的树进行对比。如果有差异的话就记录到一个对象里面。

Virtual DOM 算法主要是实现上面步骤的三个函数：element，diff，patch。然后就可以实际的进行使用：

```javascript
// 1. 构建虚拟 DOM
var tree = el('div', {'id': 'container'}, [
    el('h1', {style: 'color: blue'}, ['simple virtal dom']),
    el('p', ['Hello, virtual-dom']),
    el('ul', [el('li')])
])
// 2. 通过虚拟 DOM 构建真正的 DOM
var root = tree.render()
document.body.appendChild(root)
// 3. 生成新的虚拟 DOM
var newTree = el('div', {'id': 'container'}, [
    el('h1', {style: 'color: red'}, ['simple virtal dom']),
    el('p', ['Hello, virtual-dom']),
    el('ul', [el('li'), el('li')])
])
// 4. 比较两棵虚拟 DOM 树的不同
var patches = diff(tree, newTree)
// 5. 在真正的 DOM 元素上应用变更
patch(root, patches)
```

当然这是非常粗糙的实践，实际中还需要处理事件监听等；生成虚拟 DOM 的时候也可以加入 JSX 语法。这些事情都做了的话，就可以构造一个简单的 ReactJS 了。

---

- [深度剖析：如何实现一个 Virtual DOM 算法](https://segmentfault.com/a/1190000004029168)
- [virtual-dom(Vue实现)简析](https://segmentfault.com/a/1190000010090659)
___

**非父子组件如何通信 ？**

Vue 官网介绍了非父子组件通信方法：

![](https://upload-images.jianshu.io/upload_images/12890819-23f19b695d303662.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


在 bus.js 里面 写入下面信息 

```javascript
import Vue from 'vue'
export default new Vue;
```
在需要通信的组件都引入 Bus.js    

```javascript
<template>
  <div id="emit">
    <button @click="bus">按钮</button>
  </div> 
</template > 
import Bus from './bus.js'
export default {
  data() {
    return {
      message: ''
    }
  },
  methods: {
    bus() {
      Bus.$emit('msg', '我要传给兄弟组件们，你收到没有')
    }
  }
}
```

在钩子函数中监听 msg 事件：

```javascript
<template>
    <div id="on">
      <p>{{message}}</p>
    </div>
</template>
import Bus from './bus.js'
export default {
    data() {
      return {
        message:  ''
      }
    },
    mounted() {　　　
       let self = this
       Bus.$on('msg', (e) => {
         self.message = e
         console.log(`传来的数据是：${e}`)
       })
    }
  }
```

最后 p 会显示来自 $emit 传来的信息。

---

**什么情况下我应该使用 Vuex ？**

- 虽然 Vuex 可以帮助我们管理共享状态，但也附带了更多的概念和框架。这需要对短期和长期效益进行权衡。
- 如果您不打算开发大型单页应用，使用 Vuex 可能是繁琐冗余的。确实是如此，如果您的应用够简单，您最好不要使用 Vuex。一个简单的 [global event bus](https://cn.vuejs.org/v2/guide/components.html#%E7%9B%91%E5%90%AC%E5%AD%90%E7%BB%84%E4%BB%B6%E4%BA%8B%E4%BB%B6) 就足够您所需了。
- 但是，如果您需要构建一个中大型单页应用，您很可能会考虑如何更好地在组件外部管理状态，Vuex 将会成为自然而然的选择。

---

#### Vue 相关图解

Vue 生命周期过程图解

![Vue 生命周期](https://upload-images.jianshu.io/upload_images/12890819-0a4ff52135d24d85.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Vue 响应式原理

![Vue 响应式原理](https://upload-images.jianshu.io/upload_images/12890819-95382ed485f4b937.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Vue 过程图解

![Vue 过程图解](https://upload-images.jianshu.io/upload_images/12890819-4352ccf88d4c9e68.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Vuex

![Vuex](https://upload-images.jianshu.io/upload_images/12890819-a4909259bd32ae9c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

---

在 Vue 2 的实现中，在组件初始化阶段把数据变成响应式时，遇到子属性仍然是对象的情况，会递归执行 Object.defineProperty 定义子对象的响应式；而在 Vue 3 的实现中，只有在对象属性被访问的时候才会判断子属性的类型来决定要不要递归执行 reactive，这其实是一种延时定义子对象响应式的实现，在性能上会有一定的提升。

---

涉及面试题：Proxy 可以实现什么功能？

在 Vue3.0 中将会通过 Proxy 来替换原本的 Object.defineProperty 来实现数据响应式。 Proxy 是 ES6 中新增的功能，它可以用来自定义对象中的操作。

```js
const p = new Proxy(target, handler)
```

target 代表需要添加代理的对象，handler 用来自定义对象中的操作，比如可以用来自定义 set 或者 get 函数。


接下来我们通过 Proxy 来实现一个数据响应式

```js
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value, receiver) {
      setBind(value, property)
      return Reflect.set(target, property, value)
    }
  }
  return new Proxy(obj, handler)
}

let obj = { a: 1 }
let p = onWatch(
  obj,
  (v, property) => {
    console.log(`监听到属性${property}改变为${v}`)
  },
  (target, property) => {
    console.log(`'${property}' = ${target[property]}`)
  }
)
p.a = 2 // 监听到属性a改变
p.a // 'a' = 2
```



#### Vue 经典面试相关文章

- [Vue 生命周期](https://www.jianshu.com/p/304a44f7c11b)
- [详解 Vue 生命周期](https://segmentfault.com/a/1190000011381906)
- [Vue 组件间通信六种方式（完整版）](https://juejin.im/post/5cde0b43f265da03867e78d3)
- [Vue 组件之间 8 种组件通信方式总结](https://blog.csdn.net/zhoulu001/article/details/79548350)
- [Vue 学习笔记-实现一个分页组件](https://www.jianshu.com/p/d17d8e35deda)
- [30 道 Vue 面试题，内含详细讲解（涵盖入门到精通，自测 Vue 掌握程度）](https://www.jianshu.com/p/b1564296a78b)
- [Vue 生命周期和详细的执行过程](https://blog.csdn.net/qq_38021852/article/details/88640807)
- [20+ Vue面试题整理](https://juejin.cn/post/6844904084374290446)
- [12 道vue高频原理面试题,你能答出几道?](https://juejin.cn/post/6844904031983239181)
- [他写出了 Vue，却做不对这十道 Vue 笔试题](https://juejin.cn/post/6870737289736093710)
- [Vue2 原理浅谈](https://juejin.cn/post/6844903506621497358)
- [Vue 最全知识点，面试必备（基础到进阶，覆盖 vue3.0，持续更新整理](https://juejin.cn/post/6844903709055401991)

[⬆️ 返回顶部](#目录)

## 8. React


[必须要会的 50 道 React 面试题](https://segmentfault.com/a/1190000018604138)


[⬆️ 返回顶部](#目录)

## 9. Node

**为什么用 Nodejs，它有哪些优缺点 ？**

优点

- 事件驱动，通过闭包很容易实现客户端的生命活期。
- 不用担心多线程，锁，并行计算的问题
- V8 引擎速度非常快
- 对于游戏来说，写一遍游戏逻辑代码，前端后端通用

缺点

- nodejs 更新很快，可能会出现版本兼容
- nodejs 还不算成熟，还没有大制作
- nodejs 不像其他的服务器，对于不同的链接，不支持进程和线程操作

---

**什么是错误优先的回调函数 ？**

错误优先(Error-first)的回调函数（Error-First Callback）用于同时返回错误和数据。
第一个参数返回错误，并且验证它是否出错；其他参数返回数据。

```javascript
fs.readFile(filePath, function(err, data) {
  if (err) { 
    //handle the error
  } 
  // use the data object 
});
```

---

**如何避免回调地狱 ？**

以下方式避免回调地狱 

- 模块化：将回调函数转换为独立的函数
- 使用流程控制库，例如 [aync]
- 使用 Promise
- 使用 aync/await

---

**如何用 Node 监听 80 端口 ?**

- 这题有陷阱！在类 Unix 系统中你不应该去监听 80 端口，因为这需要超级用户权限。因此不推荐让你的应用直接监听这个端口。
- 目前，如果你一定要让你的应用 80 端口的话，你可以有通过在 Node 应用的前方再添加一层反向代理（例如 nginx）来实现，如下图。否则，建议你直接监听大于 1024 的端口 
- 方向代理指的是以代理服务器来接收 Internet 上的连接请求，然后将请求转发给内部网络上的服务器， 并且将服务器返回的结果发送给客户端。


![](https://upload-images.jianshu.io/upload_images/12890819-6b84636562994190.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

---

**什么是事件循环 ？**

- Node 采用的是单线程的处理机制(所有的 I/O 请求都采用非阻塞的工作方式)，至少从 Node.js 开发者的角度是这样的。而在底层，Node.js 借助 libuv 来作为抽象封装层，从而屏蔽不同操作系统的差异，Node 可以借助 livuv 来实现线程。下图表示 Node 和 libuv 的关系。
![](https://upload-images.jianshu.io/upload_images/12890819-1fe94787d58e751d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- Libuv 库负责 Node API 的执行。它将不同的任务分配给不同的线程，形成一个事件循环，以异步的方式将任务的执行结果返回给 V8 引擎。可以简单用下面这张图来表示。
![](https://upload-images.jianshu.io/upload_images/12890819-8156dafea5e01e46.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 每一个 I/O 都需要一个回调函数 ----- 一旦执行完便堆到事件循环上用于执行。

---


[⬆️ 返回顶部](#目录)

## 10. HTTPS

**HTTP 是什么?**

- HTTP 是基于 TCP/IP（传输控制协议/因特网互联协议，又名网络通讯协议，是 Internet 最基本的协议）的关于数据如何在万维网中如何通信的协议。
- HTTP 的底层是 TCP/IP。

所以 GET 和 POST 的底层也是 TCP/IP，也就是说，GET/POST 都是 TCP 链接。
GET 和 POST 能做的事情是一样一样的。你要给 GET 加上 request body，给 POST 带上 url 参数，技术上是完全行的通的。

- 业界不成文的规定是，(大多数) 浏览器通常都会限制 url 长度在 2K 个字节，而(大多数)服务器最多处理 64K 大小的 url。超过的部分，恕不处理。
- 如果你用 GET 服务，在 request body 偷偷藏了数据，不同服务器的处理方式也是不同的，有些服务器会帮你卸货，读出数据，有些服务器直接忽略，所以，虽然 GET 可以带 request body，也不能保证一定能被接收到哦。
- GET 和 POST 本质上就是 TCP 链接，并无差别。但是由于 HTTP 的规定和浏览器/服务器的限制，导致他们在应用过程中体现出一些不同。



- [关于三次握手和四次挥手，面试官想听到怎样的回答？](https://juejin.cn/post/6978733203062915103)

- [跟着动画来学习TCP三次握手和四次挥手](https://juejin.cn/post/6844903625513238541)


---

**HTTP 中 GET 与 POST 的区别**

- GET 在浏览器回退时是无害的，而 POST 会再次提交请求。 
- GET 产生的 URL 地址可以被 Bookmark，而 POST 不可以。 
- GET 请求会被浏览器主动 cache，而 POST 不会，除非手动设置。
- GET 请求只能进行 url 编码，而 POST 支持多种编码方式。
- GET 请求参数会被完整保留在浏览器历史记录里，而 POST 中的参数不会被保留。 
- GET 请求在 URL 中传送的参数是有长度限制的，而 POST 么有。 
- 对参数的数据类型，GET 只接受 ASCII 字符，而 POST 没有限制。
- GET 比 POST 更不安全，因为参数直接暴露在 URL 上，所以不能用来传递敏感信息。
- GET 参数通过 URL 传递，POST 放在 Request body 中。


GET 和 POST 还有一个重大区别

简单的说：

- GET 产生一个 TCP 数据包;
- POST 产生两个 TCP 数据包。

长的说：

- 对于 GET 方式的请求，浏览器会把 http header 和 data 一并发送出去，服务器响应 200 (返回数据);
- 而对于 POST，浏览器先发送 header，服务器响应 100 continue，浏览器再发送 data，服务器响应 200 ok(返回数据)。

据研究，在网络环境好的情况下，发一次包的时间和发两次包的时间差别基本可以无视。
而在网络环境差的情况下，两次包的 TCP 在验证数据包完整性上，有非常大的优点。
并不是所有浏览器都会在 POST 中发送两次包，Firefox 就只发送一次。

---

**浏览器缓存实现原理**

浏览器缓存将文件保存在客户端，好的缓存策略可以减少对网络带宽的占用，可以提高访问速度，提高用户的体验，还可以减轻服务器的负担。

当一个客户端请求 web 服务器, 请求的内容可以从以下几个地方获取：服务器、浏览器缓存中或缓存服务器中。这取决于服务器端输出的页面信息。页面文件有三种缓存状态。

1. 最新的：选择不缓存页面，每次请求时都从服务器获取最新的内容。
2. 未过期的：在给定的时间内缓存，如果用户刷新或页面过期则去服务器请求，否则将读取本地的缓存，这样可以提高浏览速度。
3. 过期的：也就是陈旧的页面，当请求这个页面时，必须进行重新获取。

页面的缓存状态是由 http header 决定的，一个浏览器请求信息，一个是服务器响应信息。

主要包括 Pragma: no-cache、Cache-Control、 Expires、 Last-Modified、If-Modified-Since。

其中 Pragma: no-cache 由 HTTP/1.0 规定，Cache-Control 由 HTTP/1.1 规定。

Cache-Control 的主要参数：

- A、Cache-Control: private/public，Public 响应会被缓存，并且在多用户间共享。 Private 响应只能够作为私有的缓存，不能在用户间共享。
- B、Cache-Control: no-cache，不进行缓存。
- C、Cache-Control: max-age = x，缓存时间，以秒为单位。
- D、Cache-Control: must-revalidate，如果页面是过期的，则去服务器进行获取。


Expires：显示的设置页面过期时间。

Last-Modified：请求对象最后一次的修改时间，用来判断缓存是否过期，通常由文件的时间信息产生。

If-Modified-Since：客户端发送请求附带的信息，指浏览器缓存请求对象的最后修改日期，用来和服务器端的 Last-Modified 做比较。



[一文读懂前端缓存（好文）](https://juejin.cn/post/6844903747357769742)


---

**说一下 HTTP 协议头字段说上来几个，是否尽可能详细的掌握 HTTP 协议。**

HTTP 协议头字段

- HTTP 的头域包括 `通用头，请求头，响应头和实体头` 四个部分。
- 每个头域由一个域名，冒号（:）和域值三部分组成。
- 域名是大小写无关的，域值前可以添加任何数量的空格符，头域可以被扩展为多行，在每行开始处，使用至少一个空格或制表符。

HTTP 协议

- HTTP 是超文本传输协议的缩写，它用于传送 WWW 方式的数据。
- HTTP 协议采用了请求/响应模型。
- 客户端向服务器发送一个请求，请求头包含请求的方法、URI、协议版本、以及包含请求修饰符、客户 信息和内容的类似于 MIME 的消息结构。
- 服务器以一个状态行作为响应，相应的内容包括消息协议的版本，成功或者错误编码加上包含服务器信息、实体元信息以及可能的实体内容。

---

**一次完整的 HTTP 事务是怎样的一个过程 ？**

- 域名解析
- 发起 TCP 的 3 次握手 
- 建立 TCP 连接后发起 http 请求 
- 服务器响应 http 请求，浏览器得到 html 代码 
- 浏览器解析 html 代码，并请求 html 代码中的资源（如 js、css、图片等）
- 浏览器对页面进行渲染呈现给用户


详情过程请看：[面试题之从敲入 URL 到浏览器渲染完成](https://juejin.im/post/5b9ba9c15188255c8320fe27)

---

**HTTP 状态码知道哪些 ？**

- 100 Continue 继续，一般在发送 post 请求时，已发送了 http header 之后服务端将返回此信息，表示确认，之后发送具体参数信息。 
- `200` OK 正常返回信息 。
- 201 Created 请求成功并且服务器创建了新的资源 。
- 202 Accepted 服务器已接受请求，但尚未处理 。
- 301 Moved Permanently 请求的网页已永久移动到新位置。 
- 302 Found 临时性重定向。 
- 303 See Other 临时性重定向，且总是使用 GET 请求新的 URI。 
- 304 Not Modified 自从上次请求后，请求的网页未修改过。 
- `400` Bad Request 服务器无法理解请求的格式，客户端不应当尝试再次使用相同的内容发起请求。 
- `401` Unauthorized 请求未授权。 
- `403` Forbidden 禁止访问。 
- `404` Not Found 找不到如何与 URI 相匹配的资源。 
- `500` Internal Server Error 最常见的服务器端错误。 
- `503` Service Unavailable 服务器端暂时无法处理请求（可能是过载或维护）。

---

**axios 的特点有哪些 ？**

- axios 是一个基于 promise 的 HTTP 库，支持 promise 的所有 API
- 它可以拦截请求和响应
- 它可以转换请求数据和响应数据，并对响应回来的内容自动转换为 json 类型的数据
- 它安全性更高，客户端支持防御 XSRF

---


相关文章：

- [TCP 协议和 UDP 协议的特点和区别](https://blog.csdn.net/lzj2504476514/article/details/81454754)
- [(纯干货)HTTP／1.0／1.1／2.0的区别以及http和https的区别](https://www.cnblogs.com/NightTiger/p/11334314.html)
- [http & https & http2.0](https://www.cnblogs.com/colima/p/7295771.html)


[⬆️ 返回顶部](#目录)

## 11. 数据结构与算法

**实现两个变量交换值的方法有哪些 ？**

一、使用临时变量的方法

```javascript
var t; 
t = a; 
a = b; 
b = t;
```

首先把 a 的值存储到临时变量中， 
然后 b 赋值给 a， 
最后拿出临时变量中的 a 值赋给 b。

二、一次加，两次减

```javascript
a = a + b; 
b = a - b; 
a = a - b;
```

让 a 先变成 a 与 b 的 ‘和’（也可以换成 a 和 b 的差，一样的）， 
‘和’ 减去 b ，巧妙的得到了 a 的变量值赋予 b ，
再通过 ‘和’ 减去 a 的值，得到了 b 的值赋予 a 。

三、复用对象 

把 a 先变成了一个对象， 
这个对象保存着应该交换后的键值对， 
最后赋值搞定。

```javascript
a = { a: b, b: a }; 
b = a.b; 
a = a.a;
```

四、利用数组

和上面的方法很像，只不过对象换成了数组。

```javascript
a = [a, b]; 
b = a[0]; 
a = a[1];
```

五、一行代码

简单粗暴一行代码交换了 a 和 b 的变量值。

```javascript
a = [b, b = a][0];
```

根据运算符优先级，首先执行 b = a ，
此时的 b 直接得到了 a 的变量值 ，
然后一步数组索引让 a 得到了 b 的值（简直不能再厉害）。

六、ES6 的解构赋值语法 

最后我的方案是利用了 ES6 的解构赋值语法， 
它允许我们提取数组和对象的值，对变量进行赋值 （旧版本浏览器不能使用ES6语法）。

```javascript
[a, b] = [b, a];
```
---

**原生 js 实现斐波那契数列**

说明：
斐波那契数列，以兔子的繁殖的例子而引入，故又称“兔子数列”，指的是这样一个数列：1、1、2、3、5、8、13、21、34、...；
在数学上，斐波那契数列以如下被以递归的方法定义：F(1)=1, F(2)=1, F(n)=F(n-1)+F(n-2)  (n>2，n∈N*)。

一、递归方法

```javascript
function f(n) {
  if (n === 1 || n === 2){
    return 1;
  } else {
    return f(n-1) + f(n-2);
  }
}
console.log(f(6));
```

二、动态规划方法（性能得到优化）

```javascript
function f(n) {
    let n1 = 1,
        n2 = 1,
        sum = 1;
    for(let i = 3; i <= n; i += 1) {
        sum = n1 + n2;
        n1 = n2;    // 往后移动一位数
        n2 = sum
    }
    return sum
}
console.log(f(5));
```

--- 

**求一个数组的最大差值**

原理：遍历一次数组，找到最大值和最小值，返回差值

```javascript
var getMaxProfit = function(arr){
  // 定义两个变量，分别存贮最大值和最小值
  let maxNum = arr[0];
  let minNum = arr[0];
  for(let i = 0; i < arr.length; i++){
    if(arr[i] > maxNum){
      maxNum = arr[i];
    }
    if(arr[i] < minNum){
      minNum = arr[i];
    }
  }
  return maxNum - minNum;
}
```

var max = Math.max.apply(null, array)，这样就可以轻易的得到一个数组中最大的一项
注：在调用 apply 的时候第一个参数给了一个 null，这个是因为没有对象去调用这个方法，我们只需要用这个方法帮我们运算，得到返回的结果就行，所以就直接传递了一个 null 过去。

---

**实现类似 getElementsByClassName 的功能**

自己实现一个函数，查找某个 DOM 节点下面的包含某个 class 的所有 DOM 节点？不允许使用原生提供的 getElementsByClassName、querySelectorAll 等原生提供 DOM 查找函数。

```javascript
function queryClassName(node, name) {  
  var starts = '(^|[ \n\r\t\f])',
       ends = '([ \n\r\t\f]|$)';
  var array = [],
        regex = new RegExp(starts + name + ends),
        elements = node.getElementsByTagName("*"),
        length = elements.length,
        i = 0,
        element;

    while (i < length) {
        element = elements[i];
        if (regex.test(element.className)) {
            array.push(element);
        }
        i += 1;
    }
    return array;
}
```
---

**随机生成指定长度的字符串**

实现一个算法，随机生成指制定长度的字符串。比如给定 长度 8，输出 4ldkfg9j。

原理：可以手动指定字符库及随机字符长度 n，利用 Math.floor() 和 Math.random() 两个方法实现获取随机字符。

```javascript
function randomString(n) {  
  let str = 'abcdefghijklmnopqrstuvwxyz9876543210';
  let tmp = '',
      i = 0,
      l = str.length;
  for (i = 0; i < n; i++) {
    tmp += str.charAt(Math.floor(Math.random() * l));
  }
  return tmp;
}
module.exports = randomString;
```

---

**判断一个单词是否是回文 ？**

回文是指把相同的词汇或句子，在下文中调换位置或颠倒过来，产生首尾回环的情趣，叫做回文，也叫回环。比如 mamam redivider 。

很多人拿到这样的题目非常容易想到用 for 将字符串颠倒字母顺序然后匹配就行了。

其实重要的考察的就是对于 reverse 的实现。

其实我们可以利用现成的函数，将字符串转换成数组，这个思路很重要，我们可以拥有更多的自由度去进行字符串的一些操作。

```javascript
function checkPalindrom(str) {  
    return str == str.split('').reverse().join('');
}
```

---

**二分查找算法**

建立在已经排好序的情况下

```javascript
function binarySearch(arr, data) {
    var end = arr.length - 1,
        start = 0;

    while (start <= end) {
        var middle = Math.floor((start + end) / 2);
        if (arr[middle] > data) {
            end = middle - 1;
        } else if (arr[middle] < data) {
            start = middle + 1;
        } else {
            return middle;
        }
    }
    return -1;

}
var arr = [1, 2, 3, 4, 5, 6];
console.log(binarySearch(arr, 2));
```

---

**写一个方法将数组换成前端更易解析的树状结构**

```javascript
function getTree(data) {
    var newData = [],
        hash = {};
    for (var i = 0; i < data.length; i++) {
        if (!hash[data[i].province]) {
            hash[data[i].province] = {
                'province': data[i].province
            };
            hash[data[i].province]['city'] = [{
                'name': data[i].city,
                'code': data[i].code
            }]
            newData.push(hash[data[i].province]);
        } else if (hash[data[i].province].province == data[i].province) {
            hash[data[i].province]['city'].push({
                'name': data[i].city,
                'code': data[i].code
            })
        }
    }
    return newData;
}
 
var data = [{
    'province': '浙江',
    'city': '温州',
    'code': '10010'
}, {
    'province': '浙江',
    'city': '杭州',
    'code': '10011'
}, {
    'province': '安徽',
    'city': '合肥',
    'code': '10012'
}, {
    'province': '安徽',
    'city': '马鞍山',
    'code': '10013'
}, {
    'province': '浙江',
    'city': '宁波',
    'code': '10014'
}];
console.log(getTree(data));
```

---

**数组去重**

一、 使用 ES6 的 Set 去除数组的重复元素

Array.from() 方法可以将 Set 结构转化为数组结构

```javascript
function dedupe(array) { 
  return Array.from(new Set(array)); 
} 
dedupe([1, 2, 3, 3]);
```

二：扩展运算符（…），内部使用 for…of 循环

```javascript
let arr = [1, 2, 3, 3];
let unique = [...new Set(arr)];
```

三：采用对象数组方法去重

```javascript
function sort(arr){
    let obj = {};
    let newArr = [];
    for(let i = 0; i < arr.length; i++){
        if(!obj[arr[i]]){
            obj[arr[i]] = 1;
            newArr.push(arr[i]);
        }
    }
    return newArr;
}
```

---

**字符串反转**

1、split() 字符串转成数组；
2、reverse() 翻转数组；
3、join() 数组转化成字符串。

```javascript
function reverse(str){
    for(let i = 0; i < str.length; i++){
        return str.split('').reverse().join('');
    }
}
```

---

**产生随机数**

```javascript
function random(n){
    let str = '123asdasdasrwer';
    let obj = '';
    var l = str.length;
    for(let i = 0; i < n; i++){
       return obj += str.charAt(Math.floor(Math.random()*l));
    }
}
```

---

**获取地址栏中某个参数的值**

```javascript
function getUrl(){
    let url = window.location.href();
    let Url = url.split('?');
    if(Url[0] == url){
        return '';
    }
    let obj = {};
    let arr = Url[1].split('&');
    for(let i = 0; i < arr.length; i++){
       let arg = arr[i].split('=');
        obj[arg[0]] = arg[1];
    }
    return obj;
}
var href = getUrl();
console.log(href['name']);

```

---

**统计字符中出现次数最多的字母**

原理：这个和数组去重类似，也是利用一个对象 obj，将数组元素作为对象的属性名，如果不存在该属性名，则值赋为 1，如果存在，则值加 1。

```javascript
function findMaxDuplicateChar(str) {
    if(str.length == 1) {
        return str;
    }
    let charObj = {};
    for(let i = 0; i < str.length; i++) {
        // 利用String的charAt()方法获取各个字符; charAt() 方法可返回指定位置的字符
        if(!charObj[str.charAt(i)]) {
            charObj[str.charAt(i)] = 1;
        }else{
            charObj[str.charAt(i)] += 1;
        }
    }
    let maxChar = '',
            maxValue = 1;
    for(var k in charObj) {
        // 在obj对象中寻找值最大的那个属性
        if(charObj[k] >= maxValue) {
            maxChar = k;
            maxValue = charObj[k];
        }
    }
    return maxChar;
}
```

---

**101 个硬币中有 100 真、1 假，真假区别在于重量。请用无砝码天平称两次给出真币重还是假币重的结论**

方法 1

- 第一步：把硬币分为三堆儿（50，50，1），先拿两个 50 放天平比较，如果相等，说明那个单个的就是假的，再随便拿一个真硬币和这个假硬币放天平比较一下就可得到结果。
- 第二步：如果第一步的两个 50 比较后不相等，此时一端 50 重，一端 50 轻。如果拿轻的一端 50，分成两堆（25，25） 放到天平上，如果这两个 25 相等，则假硬币（重）在重的一端 50 里，否则（不相等）假硬币（轻）在这两个（25，25）里，也就是轻的一端 50 里。

方法 2

- 把硬币分为 A B C 三组，满足如下条件：C > A = B，先比较 A 和 B。如果 A 和 B 一样重，则敏感词在 C 中。
- 从 A+B 中选取和 C 同样数量的真币和 C 比较。
- 如果 A 和 B 重量不等，说明 C 中全为真币，从 C 中选取和 A 一样数量的真币与 A 比较，再结合之前 A B 比较的结果，即可得知敏感词究竟比真币重还是轻。

---

- [查找两个不同元素最近的父节点](https://blog.csdn.net/hhthwx/article/details/79784205)

---

#### JavaScript 数据结构

- [JavaScript 数据结构与算法之美 - 线性表（数组、栈、队列、链表）](https://juejin.im/post/5d187b81e51d4550a629b2c5)

- [JavaScript 数据结构与算法之美 - 栈内存与堆内存 、浅拷贝与深拷贝](https://juejin.im/post/5d1b07716fb9a07efe2dd644)

- [JavaScript 数据结构与算法之美 - 非线性表中的树、堆是干嘛用的 ？其数据结构是怎样的 ？
](https://juejin.im/post/5d2dd6dc6fb9a07eb67dc34b)


#### 十大经典排序算法

- [JavaScript 数据结构与算法之美 - 十大经典排序算法汇总](https://juejin.im/post/5d3ea9a4e51d4561f060cd2d)


[⬆️ 返回顶部](#目录)

## 12. Git

 [Git 的 4 个阶段的撤销更改](https://segmentfault.com/a/1190000011969554)

## 13. 最后

技术博客首发地址  [GitHub](https://github.com/biaochenxuying/blog)。

[⬆️ 返回顶部](#目录)








