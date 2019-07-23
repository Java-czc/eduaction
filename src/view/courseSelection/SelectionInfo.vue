<template>
  <div>
    <Card>
      <div style="margin-bottom: 10px;">
        <Input placeholder="输入关键字搜索" v-model="searchValue" style="width: 200px" @keydown.enter.native="handleSearch"/>&nbsp;
        <Button @click="handleSearch" type="primary">
          <Icon type="md-search"/>
          搜索
        </Button>
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
            <FormItem label="课程名称" prop="courname">
              <Input v-model="formItem.courname" placeholder="请输入课程名称"></Input>
            </FormItem>
            <FormItem label="老师ID" prop="teacherid">
              <Input  v-model="formItem.teacherid" placeholder="请输入老师ID"></Input>
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
          <Button @click="add" type="primary">确定</Button>
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
                    icon: 'md-add-circle'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
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
        title: '',
        formItem: {
          name:this.$store.state.user.userName,
          taskid: '',
          courname: '',
          teacherid: '',
          taskyear: '2016-2017',
          taskteam: '第一学期',
          taskway: '闭卷',
          taskdepart: '理工学院',
          classdate: '',
          classplace: ''
        },
        //表单验证
        ruleValidate: {
          courname: [{required: true, message: '任务名称不能为空', trigger: 'blur'}],
          //teacherid: [{required: true, message: '教师ID不能为空', trigger: 'blur'}],
          classdate: [{required: true, message: '开课时间不能为空', trigger: 'blur'}],
          classplace: [{required: true, message: '地点不能为空', trigger: 'blur'}],

        }
      }
    },
    methods: {
      //修改
      show(index) {
        this.$Modal.confirm({
          title: `确定要选择${this.data6[index].taskcourname}吗？`,
          onOk: () => {
            this.formItem = {
              name:this.$store.state.user.userName,
              taskid: this.data6[index].taskid,
              courname: this.data6[index].taskcourname,
              teacherid: this.data6[index].taskteaid,
              taskyear: this.data6[index].taskyear,
              taskteam: this.data6[index].taskteam,
              taskway: this.data6[index].taskway,
              taskdepart: this.data6[index].taskdepart,
              classdate: this.data6[index].classdate,
              classplace: this.data6[index].classplace,
            }
            this.title = '请确定选课信息'
            this.addModel = true
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
      //选课
       add() {
        this.$refs.formItem.validate((valid) => {
          if (valid) { // 步骤1
            this.loading = true
            const url = '/courseSelection'
            this.$axios.post(url,qs.stringify(this.formItem))
              .then(res => {
                this.$Notice.info({
                  title: res.data
                });
                this.changePage();c
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
    }
    ,
    mounted() {
      this.changePage();
    }
  }
</script>
