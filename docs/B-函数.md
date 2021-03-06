[TOC]

# 1.函数部分

+ 函数是对象，函数名是指针
+ `arguments`的主要用途是保存函数参数，它有一个属性`callee`(被召者; 受话人)，该属性是一个指针，指向拥有这个`arguments`对象的函数(`arguments.callee`指向正在执行的函数的指针)。
```javascript
function factorial(num){
    if(num<=1){
        return 1;
    }else{
        return num*factorial(num-1);
    }
}
//使用arguments.callee,消除紧密耦合
function factorial(num){
    if(num<=1){
        return 1;
    }else{
        return num*arguments.callee(num-1);
    }
}   

//严格模式下会报错
var factorial=(function f(num){
    if(num<=1){
        return 1;
    }else{
        return num*f(num-1);
    }
})
```

+ `caller`返回一个调用当前函数的引用，如果是由顶层调用的话，那么将会返回`null`.
严格模式下，`callee`和`caller`都不能使用，而且不能为`caller`属性赋值。
```javascript
function outer(){
    inner()
}   
function inner(){
    alert(inner.caller);
}
outer();
//采用arguments.callee.caller
function outer(){
    inner();
}
function inner(){
    alert(arguments.callee.caller);
}
outer();
```

# 2.面向对象编程
**创建对象**
## 2.1 工厂模式
```javascript
function createPerson(name,age,job){
    var o={};
    o.name=name;
    o.age=age;
    o.job=job;
    o.sayName=function(){
        console.log(this.name);
    };
    return o;
}
```
## 2.2 构造函数模式
+ 没有显式创建对象
+ 直接将属性和方法赋值给了`this`对象
+ 没有`return`语句
```javascript
function Person(name,age,job){
    this.name=name;
    this.age=age;
    this.job=job;
    this.sayName=function(){
        console.log(this.name)
    };
}
var person1=new Person("jack",25,"coder");
console.log(person1.constructor===Person);//true
console.log(person1 instanceof Person);//true
console.log(person1 instanceof Object);//true
//针对构造函数里边的方法，不需要将方法写在构造函数里边，可以通过函数定义转移到狗杂函数外部来解决这个问题
function Person(name,age,job){
    this.name=name;
    this.age=age;
    this.job=job;
    this.sayName=sayName;
}
function sayName(){
    console.log(this.name);
}
```
问题来了，如果要是有多个方法，那么就需要定义很多个全局函数，这样的构造函数缺乏封装性，可以通过原型模式解决。
## 2.3 原型模式
```ecmascript 6
function Person(){}
Person.prototype.name="Jack";
Person.prototype.age=29;
Person.prototype.job="coder";
Person.prototype.sayName=function(){
    console.log(this.name);
}
let person1=new Person();
let person2=new Person();
person1.sayName===person2.sayName;//true
person1.name="Sherry";
console.log(person1.name);//Sherry
console.log(person2.name);//Jack
delete person1.name;
console.log(person1.name);//Jack

//避免每次都写Person.prototype.xxx=xxx;
function Person(){}
Person.prototype={
    constructor:Person,
    //如果不手动设置constructor属性，那么他将不会指向person
    name:"jack",
    age:22,
    job:"coder",
    sayName:function(){
        console.log(this.name);
    }
}
``` 
## 2.4 原型模式的最大问题是由共享的本质引起的
```javascript
function Person(){}
Person.prototype={
    name:"jack",
    age:18,
    job:"coder",
    friends:["Tom","Jerry"],
    sayName:function(){
        console.log(this.name);
    }
}
var person1=new Person();
var person2=new Person();

person1.friends.push("Alex");
console.log(person1.friends);//["Tom", "Jerry", "Alex"]
console.log(person2.friends);//["Tom", "Jerry", "Alex"]
console.log(person1.friends===person2.friends);//true
```
## 2.5 混合使用构造函数和原型模式
```javascript
function Person(name,age,job){
    this.name=name;
    this.age=age;
    this.job=job;
    this.friends=["Tom","Jerry"];
}
Person.prototype={
    contructor:Person,
    sayName:function(){
        console.log(this.name);
    }
}
var person1=new Person("Nick",24,"Teacher");
var person2=new Person("Frank",21,"Student");

person1.friends.push("Sam");

console.log(person1.friends);// ["Tom", "Jerry", "Sam"]
console.log(person2.friends);// ["Tom", "Jerry"]
```
## 2.6 寄生构造函数模式
```javascript
function Person(name,age,job){
    var o=new Object();
    o.name=name;
    o.age=age;
    o.job=job;
    o.sayName=function(){
        console.log(this.name);
    }
    return o;
}

var friends=new Person("Nick",25,"Programmer");
friends.sayName();//Nick
```
## 2.7 稳妥构造函数模式
```javascript
function Person(name,age,job){
    var o=new Object();
    o.sayName=function(){
        console.log(name);
    }
    return o;
}
var friend=Person("JACK",25,"coder");
friend.sayName();
```
# 3. 继承
## 3.1 组合继承
```javascript
function SuperType(name){
    this.name=name;
    this.colors=["red","orange","green"];
}
SuperType.prototype.sayName=function(){
    console.log(this.name);
}
function SubType(name,age){
    //继承属性
    SuperType.call(this,name);
    this.age=age;
}
//继承方法
SubType.prototype=new SuperType();
SubType.prototype.constructor=SubType;
SubType.prototype.sayAge=function(){
    console.log(this.age);
}

var instancel=new SubType("jack",25);
instance1.colors.push("blank");
console.log(instance1.colors);
instance1.sayName();
instance1.sayAge();

var instance2=new SubType("Grek",21);
console.log(instance2.colors);
instance2.sayName();
instance2.sayAge();
```
# 4. 闭包
## 4.1 
+ 闭包是有权访问另一个函数作用于中的变量的函数。
```javascript
function createFunctions(){
    var result=new Array();
    for(var i=0;i<10;i++){
        result[i]=function(){
            return i;
        }
    }
    console.log(result);
    return result;
}
createFunctions();
//采用闭包的形式
function createFunctions(){
    var result=new Array();
    for(var i=0;i<10;i++){
        result[i]=fun0ction(num){
            return function(){
                return num;
            }
        }(i)
    }
    console.log(result);
    return result;
}
createFunctions();
```