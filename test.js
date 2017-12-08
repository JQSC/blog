var myObject = {
    // 给 a 定义一个 getter
    get a() {
        return this._a_;
    },
    // 给 a 定义一个 setter
    set a(val) {
        this._a_ = val * 2;
    }
};
myObject.a = 2;
myObject.a; // 4


var b = {
    c: {
        ddd: "asss"
    }
}
//console.log(b.c.hasOwnProperty("ddd"))


var a = {
    get() {
        console.log("ddd")
    },
    c: "ss"
}

var b = Object.create(a)

function Foo() { /* .. */ }
Foo.prototype.name = "ccc"
function Bar() { /* .. */ }
Bar.prototype = Object.create(Foo.prototype);
var b1 = new Bar("b1");

class P {
    foo() { console.log("P.foo"); }
}
class C extends P {
    foo() {
        // super();
    }
}
var c1 = new C();
//c1.foo(); // "P.foo"

//console.log(typeof(Foo))

class MyClass {
    constructor() {
        this.myProp = "dsds"
        //console.log(this.myProp); // 42  
    }
}

var cc = new MyClass()




var a = "22"

var a = '{"parentid":"parentid"}'
//console.log(JSON.parse(a))

var a = {
    b: 42,
    c: "42",
    d: { name: "csq", age: "2" }
};
//console.log(JSON.stringify( a, null,"---" ));
var dd = false
//console.log(Number(), Boolean(new Boolean( false )))
var c = "2"
//console.log( Boolean(~-11))
//console.log(49.6|0)
//console.log(~~49.44446)


var p = Promise.resolve(21);
p.then(function (v) {
   // console.log(v); // 21 

    // 创建一个promise并返回
    return new Promise(function (resolve, reject) {
        // 引入异步！
        setTimeout(function () {
            // 用值42填充
            resolve(v * 2);
        }, 2000);
    });
})
    .then(null)
    .then(function (v) {
        // 在前一步中的100ms延迟之后运行
        //console.log(v); // 42 
    }); 


    var a =function(){
        var b="cccc"
    }
    var c=a()

    console.log(a(),c)