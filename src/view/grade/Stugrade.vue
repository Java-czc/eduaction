<template>
  <div>
    <Card>
      <div style="margin-bottom: 10px;">
        <Input placeholder="输入关键字搜索" v-model="searchValue" style="width: 200px" @keydown.enter.native="handleSearch"/>&nbsp;
        <Button @click="handleSearch" type="primary">
          <Icon type="md-search"/>
          搜索
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
            title: '成绩id',
            sortable: true,
            key: 'gradeid'
          },
          {
            title: '学号',
            key: 'stuid'
          },
          {
            title: '学生姓名',
            key: 'stuname'
          },
          {
            title: '课程名称',
            key: 'coursename'
          },
          {
            title: '学分',
            key: 'credit'
          },
          {
            title: '成绩',
            key: 'grade'
          }, {
            title: '教师id',
            key: 'teacherid'
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
          gradeid: '',//成绩id
          stuid: '',//学号
          stuname: '',//学生姓名
          coursename: '',//课程名称
          credit: '',//学分
          grade: '',//成绩
          teacherid: '',//教师id
        },
        //表单验证
        ruleValidate: {
          //stuid: [{required: true, message: '学号不能为空', trigger: 'blur'}],
          stuname: [{required: true, message: '学生姓名不能为空', trigger: 'blur'}],
          coursename: [{required: true, message: '课程名称不能为空', trigger: 'blur'}],
          credit: [{required: true, message: '学分不能为空', trigger: 'blur'}],
          grade: [{required: true, message: '成绩不能为空', trigger: 'blur'}],
          teacherid: [{required: true, message: '教师id不能为空', trigger: 'blur'}]
        }
      }
    },
    methods: {
      //修改
      show(index) {
        this.formItem = {
          gradeid:this.data6[index].gradeid,
          stuid: this.data6[index].stuid,
          stuname: this.data6[index].stuname,
          coursename: this.data6[index].coursename,
          credit: this.data6[index].credit,
          grade: this.data6[index].grade,
          teacherid: this.data6[index].teacherid
        }
        this.title = '成绩修改'
        this.disable = true
        this.addModel = true
      },
      //删除
      remove(index) {
        this.$Modal.confirm({
          title: `确定要删除吗？`,
          onOk: () => {
            this.loading = true
            const url = '/deleteGrade'
            this.$axios.get(url, {params: {id: this.data6[index].gradeid}})
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
        const url = '/searchGrade'
        this.$axios.get(url, {params: {name: this.searchValue,
            token:this.$store.state.user.token, page: this.current, limit: this.pageSize}})
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
            let url = '/updateGrade'

            if (this.title === '成绩添加') {
              url = '/insertGrade'
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
        this.title = '成绩添加'
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
          gradeid: '',//成绩id
          stuid: '',//学号
          stuname: '',//学生姓名
          coursename: '',//课程名称
          credit: '',//学分
          grade: '',//成绩
          teacherid: '',//教师id
        }
      }
    },
    mounted() {
      this.changePage();
    }
  }
</script>
