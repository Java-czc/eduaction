<template>
  <div>
    <Card>
      <div style="margin-bottom: 40px;">
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

  export default {
    name: 'teacherTasks',
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
        loading: false,
        current: 1,
        total: 0,
        pageSize: 10
      }
    },
    methods: {
      //查询方法
      changePage() {
        this.loading = true
        const url = '/searchTeacherTask'
        this.$axios.get(url, {params: {name: this.$store.state.user.userName, page: this.current, limit: this.pageSize}})
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
