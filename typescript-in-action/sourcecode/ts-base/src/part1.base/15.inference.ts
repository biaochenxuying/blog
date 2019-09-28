let a = 1;
let b = [1, null, 'a']
let c = {x: 1, y: 'a'}

let d = (x = 1) => x + 1

window.onkeydown = (event) => {
    // console.log(event.button)
}

interface Foo {
    bar: number
}
// let foo = {} as Foo
// let foo = <Foo>{}
let foo: Foo = {
    bar: 1
}
// foo.bar = 1
