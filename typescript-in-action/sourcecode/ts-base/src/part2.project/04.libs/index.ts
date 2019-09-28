import $ from 'jquery'

$('.app').css('color', 'red')

globalLib({x: 1})
globalLib.doSomething()

import moduleLib from './module-lib'
moduleLib({y: 2})
moduleLib.doSomething()

import umdLib from './umd-lib'
umdLib.doSomething()

// 模块插件
import m from 'moment';
declare module 'moment' {
    export function myFunction(): void;
}
m.myFunction = () => {}

// 全局插件
declare global {
    namespace globalLib {
        function doAnyting(): void
    }
}
globalLib.doAnyting = () => {}
