# 1. Virtual DOM 虚拟DOM
+ VDOM是vue和react的核心
+ VDOM比较独立，使用起来相对简单
+ vue和react中VDOM的实现

# 2. 问题
+ VDOM是什么？为何会存在VDOM？
+ VDOM如何应用，核心API的使用
+ diff算法

# 3. 什么是VDOM，为何使用VDOM
### 3.1 什么是VDOM
+ Virtual DOM，虚拟DOM
+ 用JS模拟DOM结构
+ DOM变化的对比，放在JS层来做(图灵完备语言)
+ 提高重绘性能
+ 将DOM对比操作放在JS层，提高效率

+ 举例：真实的DOM
```html
<ul class="list">
    <li class="item">Item 1</li>
    <li class="item">Item 2</li>
</ul>
```
+ 举例：虚拟dom
```
{
	tag: 'ul',
	attrs: {
		id: 'list',
		children: [
			{
				tag: 'li',
				attrs: {
					className: 'item'
				},
				children: ['Item 1']
			},
			{
				tag: 'li',
				attrs: {
						className: 'item'
				},
				children: ['Item 2']
			}
		]
	}
}
```

### 3.2 设计一个需求场景
+ 需求
+ 1. 将该数据展示成一个表格
+ 2. 任意修改一个信息，表格也跟着修改
```
[{
    name: '张三',
    age: 20,
    address: '北京'
},
{
    name: '李四',
    age: 21,
    address: '上海'
}, 
{
    name: '王五',
    age: 22,
    address: '广州'
}]
```
### 3.3 用jQuery实现
```javascript
$(function () {
	const data = [{
		name: '张三',
		age: 20,
		address: '北京'
	},
	{
			name: '李四',
			age: 21,
			address: '上海'
	},
	{
			name: '王五',
			age: 22,
			address: '广州'
	}];
	
	// 渲染dom
	function render(data) {
		let $container = $('#container');
		$container.html('');
		let $table = $('<table>');
		$table.append($('<tr><td>name</td><td>age</td><td>address</td></tr>'));
		data.forEach((item) => {
			$table.append($('<tr><td>' + item.name + '</td><td>' + item.age + '</td><td>' + item.address + '</td></tr>'));
			$container.append($table);
		});
	}
	
	// 修改信息
	$('#btn-change').click(function () {
		data[1].age = 30;
		data[2].address = '深圳';
		render(data);
	});
	
	render(data);
});
```
### 3.4 遇到的问题
+ DOM操作是昂贵的，JS的运行效率高
+ 尽量减少DOM操作，而不是推倒重来
+ 项目越复杂，影响就越严重
+ VDOM可以解决这个问题

# 4. VDOM如何应用，核心API是什么
+ 介绍snabbdom
+ 重新做jQuery的virtual dom
+ 核心API

```javascript
var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default, // attaches event listeners
]);
var h = require('snabbdom/h').default; // helper function for creating vnodes

var container = document.getElementById('container');

var vnode = h('div#container.two.classes', {on: {click: someFn}}, [
  h('span', {style: {fontWeight: 'bold'}}, 'This is bold'),
  ' and this is just normal text',
  h('a', {props: {href: '/foo'}}, 'I\'ll take you places!')
]);
// Patch into empty DOM element – this modifies the DOM as a side effect
patch(container, vnode);

var newVnode = h('div#container.two.classes', {on: {click: anotherEventHandler}}, [
  h('span', {style: {fontWeight: 'normal', fontStyle: 'italic'}}, 'This is now italic type'),
  ' and this is still just normal text',
  h('a', {props: {href: '/bar'}}, 'I\'ll take you places!')
]);
// Second `patch` invocation
patch(vnode, newVnode); // Snabbdom efficiently updates the old view to the new state
```

# 5. snabbdom的h函数
+ h函数
```javascript
var vnode = h('ul#list', {}, [
	h('li.item', {}, 'Item 1'),
	h('li.item', {}, 'Item 2')
]);
```
+ 模拟的节点
```
{
	tag: 'ul',
	attrs: {
		id: 'list',
		children: [
			{
				tag: 'li',
				attrs: {
					className: 'item'
				},
				children: ['Item 1']
			},
			{
				tag: 'li',
				attrs: {
						className: 'item'
				},
				children: ['Item 2']
			}
		]
	}
}
```

# 5.1 snabbdom的patch函数
```javascript
let vnode = h('ul#list', {}, [
	h('li.item', {}, 'Item 1'),
	h('li.item', {}, 'Item 2')
]);
let container = document.getElementById('container');
patch(container, vnode);

let btnChange = documen.getElementById('btn-change');
btnChange.addEventListener('click', () => {
	let newVnode = h('ul#list', {}, [
		h('li.item', {}, 'Item 111'),
		h('li.item', {}, 'Item 222'),
		h('li.item', {}, 'Item 333')
	]);
	patch(vnode, newVnode);
});
```
# 5.2 核心API
+ h函数`h(标签名, 属性, [子元素])`
+ h函数`h(标签名, 属性, '...')`
+ patch函数初次渲染`patch(container, vnode);`
+ patch函数re-render`patch(vnode, newVnode);`

# 5.3 diff算法
+ 什么是diff算法(linux的基础命令)
+ 去繁就简
+ VDOM为何用diff算法(找出需要更新的节点)
+ diff算法的实现流程(`patch(container, vnode)`和`patch(vnode, newVnode)`);
+ 核心逻辑(createElement, updateChildren)

# 5.4 去繁就简
+ diff算法非常复杂，实现难度很大，源码量很大
+ 去繁就简，理解核心流程，不关心细节
+ 去繁就简之后，依然很复杂很难

# 5.5 VDOM为何使用diff算法
+ DOM操作是昂贵的，因此尽量减少DOM操作
+ 找出本次DOM必须跟新的节点类更新，其他的不更新
+ “找出”的过程，就需要diff算法

# 5.6 diff实现过程
+ `patch(container, vnode);`
+ `patch(vnode, newVnode);`
+ vnode
```
 {
    tag: 'ul',
    attrs: {
        id: 'list'
    },
    children: [{
        tag: 'li',
        attrs: {
            className: 'item'
        },
        children: ['Item 1']
    }]
}
```
+ 真实的DOM
```html
<ul id="list">
<li class="item">Item 1</li>
</ul>
```
+ patch算法
```javascript
function createElement(vnode) {
	let tag = vnode.tag;
	let attrs = vnode.attrs || {};
	let children = vnode.children || [];
	if (!tag) {
		return null;
	}
	
	// 创建元素
	let elem = document.createElement(tag);
	
	// 属性
	let attrName = '';
	for (attrName in attrs) {
		if (attrs.hasOwnProperty(attrName)) {
			elem.setAttribute(attrName, attrs[attrName]);
		}
	}
	
	// 子元素
	children.forEach((childVnode) => {
		// 递归调用 createElement 创建子元素
		elem.appendChild(createElement(childVnode));
	});
	
	// 返回真实的DOM元素 
	return elem;
}

function updateChildren(vnode, newVnode) {
	let children = vnode.children || [];
	let newChildren = newVnode.children || [];

	// 遍历现有的children
	children.forEach((child, index) => {
		let newChild = newChildren[index];
		if (newChild == null) {
			return;
		}
		if (child.tag === newChild.tag) {
			// 两者的tag节点一样
			updateChildren(child, newChild);
		} else {
			// 两者的tag节点不一样
			replaceNode(child, newChild);
		}
	});
}

function replaceNode(vnode, newVnode) {
	let elem = vnode.elem; // 真实的DOM节点
	let newElem = createElement(newVnode);
}
```
# 6. 其他
+ 节点新增和删除
+ 节点重新排序
+ 节点属性，样式，事件绑定
+ 如何极致的压榨性能
+ ...

# 7. diff实现过程
+ patch();
+ createElement();
+ updateChildren();

# 8. VDOM如何使用，核心函数
+ 以snabbdom用法举例
+ 核心API: h函数，patch函数

# 9. diff算法是什么，为什么使用diff算法
+ 什么是diff算法，linux的基础命令
+ VDOM中应用diff算法时为了找出需要更新的节点
+ 实现`patch(container, vnode)`和`patch(vnode, newVnode)`
+ 核心逻辑`createElement`和`updateChildren`