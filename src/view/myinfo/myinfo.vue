<template>
  <div style="margin: 0 30px">
    <Form :model="formItem" ref="formItem" :label-width="80" :rules="ruleValidate">
      <Row>
        <Col span="12">
          <input type="hidden" v-model="formItem.password">
          <input type="hidden" v-model="formItem.roles">
          <Divider orientation="left">基本信息</Divider>
          <FormItem label="姓名" prop="name">
            <Input v-model="formItem.name" placeholder="请输入姓名"></Input>
          </FormItem>
          <FormItem label="性别">
            <RadioGroup v-model="formItem.sex">
              <Radio label="男">男</Radio>
              <Radio label="女">女</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="身份证号" prop="idcard">
            <Input v-model="formItem.idcard" placeholder="请输入身份号"></Input>
          </FormItem>
          <FormItem label="生日">
            <DatePicker type="date" placeholder="Select date" v-model="formItem.birthday"></DatePicker>
          </FormItem>
          <FormItem label="联系电话" prop="tel">
            <Input v-model="formItem.tel" placeholder="请输入联系电话"></Input>
          </FormItem>
          <FormItem label="家庭地址" prop="address">
            <Input type="text" v-model="formItem.address" placeholder="请输入家庭地址"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <Divider orientation="left">工作信息</Divider>
          <FormItem v-if="formItem.departname!=null && formItem.access==='[teacher]'" label="院系">
            <Select v-model="formItem.departname">
              <Option value="理工学院">理工学院</Option>
              <Option value="中医学院">中医学院</Option>
              <Option value="药学院">药学院</Option>
              <Option value="体育学院">体育学院</Option>
              <Option value="管理学院">管理学院</Option>
            </Select>
          </FormItem>
          <FormItem v-if="formItem.majorname!=null" label="专业">
            <Select v-model="formItem.majorname">
              <Option value="计算机科学与技术">计算机科学与技术</Option>
              <Option value="生物医学工程">生物医学工程</Option>
              <Option value="中医学">中医学</Option>
              <Option value="生物制药">生物制药</Option>
            </Select>
          </FormItem>
          <FormItem v-if="formItem.degree!=null" label="学历">
            <Select v-model="formItem.degree">
              <Option value="研究生">研究生</Option>
              <Option value="本科">本科</Option>
              <Option value="专科">专科</Option>
            </Select>
          </FormItem>
          <FormItem v-if="formItem.position!=null && formItem.access==='[teacher]'" label="职位">
            <Select v-model="formItem.position">
              <Option value="讲师">讲师</Option>
              <Option value="副教授">副教授</Option>
              <Option value="教授">教授</Option>
            </Select>
          </FormItem>
            <FormItem v-if="formItem.departname!=null && formItem.access==='[admin]'" label="所属部门">
              <Select v-model="formItem.departname">
                <Option value="教务处">教务处</Option>
                <Option value="行政处">行政处</Option>
                <Option value="团支部">团支部</Option>
                <Option value="学生处">学生处</Option>
                <Option value="其它部门">其它部门</Option>
              </Select>
            </FormItem>
          <FormItem v-if="formItem.position!=null && formItem.access==='[admin]'" label="职位">
            <Select v-model="formItem.position">
              <Option value="主任">主任</Option>
              <Option value="副主任">副主任</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>

</template>

<script>
  export default {
    name: "myinfo",
    data() {
      return {
        formItem: {
          name: '',
          password: '',
          sex: '',
          idcard: '',
          birthday: '',
          departname: '',
          position: '',
          tel: '',
          majorname: '',
          degree: '',
          address: '',
          roles:''
        },
        //表单验证
        ruleValidate: {
          name: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
          password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
          tel: [{required: true, pattern: /^1[34578]\d{9}$/, message: '手机号格式错误', trigger: 'blur'}],
          idcard: [{required: true, pattern: /^\d{15}|\d{18}$/, message: '身份证号格式错误', trigger: 'blur'}]
        }
      }
    },
    methods: {
      //查询方法
      getInfo() {
        //获取token
        const token = this.$store.state.user.token
        this.loading = true
        const url = '/getInfo'
        this.$axios.get(url, {params: {token: token}})
          .then(res => {
            console.log(res.data)
            this.formItem = res.data.data
            this.loading = false
          })
          .catch(res => {
            console.log(res)
          })
      },


    },
    mounted() {
      this.getInfo()
    }
  }
</script>

<style scoped>

</style>
