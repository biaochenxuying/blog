import { copy, integrateGitalk, baiduTongJi } from './utils';

export default ({ Vue, options, router }) => {
    try {
        document && (() => {
            integrateGitalk(router)
            copy()
            baiduTongJi(router, () => { document.getElementById('referrer').setAttribute("content", "never"); })
        })()
    } catch (e) {
        console.error(e.message)
    }
}