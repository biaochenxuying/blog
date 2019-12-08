<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css">
<script src="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js"></script>
<div id="gitalk-container"></div>
<script>
  var gitalk = new Gitalk({
    clientID: '8b4874ef9c4e8ae01d93',
    clientSecret: '179bc73b59726fd3effe06814d3b7de2c092fb97', // come from github development
    repo: 'blog',
    owner: 'biaochenxuying',
    // 这里接受一个数组，可以添加多个管理员，可以是你自己
    admin: ['biaochenxuying'],
    // id: 'comment',
    // id: decodeURI(path),      // 每个页面根据 url 生成对应的 issue，保证页面之间的评论都是独立的
    // id 用于当前页面的唯一标识，一般来讲 pathname 足够了，
    // 但是如果你的 pathname 超过 50 个字符，GitHub 将不会成功创建 issue，此情况可以考虑给每个页面生成 hash 值的方法.
    id: location.pathname,
    language: 'zh-CN',
    distractionFreeMode: false,
  });
  gitalk.render("gitalk-container");
</script>
