<template>
  <div class="gitalk-container">
    <div id="gitalk-container"></div>
  </div>
</template>
<script>
export default {
  name: 'comment',
  data() {
    return {};
  },
  mounted() {
    let body = document.querySelector('.gitalk-container');
    let script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js';
    body.appendChild(script);
    // console.log('location :', location);
    // console.log('location.pathname :', location.pathname);
    script.onload = () => {
      const commentConfig = {
        clientID: 'XXXX',
        clientSecret: 'XXXX', // come from github development
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
      };
      const gitalk = new Gitalk(commentConfig);
      gitalk.render('gitalk-container');
    };
  },
};
</script>
<style>
@import '../css/gittalk.css';
</style>
 
