<template>
  <div style="margin: 0 30px">
    <Form :model="formItem" ref="formItem" :label-width="80" :rules="ruleValidate">
      <FormItem label="姓名" prop="name">
        <Input disabled v-model="formItem.name" placeholder="请输入姓名"></Input>
      </FormItem>
      <FormItem label="旧密码" prop="oldpassword">
        <Input type="password" v-model="formItem.oldpassword" placeholder="请输入旧密码"></Input>
      </FormItem>
      <FormItem label="新密码" prop="newpassword">
        <Input type="password" v-model="formItem.newpassword" placeholder="请输入新密码"></Input>
      </FormItem>
      <FormItem>
        <Button @click="upPass" type="primary">提交</Button>
        <Button style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import qs from 'qs'

  export default {
    name: "upPass",
    data() {
      return {
        formItem: {
          name: this.$store.state.user.userName,
          oldpassword: '',
          newpasswoed: ''
        },
        //表单验证
        ruleValidate: {
          name: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
          oldpassword: [{required: true, message: '旧密码不能为空', trigger: 'blur'}],
          newpassword: [{required: true, message: '新密码不能为空', trigger: 'blur'}],
        }
      }
    },
    methods: {
      upPass() {
        //添加修改方法
        this.$refs.formItem.validate((valid) => {
          if (valid) {
            console.log("aa")
            const url = '/upPass'
            this.$axios.post(url, qs.stringify(this.formItem))
              .then(res => {
                this.$Notice.info({
                  title: res.data
                });
                this.formItem = {
                  name: this.$store.state.user.userName,
                  oldpassword: '',
                  newpasswoed: ''
                }
              })
              .catch(res => {
                console.log(res)
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
