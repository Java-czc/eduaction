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
            <input type="hidden" v-model="formItem.taskid">
            <FormItem label="课程名称" prop="taskcourname">
              <Input  v-model="formItem.taskcourname" placeholder="请输入课程名称"></Input>
            </FormItem>
            <FormItem label="老师ID" prop="taskteaid">
              <Input  v-model="formItem.taskteaid" placeholder="请输入老师ID"></Input>
            </FormItem>
            <FormItem label="考试方式">
              <Select v-model="formItem.taskway">
                <Option value="闭卷">闭卷</Option>
                <Option value="开卷">开卷</Option>
              </Select>
            </FormItem>
            <FormItem label="开课时间" prop="classdate">
              <Input v-model="formItem.classdate" placeholder="请输入开课时间"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="学年">
              <Select v-model="formItem.taskyear">
                <Option value="2016-2017">2016-2017</Option>
                <Option value="2017-2018">2017-2018</Option>
                <Option value="2018-2019">2018-2019</Option>
              </Select>
            </FormItem>
            <FormItem label="学期">
              <Select v-model="formItem.taskteam">
                <Option value="第一学期">第一学期</Option>
                <Option value="第二学期">第二学期</Option>
              </Select>
            </FormItem>
            <FormItem label="院系">
              <Select v-model="formItem.taskdepart">
                <Option value="理工学院">理工学院</Option>
                <Option value="中医学院">中医学院</Option>
                <Option value="药学院">药学院</Option>
                <Option value="体育学院">体育学院</Option>
                <Option value="管理学院">管理学院</Option>
              </Select>
            </FormItem>
            <FormItem label="开课地点" prop="classplace">
              <Input type="text" v-model="formItem.classplace" placeholder="请输入开课地点"></Input>
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
            title: '教学ID',
            sortable: true,
            key: 'taskid'
          },
          {
            title: '课程名称',
            key: 'taskcourname'
          }, {
            title: '老师ID',
            key: 'taskteaid'
          },
          {
            title: '学年',
            key: 'taskyear'
          }, {
            title: '学期',
            key: 'taskteam'
          },
          {
            title: '考试方式',
            key: 'taskway'
          }, {
            title: '开设院系',
            key: 'taskdepart'
          },
          {
            title: '教学时间',
            key: 'classdate'
          }, {
            title: '教学地点',
            key: 'classplace',
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
        title: '教学任务添加',
        disable: false,
        formItem: {
          taskid: '',
          taskcourname: '',
          taskteaid: '',
          taskyear: '2016-2017',
          taskteam: '第一学期',
          taskway: '闭卷',
          taskdepart: '理工学院',
          classdate: '',
          classplace: ''
        },
        //表单验证
        ruleValidate: {
          taskcourname: [{required: true, message: '任务名称不能为空', trigger: 'blur'}],
          taskteaid: [{required: true, message: '教师ID不能为空', trigger: 'blur'}],
          classdate: [{required: true, message: '开课时间不能为空', trigger: 'blur'}],
          classplace: [{required: true, message: '地点不能为空', trigger: 'blur'}],

        }
      }
    },
    methods: {
      //修改
      show(index) {
        this.formItem = {
          taskid: this.data6[index].taskid,
          taskcourname: this.data6[index].taskcourname,
          taskteaid: this.data6[index].taskteaid,
          taskyear: this.data6[index].taskyear,
          taskteam: this.data6[index].taskteam,
          taskway: this.data6[index].taskway,
          taskdepart: this.data6[index].taskdepart,
          classdate: this.data6[index].classdate,
          classplace: this.data6[index].classplace,
        }
        this.title = '教学任务修改'
        this.disable = true
        this.addModel = true
      }
      ,
      //删除
      remove(index) {
        this.$Modal.confirm({
          title: `确定要删除${this.data6[index].taskcourname}吗？`,
          onOk: () => {
            this.loading = true
            const url = '/deleteTask'
            this.$axios.get(url, {params: {id: this.data6[index].taskid}})
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
      }
      ,

      //查询方法
      changePage() {
        this.loading = true
        const url = '/searchTask'
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
      }
      ,

      //添加修改方法
      addAndUpdate() {
        this.$refs.formItem.validate((valid) => {
          if (valid) { // 步骤1
            this.loading = true
            //判断此时是添加还是修改
            let url = '/updateTask'

            if (this.title === '教学任务添加') {
              url = '/insertTask'
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
      }
      ,
      onSelectionChange(selection) {
        console.log(selection)
      }
      ,
      exportData() {
        this.$refs.table.exportCsv({
          filename: 'The original data'
        });
      }
      ,
      handleSearch() {
        this.changePage();
      }
      ,
      handleAdd() {
        this.title = '教学任务添加'
        this.disable = false
        this.addModel = true
      }
      ,
      handleDelete() {

      }
      ,
      handlePage(value) {
        this.current = value
        this.changePage();
      }
      ,
      handlePageSize(value) {
        this.pageSize = value
        this.changePage();
      }
      ,
      addCanael() {
        this.formItem = {
            taskid: '',
            taskcourname: '',
            taskteaid: '',
            taskyear: '2016-2017',
            taskteam: '第一学期',
            taskway: '闭卷',
            taskdepart: '理工学院',
            classdate: '',
            classplace: ''
        }
      }
    }
    ,
    mounted() {
      this.changePage();
    }
  }
</script>
