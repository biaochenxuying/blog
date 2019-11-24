import { copy, integrateGitalk, baiduTongJi } from './utils';

export default ({
    Vue, // VuePress 正在使用的 Vue 构造函数
    options, // 附加到根实例的一些选项
    router, // 当前应用的路由实例
    siteData // 站点元数据
}) => {
    Vue.mixin({
        mounted: function () {
            if (!window.init) {
                integrateGitalk(router)
                copy()
            }
            setTimeout(() => {
                if (!window.init) {
                    // integrateGitalk(router)
                    // copy()
                    // baiduTongJi(router, () => { document.getElementById('referrer').setAttribute("content", "never"); })
                    document.getElementById('referrer').setAttribute("content", "never");
                    window.init = 1;
                }
            }, 500)
        }
    });

}