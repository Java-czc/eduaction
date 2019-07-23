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
          <Icon type="ios-add"/>
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
            <FormItem label="所属部门">
              <Select v-model="formItem.departname">
                <Option value="教务处">教务处</Option>
                <Option value="行政处">行政处</Option>
                <Option value="团支部">团支部</Option>
                <Option value="学生处">学生处</Option>
                <Option value="其它部门">其它部门</Option>
              </Select>
            </FormItem>
            <FormItem label="职位">
              <Select v-model="formItem.position">
                <Option value="主任">主任</Option>
                <Option value="副主任">副主任</Option>
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
                title: '管理员ID',
                sortable: true,
                key: 'user_id'
              },
              {
                title: '管理员姓名',
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
          }, {
            title: '出生日期',
            key: 'birthday'
          },
          {
            title: '部门',
            key: 'departname'
          }, {
            title: '职位',
            key: 'position'
          },
          {
            title: '联系电话',
            key: 'tel'
          }, {
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
        title: '用户添加',
        disable: false,
        formItem: {
          name: '',
          password: '',
          sex: '男',
          idcard: '',
          birthday: '',
          departname: '其它部门',
          position: '副主任',
          tel: '',
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
          position: this.data6[index].position,
          tel: this.data6[index].tel,
          address: this.data6[index].address,
        }
        this.title = '用户修改'
        this.disable = true
        this.addModel = true
      },
      //删除
      remove(index) {
        this.$Modal.confirm({
          title: `确定要删除${this.data6[index].name}吗？`,
          onOk: () => {
            this.loading = true
            const url = '/deleteAdmin'
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
        const url = '/searchAdmin'
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
            let url = '/updateAdmin'

            if (this.title === '用户添加') {
              url = '/insertAdmin'
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
        this.title = '用户添加'
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
          departname: '其它部门',
          position: '副主任',
          tel: '',
          address: ''
        }
      }
    },
    mounted() {
      this.changePage();
    }
  }
</script>
