<template>
  <div>
    <Card>
      <div style="margin-bottom: 20px">小组成员：李传朋，陈振潮，郝靖宇，许筱毓</div>
      <div >
        <Alert type="success" show-icon>前端技术</Alert>
                    Vue搭建单页面应用程序. &nbsp
                    Iview提供统一的UI样式.&nbsp
                    Webpack负责系统打包.&nbsp
                    Vuex负责状态管理.&nbsp
                    axios负责网络请求.
        <Alert type="success" show-icon>后端技术</Alert>
                    Spring Boot快速构建后端应用.&nbsp
                    集成Spring、SpringMVC、Mybatis框架开发.&nbsp
                    同时使用 通用Mapper、druid、pagehelper、lombok等工具.&nbsp
                    MySQL数据库进行数据存取.&nbsp
        <Alert type="success" show-icon>开发工具</Alert>
                   后端开发使用 IntelliJ IDEA.&nbsp
                    前端开发使用 WebStorm
        <Alert  show-icon>系统部署</Alert>
                 阿里云平台
                 地址：http://www.upower.work:8081
      </div>
    </Card>
  </div>
</template>

<script>

export default {
  name: 'home',
  mounted () {
    //
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
