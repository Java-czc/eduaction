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
  </div>
</template>
<script>
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
            title: '选课ID',
            sortable: true,
            key: 'selectid'
          },
          {
            title: '学号',
            sortable: true,
            key: 'stuid'
          },
          {
            title: '课程名称',
            key: 'courname'
          },
          {
            title: '老师ID',
            key: 'teacherid'
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
          },
          {
            title: '教学地点',
            key: 'classplace',
          }
        ],
        data6: [],
        searchValue: '',
        loading: false,
        current: 1,
        total: 0,
        pageSize: 10,
      }
    },
    methods: {
      //查询方法
      changePage() {
        this.loading = true
        const url = '/searchSchedule'
        this.$axios.get(url, {params: {title: this.searchValue, page: this.current,
            limit: this.pageSize, token:this.$store.state.user.token}})
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
