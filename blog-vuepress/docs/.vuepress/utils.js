export function copy() {
    function addCopy(e) {
        let copyTxt = ""
        e.preventDefault(); // 取消默认的复制事件
        copyTxt = window.getSelection(0).toString()
        copyTxt = `${copyTxt}\n作者：夜尽天明\n原文：${window.location.href}\n著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。`
        const clipboardData = e.clipboardData || window.clipboardData
        clipboardData.setData('text', copyTxt);
    }
    document.addEventListener("cut", e => {
        addCopy(e)
    });
    document.addEventListener("copy", e => {
        addCopy(e)
    });
}

export function baiduTongJi(router, callback) {
    var _hmt = _hmt || [];
    // (function() {
    //   var hm = document.createElement("script");
    //   hm.src = "https://hm.baidu.com/hm.js?82d755d3a2e0a4df9c27c4c5895a4a81";
    //   var s = document.getElementsByTagName("script")[0];
    //   s.parentNode.insertBefore(hm, s);
    // })();

    const scriptBaiduTongJi = document.createElement('script');
    scriptBaiduTongJi.src = 'https://hm.baidu.com/hm.js?82d755d3a2e0a4df9c27c4c5895a4a81';
    document.body.appendChild(scriptBaiduTongJi);

    router.afterEach((to) => {
        if (scriptBaiduTongJi.onload) {
            callback && callback();
        } else {
            scriptBaiduTongJi.onload = () => {
                lcallback && callback();
            }
        }
    })
}

export function integrateGitalk(router) {
    const linkGitalk = document.createElement('link');
    linkGitalk.href = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css';
    linkGitalk.rel = 'stylesheet';
    document.body.appendChild(linkGitalk);
    const scriptGitalk = document.createElement('script');
    scriptGitalk.src = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js';
    document.body.appendChild(scriptGitalk);

    router.afterEach((to) => {
        if (scriptGitalk.onload) {
            loadGitalk(to);
        } else {
            scriptGitalk.onload = () => {
                loadGitalk(to);
            }
        }
    });

    function loadGitalk(to) {
        console.log('to :', to)
        let commentsContainer = document.getElementById('gitalk-container');
        if (!commentsContainer) {
            commentsContainer = document.createElement('div');
            commentsContainer.id = 'gitalk-container';
            commentsContainer.classList.add('content');
        }
        const $page = document.querySelector('.page');
        if ($page) {
            $page.appendChild(commentsContainer);
            if (typeof Gitalk !== 'undefined' && Gitalk instanceof Function) {
                renderGitalk(to.path);
            }
        }
    }
    function renderGitalk(path) {
        const gitalk = new Gitalk({
            clientID: 'XXXX',
            clientSecret: 'XXXX', // come from github development
            repo: 'blog',
            owner: 'biaochenxuying',
            admin: ['biaochenxuying'],
            // id: 'comment',
            id: decodeURI(path),      // 每个页面根据 url 生成对应的 issue，保证页面之间的评论都是独立的
            distractionFreeMode: false,
            language: 'zh-CN',
        });
        gitalk.render('gitalk-container');
    }
}
