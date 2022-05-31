import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css';
import App from './App.vue'
import store from './store'
import router from './router'
// import './assets/css/global.css'
import SvgIcon from '@/components/SvgIcon.vue'// svg组件
import './assets/icon/iconfont.js'
import axios from "axios"
import * as ElIconModules from '@element-plus/icons-vue'
import '@/styles/index.scss'


const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
//全局注册组件
app.component('svg-icon', SvgIcon)
import './icons'
app.config.globalProperties.axios=axios
// 统一注册el-icon图标
for(let iconName in ElIconModules){
    app.component(iconName,ElIconModules[iconName])
}
// vue3.0通过createApp方法创建一个vue对象，并返回，可以通过链式调用使用app对象
app.use(router).use(store).mount('#app')



