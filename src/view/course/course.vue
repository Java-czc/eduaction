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
    <Modal v-model="addModel" :title="title" footer-hide @on-cancel="addCanael">
      <Form :model="formItem" ref="formItem" :label-width="80" :rules="ruleValidate">
        <FormItem label="课程名称" prop="coursename">
          <Input :disabled="disable" v-model="formItem.coursename" placeholder="请输入课程名称"></Input>
        </FormItem>
        <FormItem label="所属科目">
          <Select v-model="formItem.coursekind">
            <Option value="理科">理科</Option>
            <Option value="文科">文科</Option>
          </Select>
        </FormItem>
        <FormItem label="课程类型">
          <Select v-model="formItem.coursetype">
            <Option value="必修">必修</Option>
            <Option value="选修">选修</Option>
          </Select>
        </FormItem>
        <FormItem label="学分" prop="credit">
          <Input v-model="formItem.credit" placeholder="请输入学分"></Input>
        </FormItem>
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
            title: '课程ID',
            key: 'courseid'
          },
          {
            title: '课程名称',
            key: 'coursename'
          },
          {
            title: '所属科目',
            key: 'coursekind'
          },
          {
            title: '课程类型',
            key: 'coursetype'
          },
          {
            title: '学分',
            key: 'credit'
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
                    type: 'primary',
                    icon: 'ios-create-outline'
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
        title: '课程添加',
        disable: false,
        formItem: {
          coursename: '',
          coursekind: '理科',
          coursetype: '必修',
          credit: ''
        },
        //表单验证
        ruleValidate: {
          coursename: [{required: true, message: '课程名称不能为空', trigger: 'blur'}],
          credit: [{required: true, message: '学分不能为空', trigger: 'blur'}]
        }
      }
    },
    methods: {
      //修改
      show(index) {
        this.formItem = {
          coursename: this.data6[index].coursename,
          coursekind: this.data6[index].coursekind,
          coursetype: this.data6[index].coursetype,
          credit: this.data6[index].credit,
        }
        this.title = '课程修改'
        this.disable = true
        this.addModel = true
      },
      //删除
      remove(index) {
        this.$Modal.confirm({
          title: `确定要删除${this.data6[index].coursename}吗？`,
          onOk: () => {
            this.loading = true
            const url = '/deleteCourse'
            this.$axios.get(url, {params: {id: this.data6[index].courseid}})
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
        const url = '/searchCourse'
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
            let url = '/updateCourse'

            if (this.title === '课程添加') {
              url = '/insertCourse'
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
        this.title = '课程添加'
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
          coursename: '',
          coursekind: '理科',
          coursetype: '必修',
          credit: ''
        }
      }
    },
    mounted() {
      this.changePage();
    }
  }
</script>
