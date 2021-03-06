[TOC]

# 1. CSS盒模型
### 1.1 基本概念: 标准模型 + IE模型
### 1.2 标准模型: 
+ 宽度和高度只有`content`的内容，不包括`padding`和`border`;
+ `Width = contentWidth`
+ `Height = contentHeight`
		
### 1.3 IE模型
+ 宽度和高度包括`content + padding + border`
+ `Width = borderLeft + paddingLeft + contentWidth + paddingRight + borderRight`
+ `Height = borderTop + paddingTop + contentHeight + paddingBottom + borderBottom`

# 2. 标准模型和IE模型的区别
+ 计算宽度和高度的不同
+ 高度和宽度具体是如何计算的

# 3. CSS如何设置这两种模型
+ `box-sizing:content-box;`标准模型(浏览器默认)
+ `box-sizing:border-box;`IE模型
### 3.1 `box-sizing:content-box;`
+ **content宽度是:100px;**
+ 举例: `<section id="box-sizing"></section>`
+ width:100px;
+ height:100px;
+ padding:10px;
+ border:2px solid blue;(如果不设置颜色与样式，只设置宽度，那么宽度是不显示的。)
+ margin:20px; 
+ background-color: orange;

### 3.2 `box-sizing: border-box;`
+ **content宽度是:76px;**
+ 举例: `<section id="border-sizing"></section>`
+ width:100px;
+ height:100px;
+ padding:10px;
+ border:2px solid blue;(如果不设置颜色与样式，只设置宽度，那么宽度是不显示的。)
+ margin:20px; 
+ background-color: orange;


# 4. JS如何设置获取盒模型对应的宽度和高度
### 4.1 `element.style.width/height`
+ 局限性
+ 不能取到所有的宽度和高度
+ 只能取内联样式的宽和高
### 4.2 `element.currentStyle.width/height`
+ 得到的是渲染后的宽高
+ 只有IE支持
### 4.3 `window.getComputedStyle(element).width/height`
+ 得到的是渲染后的宽高
+ chrome和firefox浏览器支持
### 4.4 `element.getBoundingClientRect().width/height`
+ 能够拿到元素及时的宽和高
+ 场合: 计算元素的绝对位置，根据是浏览器的视窗，得到的是top,left,bottom,right四个值

# 5. 实例题(根据盒模型解释边距重叠)
+ 块级元素，内嵌一个块级元素
+ 子元素的高度是100px
+ 子元素与父元素的上边距是10px
+ 计算父元素的实际高度
+ 父元素的高度是100px，或者是110px
    + overflow:hidden;
    + 兄弟元素边距重叠

# 6. `BFC(Block Format Context块级格式化上下文)`(边距重叠解决方案)，还有一个`IFC`(内联元素格式化上下文)
### 6.1 基本概念: 快速解决边距重叠问题，块级格式化上下文。
### 6.2 `BFC`的原理，即渲染规则
+ `BFC`元素的垂直方向的边距发生重叠
+ `BFC`的区域不会与浮动元素的`box`重叠，清除浮动
+ `BFC`在页面上是一个独立的容器，外边的元素不会和内部元素互相影响
+ 计算`BFC`高度，浮动元素也会参与计算。

### 6.3 如何创建`BFC`？
+ `float`不为`none`;只要设置了浮动，就创建了一个`BFC`。
+ `position`的值不为`static`或者`relative`，就创建了`BFC`。
+ `display`属性是与table相关的。
+ `overflow`不为`visiablity`，也可以创建`BFC`。

### 6.4 BFC的应用场景有哪些？
