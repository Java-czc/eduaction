<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录教务管理系统" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="startverify"></login-form>
        </div>
      </Card>
    </div>
    <div style="position: absolute;bottom: 20px;width: 100%;text-align: center;color: #eeeeee">Copyright 2019 课设12组</div>
    <Modal v-model="modal" width="360" footer-hide>
      <p slot="header" style="color:#ffd443;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>表单验证</span>
      </p>
      <div style="text-align:center">
        <slide-verify :l="42"
                      :r="10"
                      :w="330"
                      :h="155"
                      slider-text="拖动左边滑块完成上方拼图"
                      @success="onSuccess"
                      @fail="onFail"
                      @refresh="onRefresh"
        ></slide-verify>
        <div>{{msg}}</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import LoginForm from '_c/login-form'
  import {mapActions} from 'vuex'

  export default {
    data() {
      return {
        msg: '',
        modal: false,
        userName: '',
        password: ''
      }
    },
    components: {
      LoginForm
    },
    methods: {
      ...mapActions([
        'handleLogin',
        'getUserInfo'
      ]),
      startverify({userName, password}) {
        this.userName = userName
        this.password = password
        this.modal = true
      },
      onSuccess() {
        this.modal = false
        this.onRefresh()
        //登录逻辑
        this.handleLogin({"userName": this.userName, "password": this.password}).then(res => {
          this.getUserInfo().then(res => {
            this.$router.push({
              name: this.$config.homeName
            })
          })
        })
      },
      onFail() {
        this.msg = '请重新验证!'
      },
      onRefresh() {
        this.msg = ''
      }
    },
    mounted(){
      this.$Notice.success({
        title: '测试账号',
        desc:'管理员lcp,教师teacher,学生student.密码皆为123456.'
      });
    }
  }
</script>

<style>

</style>
