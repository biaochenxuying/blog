module.exports = {
    title: 'Hello VuePress',
    description: 'Just playing around',
    base: '/blog/',
    head: [
        [
            'link',
            {
                rel: 'icon',
                href: '/favicon.ico'
            }
        ]
    ],
    configureWebpack: {
        resolve: {
            alias: {
                '@alias': '/'
            }
        }
    },
    themeConfig: {
        logo: '/assets/user-logo.jpeg',
        navbar: true,
        sidebar: 'auto',
        search: true,
        searchMaxSuggestions: 10,
        lastUpdated: 'Last Updated', // string | boolean
        // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
        repo: 'biaochenxuying/blog',
        // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
        // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
        repoLabel: '查看源码',
        smoothScroll: true,
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide/' },
            //   { text: 'External', link: 'https://google.com' },
            {
                text: 'Views', link: '/views/'
            },
            {
                text: 'pages',
                items: [
                    { text: 'page-a', link: '/views/page-a/' },
                    { text: 'page-b', link: '/views/page-b/' }
                ]
            }
        ],
        sidebar: {
            '/guide/': [
                '',     /* /guide/ */
                // 'page-a',     /* /views/page-a/ */
                // 'page-b',     /* /views/page-b/ */
                {
                    title: '指南',
                    collapsable: false,
                    children: [
                        '/guide/page-a.md',     /* /views/page-a/ */
                        '/guide/page-b.md',     /* /views/page-b/ */
                    ],
                },
            ],
            '/views/': [
                '',     /* /views/ */
                {
                    title: 'GitHub',
                    collapsable: false,
                    children: [
                        '/views/github/follow.md',
                        '/views/github/star.md',
                    ],
                },
                {
                    title: '算法',
                    collapsable: false,
                    children: [
                        '/views/algorithms/10algo.md',
                    ],
                },
                // 'page-a',     /* /views/page-a/ */
                // 'page-b',     /* /views/page-b/ */
            ],
        }
    },
    locales: {
        // 键名是该语言所属的子路径
        // 作为特例，默认语言可以使用 '/' 作为其路径。
        '/': {
            lang: 'zh-CN',
            title: '全栈修炼',
            //   description: 'Vue 驱动的静态网站生成器'
        },
        '/en/': {
            lang: 'en-US', // 将会被设置为 <html> 的 lang 属性
            title: 'Full stack exercise',
            //   description: 'Vue-powered Static Site Generator'
        },
    },
    plugins: [
        '@vuepress/last-updated',
        '@vuepress/back-to-top',
        '@vuepress/active-header-links',
        '@vuepress/google-analytics',
        {
            'ga': '' // UA-00000000-0
        },
        '@vuepress/medium-zoom',
        '@vuepress/nprogress'
    ]
}