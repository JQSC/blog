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


var b={
c:{
    ddd:"asss"
}
}
console.log(b.c.hasOwnProperty("ddd"))