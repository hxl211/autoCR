import {defineUserConfig} from 'vuepress'
import {defaultTheme} from 'vuepress'

export default defineUserConfig({

    lang: 'zh-CN',
    base: '/doc/autocr',
    description: 'cr机器人',
    title: 'cr机器人文档说明（黄晓龙）',
    theme: defaultTheme({


        // 默认主题配置
        navbar: [

            {
                text: '首页',
                link: '/',
            },
        ],

    }),
})
