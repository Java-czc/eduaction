<template>
  <div>
    <Card>
      <div style="margin-bottom: 10px;">
        <Input placeholder="输入关键字搜索" v-model="searchValue" style="width: 200px" @keydown.enter.native="handleSearch"/>&nbsp;
        <Button @click="handleSearch" type="primary">
          <Icon type="md-search"/>
          搜索
        </Button>&nbsp;
        <Button @click="handleAdd" type="success">
          <Icon type="md-add"/>
          添加
        </Button>&nbsp;
        <Button @click="handleDelete" type="error">
          <Icon type="md-trash"/>
          批量删除
        </Button>&nbsp;
        <Button style="position: absolute;right: 20px" @click="exportData" type="warning">
          <Icon type="ios-download-outline"></Icon>
          导出
        </Button>
      </div>
      <Table border ref="table" :columns="columns7" :data="data6" :stripe="true" :border="false" :loading="loading"
             @on-selection-change="onSelectionChange"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" :current="current" :page-size="pageSize" show-sizer show-total @on-change="handlePage"
                @on-page-size-change='handlePageSize'></Page>
        </div>
      </div>
    </Card>
    <Modal v-model="addModel" :title="title" footer-hide width="860" @on-cancel="addCanael">
      <Form :model="formItem" ref="formItem" :label-width="80" :rules="ruleValidate">
        <Row>
          <Col span="12">
            <FormItem label="姓名" prop="name">
              <Input :disabled="disable" v-model="formItem.name" placeholder="请输入姓名"></Input>
            </FormItem>
            <FormItem label="密码" prop="password">
              <Input type="password" v-model="formItem.password" placeholder="请输入密码"></Input>
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
          </Col>
          <Col span="12">
            <FormItem label="院系">
              <Select v-model="formItem.departname">
                <Option value="理工学院">理工学院</Option>
                <Option value="中医学院">中医学院</Option>
                <Option value="药学院">药学院</Option>
                <Option value="体育学院">体育学院</Option>
                <Option value="管理学院">管理学院</Option>
              </Select>
            </FormItem>
            <FormItem label="专业">
              <Select v-model="formItem.majorname">
                <Option value="计算机科学与技术">计算机科学与技术</Option>
                <Option value="生物医学工程">生物医学工程</Option>
                <Option value="中医学">中医学</Option>
                <Option value="生物制药">生物制药</Option>
              </Select>
            </FormItem>
            <FormItem label="学历">
              <Select v-model="formItem.degree">
                <Option value="研究生">研究生</Option>
                <Option value="本科">本科</Option>
                <Option value="专科">专科</Option>
              </Select>
            </FormItem>
            <FormItem label="职位">
              <Select v-model="formItem.position">
                <Option value="讲师">讲师</Option>
                <Option value="副教授">副教授</Option>
                <Option value="教授">教授</Option>
              </Select>
            </FormItem>
            <FormItem label="联系电话" prop="tel">
              <Input v-model="formItem.tel" placeholder="请输入联系电话"></Input>
            </FormItem>
            <FormItem label="家庭地址" prop="address">
              <Input type="text" v-model="formItem.address" placeholder="请输入家庭地址"></Input>
            </FormItem>
          </Col>
        </Row>
        <FormItem>
          <Button @click="addAndUpdate" type="primary">Submit</Button>
          <Button style="margin-left: 8px">Cancel</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import qs from 'qs'

  export default {
    name: 'admin',
    data() {
      return {
        columns7: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '教师ID',
            sortable: true,
            key: 'user_id'
          },
          {
            title: '教师姓名',
            key: 'name'
          }, {
            title: '性别',
            key: 'sex'
          },
          {
            title: '身份证号',
            key: 'idcard',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.idcard
                  }
                }, params.row.idcard)
              ])
            }
          },
          {
            title: '出生日期',
            width:'110',
            key: 'birthday'
          },
          {
            title: '院系',
            key: 'departname'
          }, {
            title: '专业',
            width:'110',
            key: 'majorname'
          },
          {
            title: '学历',
            key: 'degree'
          },
          {
            title: '职位',
            key: 'position'
          },
          {
            title: '联系电话',
            width:'110',
            key: 'tel'
          },
          {
            title: '家庭住址',
            key: 'address',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.address
                  }
                }, params.row.address)
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info',
                    //  size: 'small',
                    //shape:'circle',
                    icon: 'ios-hammer-outline'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'error',
                    // shape:'circle',
                    icon: 'md-trash'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                })
              ]);
            }
          }
        ],
        data6: [],
        searchValue: '',
        loading: false,
        addModel: false,
        current: 1,
        total: 0,
        pageSize: 10,
        title: '教师添加',
        disable: false,
        formItem: {
          name: '',
          password: '',
          sex: '男',
          idcard: '',
          birthday: '',
          departname: '',
          majorname: '',
          position:'',
          tel: '',
          degree:'',
          address: ''
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
      //修改
      show(index) {
        this.formItem = {
          name: this.data6[index].name,
          password: this.data6[index].password,
          sex: this.data6[index].sex,
          idcard: this.data6[index].idcard,
          birthday: this.data6[index].birthday,
          departname: this.data6[index].departname,
          majorname: this.data6[index].majorname,
          degree: this.data6[index].degree,
          position: this.data6[index].position,
          tel: this.data6[index].tel,
          address: this.data6[index].address,
        }
        this.title = '教师修改'
        this.disable = true
        this.addModel = true
      },
      //删除
      remove(index) {
        this.$Modal.confirm({
          title: `确定要删除${this.data6[index].name}吗？`,
          onOk: () => {

            this.loading = true
            const url = '/deleteTeacher'
            this.$axios.get(url, {params: {id: this.data6[index].user_id}})
              .then(res => {
                this.$Notice.success({title: res.data, duration: 2})
                this.changePage();
                this.loading = false
              })
              .catch(res => {
                console.log(res)
              })
          },
          onCancel: () => {
            //this.$Message.info('Clicked cancel');
          }
        });
      },

      //查询方法
      changePage() {
        this.loading = true
        const url = '/searchTeacher'
        this.$axios.get(url, {params: {name: this.searchValue, page: this.current, limit: this.pageSize}})
          .then(res => {
            console.log(res.data)
            this.data6 = res.data.rows
            this.total = res.data.count
            this.loading = false
          })
          .catch(res => {
            console.log(res)
          })
      },

      //添加修改方法
      addAndUpdate() {
        this.$refs.formItem.validate((valid) => {
          if (valid) { // 步骤1
            this.loading = true
            //判断此时是添加还是修改
            let url = '/updateTeacher'

            if (this.title === '教师添加') {
              url = '/insertTeacher'
            }
            this.$axios.post(url, qs.stringify(this.formItem))
              .then(res => {
                this.$Notice.info({
                  title: res.data
                });
                this.changePage();
                this.loading = false
              })
              .catch(res => {
                console.log(res)
              })
            this.addModel = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      onSelectionChange(selection) {
        console.log(selection)
      },
      exportData() {
        this.$refs.table.exportCsv({
          filename: 'The original data'
        });
      },
      handleSearch() {
        this.changePage();
      },
      handleAdd() {
        this.title = '教师添加'
        this.disable = false
        this.addModel = true
      },
      handleDelete() {

      },
      handlePage(value) {
        this.current = value
        this.changePage();
      },
      handlePageSize(value) {
        this.pageSize = value
        this.changePage();
      },
      addCanael() {
        this.formItem = {
          name: '',
          password: '',
          sex: '男',
          idcard: '',
          birthday: '',
          departname: '',
          position:'',
          majorname: '',
          tel: '',
          degree:'',
          address: ''
        }
      }
    },
    mounted() {
      this.changePage();
    }
  }
</script>
