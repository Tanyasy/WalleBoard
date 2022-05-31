<template>
  <div class='navbar'>
    <el-icon @click="setCollapse">
      <component :is="isCollapse?'Expand':'Fold'"/>
    </el-icon>
    <!--    <svg-icon @click="setCollapse" :icon-class="isCollapse?'unFold':'Fold'" />-->
    <el-breadcrumb separator-class="ArrowRightBold">
      <el-breadcrumb-item v-for="(item, index) in getCurrentRoute()" :key="index" :to="item.path">{{
          item.meta.title
        }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="navbar-right" v-if="state.weatherMsg.forecast">
      <div class="weather">
        <el-tooltip
            :content="state.weatherMsg.forecast[0].type"
            placement="bottom"
            effect="light"
        >
          <svg-icon
              :icon-class="state.weatherMsg.forecast[0].type"
              class-name="card-panel-icon"
          />
        </el-tooltip>

      </div>
      <div class="tempe">
        {{ formatTemp() }}
      </div>

      <el-dropdown @visible-change="changeValue">
        <div class="user-item">
          <el-icon class="el-icon--right">
            <arrow-down/>
          </el-icon>
          <span>{{ userName }} </span>
          <el-avatar :size="45" :src="circleUrl"></el-avatar>

        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-button @click="backToLogin">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-extralog-out"></use>
              </svg>
              退出登录
            </el-button>
          </el-dropdown-menu>
        </template>

      </el-dropdown>
    </div>


  </div>


</template>

<script setup>
import {
  useStore
} from "vuex";
import {
  computed,
  ref,
  reactive, onMounted
} from "vue";
import {
  useRouter
} from "vue-router";
import req from "../http/http";
import axios from "axios";

const store = useStore()
const circleUrl = ref(require("../assets/duck.jpg"))
const rotate = ref(false)
const router = useRouter()
const isCollapse = computed(() => store.state.isCollapse)
const userName = computed(() => store.state.userName)
// 访问一个 mutation
const setCollapse = () => store.commit("setCollapse")
let state = reactive({
  weatherMsg: {}
})
let instance = axios.create({
  baseURL: 'http://wthrcdn.etouch.cn/',//接口统一域名
  timeout: 6000                                                       //设置超时
})

function changeValue(callback) {
  rotate.value = callback
}

function getCurrentRoute() {
  let matched = router.currentRoute.value.matched
  const first = matched[0]
  if (first && first.name != "home") {
    matched = [{
      path: '/home',
      name: 'home',
      meta: {title: "首页"}
    }].concat(matched)
  } else {
    matched = [{
      path: '/home',
      name: 'home',
      meta: {
        title: "首页"
      }
    }
    ]
  }
  return matched
}

function getWeather() {
  let url = "weather_mini?city=深圳"
  instance.get(
      url
  ).then((response) => {
    state.weatherMsg = response.data.data;
  });

}

function formatTemp() {
  if (state.weatherMsg.forecast) {
    let lowT = state.weatherMsg.forecast[0].low
    let highT = state.weatherMsg.forecast[0].high
    return lowT.substring(3) + "~" + highT.substring(3)
  } else {
    return {}
  }
}


function backToLogin() {
    store.commit("setUserName", "")
    sessionStorage.removeItem("token")
    router.push("/login")
}

onMounted(() => {
  getWeather()
})


</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 60px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 16px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  position: relative;

  .el-icon {
    height: 30px;
    width: 30px;
    padding-right: 10px;
  }



  .navbar-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    ::v-deep .navbar-item {
      display: inline-block;
      margin-left: 18px;
      font-size: 22px;
      color: #5a5e66;
      box-sizing: border-box;
      cursor: pointer;
    }

    .weather, .tempe {
      padding-right: 15px;
    }

    .el-dropdown-menu {
  padding: 6px 0;
}

.aa {
  transition: all .2s;
}

.go {
  transform: rotate(180deg);
  transition: all .2s;
}
  }
}


//.head {
//  height: 100%;
//
//  .el-icon {
//    float: left;
//    height: 24px;
//    width: 24px;
//    margin-top: 15px;
//  }
//
//  .el-breadcrumb {
//    float: left;
//    margin: 20px 0 0 20px;
//  }
//}

.user-item {
  /*width: 150px;*/

  &:hover {
    cursor: pointer;
  }

  span {
    float: right;
    line-height: 55px;
    font-weight: 700;
  }

  .el-icon--right {
    height: 60px;
  }

  .el-icon {
    float: right;
    //margin-top: 22px;
    //margin-left: 4px;
    //font-size: 12px;
  }

  > .el-avatar {
    margin: 7px 7px 0 0;
  }
}

.el-button {
  border: white;
  padding: 8px 15px;

  i {
    font-size: 14px;
  }
}



.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  margin-right: 5px;
  margin-bottom: 3px;
}

.card-panel-icon {
  float: left;
  font-size: 25px;
}
</style>>
