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
    <Modal v-model="addModel" title="用户添加" footer-hide>
      <Form :model="formItem" ref="formItem" :label-width="80" :rules="ruleValidate">
        <FormItem label="Input" prop="title">
          <Input v-model="formItem.title" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="Select">
          <Select v-model="formItem.select">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="DatePicker">
          <Row>
            <Col span="11">
              <DatePicker type="date" placeholder="Select date" v-model="formItem.date"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <TimePicker type="time" placeholder="Select time" v-model="formItem.time"></TimePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="Radio">
          <RadioGroup v-model="formItem.radio">
            <Radio label="male">Male</Radio>
            <Radio label="female">Female</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="Checkbox">
          <CheckboxGroup v-model="formItem.checkbox">
            <Checkbox label="Eat"></Checkbox>
            <Checkbox label="Sleep"></Checkbox>
            <Checkbox label="Run"></Checkbox>
            <Checkbox label="Movie"></Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="Text">
          <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem>
          <Button @click="add" type="primary">Submit</Button>
          <Button style="margin-left: 8px">Cancel</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'users',
    data() {
      return {
        columns7: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '用户名',
            key: 'title'
          },
          {
            title: '年龄',
            key: 'use'
          }, {
            title: '邮箱',
            key: 'virtue'
          },
          {
            title: '地址',
            key: 'cure'
          }, {
            title: '创建日期',
            key: 'comprise'
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
                    //  size: 'small',
                    //shape:'circle',
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
        formItem: {
          title: '',
          select: '',
          radio: 'male',
          checkbox: [],
          date: '',
          time: '',
          textarea: ''
        },
        //表单验证
        ruleValidate: {
          title: [{ required: true, message: '标题不能为空', trigger: 'blur' }]
        }
      }
    },
    methods: {
      show(index) {
        this.$Modal.info({
          title: `${this.data6[index].title}`,
          content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
        })
      },
      remove(index) {
        this.$Modal.confirm({
          title: `确定要删除${this.data6[index].title}吗？`,
          onOk: () => {
            this.$Notice.success({title: '删除成功', duration: 2})
            this.data6.splice(index, 1);
          },
          onCancel: () => {
            //this.$Message.info('Clicked cancel');
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
        this.addModel = true
      },
      handleDelete(){

      },
      handlePage(value) {
        this.current = value
        this.changePage();
      },
      handlePageSize(value) {
        this.pageSize = value
        this.changePage();
      },
      changePage() {
        this.loading = true
        const url = '/selectPrescriptionByTitle'
        this.$axios.get(url, {params: {title: this.searchValue, page: this.current, limit: this.pageSize}})
          .then(res => {
            console.log(res.data)
            this.data6 = res.data.data
            this.total = res.data.count
            this.loading = false
          })
          .catch(res => {
            console.log(res)
          })
      },
      add() {
        this.$refs.formItem.validate((valid) => {
          if (valid) { // 步骤1
            this.$Message.info('添加成功');
            this.addModel = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    mounted() {
      this.changePage();
    }
  }
</script>
