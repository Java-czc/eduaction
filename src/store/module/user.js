import {setToken, getToken} from '@/libs/util'
import Axios from 'axios'
import  { Notice } from 'iview'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false
  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId(state, id) {
      state.userId = id
    },
    setUserName(state, name) {
      state.userName = name
    },
    setAccess(state, access) {
      state.access = access
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    }
  },
  actions: {
    // 登录
    handleLogin({commit}, {userName, password}) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        const url = 'http://localhost:8081/login'
        Axios.get(url, {params: {userName: userName, password: password}})
          .then(res => {
            console.log(res)
            if(res.data.status===200){
              const data = res.data.data
              commit('setToken', data)
              resolve()
            }else {
              Notice.error({title: res.data.msg})
            }
          })
          .catch(res => {
            console.log(res)
            reject(res)
          })
      })
    },
    // 退出登录
    handleLogOut({state, commit}) {
      return new Promise((resolve, reject) => {
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        commit('setToken', '')
        commit('setAccess', [])
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo({state, commit}) {
      return new Promise((resolve, reject) => {
        try {
          const url = 'http://localhost:8081/get_info'
          Axios.get(url, {params: {token: state.token}})
            .then(res => {
              const data = res.data
              commit('setAvator', data.avator)
              commit('setUserName', data.name)
              commit('setUserId', data.user_id)
              commit('setAccess', data.access)
              commit('setHasGetInfo', true)
              resolve(data)
            })
            .catch(res => {
              console.log(res)
              reject(res)
            })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
