class A {
    a: number = 1
}

let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 }
let n = { x, y, ...z }

// n = 1

// 1
// namespace N {
//     export const n = 1
// }

// 2
// let s = <A>{}
let s = {} as A
s.a = 1

// 3
// const enum E { A, B }

// 4
// export = s
