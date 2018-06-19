# vueConfig
vue 项目中常用统一配置文件

## JS

### http.js

axios 请求封装，包括如下功能：

* 请求表头添加 token
* 响应状态为 401，跳到登陆页面
* 请求 error，提示请求失败（使用 Element-UI 的 Message）
* 接口返回 data 的 code 不是成功 code，提示接口返回的错误信息（使用 Element-UI 的 Message），并 reject 掉 promise
* 添加贪婪型 get 请求方法 `greedGet`，若多次请求同一地址，abort 前面的请求

### rem.js

移动端 rem 适配。以**设计图**的 1rem = 100px 为基准，设置 html 的 font-size 为 `100 * (clientWidth / designWidth) + 'px'`

> 需按照设计图修改 `designWidth`

### bridge.js

使用 WebViewJavascriptBridge，实现前端与 IOS 端沟通

### swiper-mixin（待完善）

使用 vue-awesome-swiper 实现 tab 页左右滑动

## SCSS

### common.scss

* 1 像素 border-bottom

## plugins

插件

### scrollbar

为实现固定表头和列的表格，改写 element-ui 的 scrollbar，使之可以支持固定位置的内容

### LongTap

自定义长按事件插件，添加长按指令 `v-longtap`，具体使用方式查看 `plugins/LongTap/readme.md`