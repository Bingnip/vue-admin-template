<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="6"><h2>编辑商品</h2></el-col>
        <el-col :span="6" :offset="12"><el-button type="primary">保存</el-button></el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-form ref="ruleForm" :label-position="labelPosition" label-width="100px" :model="ruleForm" :rules="rules">

        <el-tabs :tab-position="tabPosition" style="height: auto;">
          <el-tab-pane label="基本信息">
            <el-form-item label="SKU：" prop="g_sku">
              <el-col :span="12">
                <el-input v-model="ruleForm.g_sku" />
              </el-col>
              <el-col :span="12">（商品唯一编号，将与内网关联）</el-col>
            </el-form-item>
            <el-form-item label="商品名称：" prop="g_name">
              <el-col :span="12">
                <el-input v-model="ruleForm.g_name" />
              </el-col>
              <el-col :span="12">（该字段为网站前端展示的商品名称，需填写法语)</el-col>
            </el-form-item>
            <el-form-item label="URL KEY：" prop="g_alias">
              <el-col :span="12">
                <el-input v-model="ruleForm.g_alias" />
              </el-col>
              <el-col :span="12"><el-button type="primary" size="small">修改</el-button></el-col>
            </el-form-item>
            <el-form-item label="克重：" prop="g_weight">
              <el-col :span="12">
                <el-input v-model="ruleForm.g_alias" />
              </el-col>
              <el-col :span="12">（需填写单位，例如：300g/㎡）</el-col>
            </el-form-item>
            <el-form-item label="重定向URL：" prop="g_url">
              <el-col :span="12">
                <el-input v-model="ruleForm.g_url" />
              </el-col>
              <el-col :span="12"><el-button type="danger" size="small">301重定向设置</el-button></el-col>
            </el-form-item>
            <el-form-item label="状态：" prop="g_status">
              <el-radio-group v-model="ruleForm.g_status">
                <el-radio label="上架中" />
                <el-radio label="已下架" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="置顶号：" prop="g_order">
              <el-col :span="12">
                <el-input v-model="ruleForm.g_order" />
              </el-col>
              <el-col :span="12">（越大越靠前)</el-col>
            </el-form-item>
            <el-form-item label="销售标识：" prop="g_recommended" />
            <el-form-item label="促销倒计时：" prop="g_discount_rate">
              <el-col :span="3">
                <el-radio-group v-model="ruleForm.g_discount_rate">
                  <el-radio label="开启" />
                  <el-radio label="关闭" />
                </el-radio-group>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="g_discount_start_time">
                  <el-date-picker v-model="ruleForm.g_discount_start_time" type="datetime" placeholder="开始日期" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col class="line" :span="1">~</el-col>
              <el-col :span="6">
                <el-form-item prop="g_discount_end_time">
                  <el-date-picker v-model="ruleForm.g_discount_end_time" type="datetime" placeholder="结束时间" style="width: 100%;" />
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="添加时间：" prop="g_add_time">
              <el-col :span="6">
                <el-date-picker v-model="ruleForm.g_add_time" type="date" placeholder="添加日期" style="width: 100%;" />
              </el-col>
              <el-col :span="18">
                （前台显示的添加时间）
              </el-col>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片">
            <el-form-item label="橱窗图：" prop="g_img" />
            <el-form-item label="Hover图：" prop="g_img_hover" />
            <el-form-item label="其他图：" prop="g_img_else">
              <el-upload :action="uploadUrl" :auto-upload="true" list-type="picture-card" :multiple="true">
                <i slot="default" class="el-icon-plus" />
                <div slot="file" slot-scope="{file}">
                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                      <i class="el-icon-zoom-in" />
                    </span>
                    <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                      <i class="el-icon-delete" />
                    </span>
                  </span>
                </div>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品规格">
            <el-header><el-button type="primary" size="mini">添加规格项目</el-button></el-header>
            <el-main>
              <table v-for="(item) in specifyList" :key="item.id" style="width: 80%; margin: 15px; padding: 20px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
                <el-row :gutter="24">
                  <el-col :span="2">
                    <el-form-item label="规格名：" />
                  </el-col>
                  <el-col :span="10"><el-input :value="item.header.specifyKey" /></el-col>
                  <el-col :span="2">
                    <el-form-item label="排序：" />
                  </el-col>
                  <el-col :span="2"><el-input :value="item.header.order" /></el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <el-checkbox>添加规格图片</el-checkbox>
                    </el-form-item>
                  </el-col>
                </el-row>
                <tr>
                  <table>
                    <el-row :gutter="24">
                      <el-col :span="10">
                        <el-form-item label="规则值" />
                      </el-col>
                      <el-col :span="3">
                        <el-form-item label="排序" />
                      </el-col>
                      <el-col :span="5">
                        <el-form-item label="图片" />
                      </el-col>
                      <el-col :span="3">
                        <el-form-item label="默认" />
                      </el-col>
                      <el-col :span="3" />
                    </el-row>
                    <el-row v-for="(row) in item.body" :key="row.id" :gutter="24">
                      <el-col :span="9" :offset="1"><el-input :value="row.specifyValue" /></el-col>
                      <el-col :span="3" :offset="1"><el-input :value="row.order" /></el-col>
                      <el-col :span="5"><img :src="row.img" alt="" width="120" height="120"></el-col>
                      <el-col :span="2" :offset="1"><el-radio v-model="row.default" /></el-col>
                      <el-col :span="2"><el-button type="danger" size="mini">删除</el-button></el-col>
                    </el-row>
                  </table>
                </tr>
              </table>
            </el-main>
          </el-tab-pane>

          <el-tab-pane label="价格库存">
            <el-row>
              <el-col :span="2" :offset="1"><el-button type="primary" size="small">生成价格表</el-button></el-col>
              <el-col :span="2"><el-button type="primary" size="small">批量填充</el-button></el-col>
              <el-col :span="7">
                <el-form-item>
                  在标题栏中输入或选择内容可以进行筛选和批量填充
                </el-form-item>
              </el-col>
            </el-row>
            <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 80%; margin: 20px 0 0 30px;">
              <el-table-column prop="id" label="ID" width="180" />
              <el-table-column prop="name" label="姓名" />
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="分类选择">
            <el-tree ref="tree" :data="categoryList" show-checkbox default-expand-all node-key="id" highlight-current :props="categoryDefaultProps" />
          </el-tab-pane>

          <el-tab-pane label="内容信息">
            <el-form-item label="描述">
              <el-input v-model="ruleForm.g_desc" type="textarea" prop="g_desc" />
            </el-form-item>
            <el-form-item label="META标题">
              <el-col :span="12">
                <el-input v-model="ruleForm.g_meta_title" type="textarea" prop="g_meta_title" />
              </el-col>
              <el-col :span="12">
                <el-button type="primary" size="small">填充商品名称</el-button>
              </el-col>
            </el-form-item>
            <el-form-item label="META关键词">
              <el-col :span="12">
                <el-input v-model="ruleForm.g_meta_keywords" type="textarea" prop="g_meta_keywords" />
              </el-col>
              <el-col :span="12">
                <el-button type="primary" size="small">填充商品名称</el-button>
              </el-col>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="关联商品">
            <el-form-item label="商品ID">
              <el-col :span="12">
                <el-input placeholder="输入ID, 多个已英文逗号(,)隔开" />
              </el-col>
              <el-col :span="4">
                <el-button type="primary" size="small">加入</el-button>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-table :data="gidRefList" stripe style="width: 60%">
                <el-table-column prop="gid" label="商品ID" width="100" />
                <el-table-column label="操作" width="70">
                  <el-button type="danger" size="mini">删除</el-button>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-tab-pane>

        </el-tabs>

      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import { getCategoryList } from '@/api/goods/standard'

export default {
  data() {
    return {
      tableData: [{
        id: '12987122',
        name: '王小虎',
        amount1: '234',
        amount2: '3.2',
        amount3: 10
      }, {
        id: '12987123',
        name: '王小虎',
        amount1: '165',
        amount2: '4.43',
        amount3: 12
      }, {
        id: '12987124',
        name: '王小虎',
        amount1: '324',
        amount2: '1.9',
        amount3: 9
      }, {
        id: '12987125',
        name: '王小虎',
        amount1: '621',
        amount2: '2.2',
        amount3: 17
      }, {
        id: '12987126',
        name: '王小虎',
        amount1: '539',
        amount2: '4.1',
        amount3: 15
      }],
      specifyList: [{
        id: 100,
        header: { specifyKey: '规格1', order: 1, imgOpen: 1 },
        deleted: 0,
        body: [
          { id: 1001, specifyValue: '规格1-1', order: 1, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297507_4.jpg', default: 1, deleted: 0, price: 0, stock: 1 },
          { id: 1002, specifyValue: '规格1-2', order: 2, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297510_-.jpg', default: 0, deleted: 0, price: 10, stock: 5 },
          { id: 1003, specifyValue: '规格1-2', order: 3, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297510_-.jpg', default: 0, deleted: 0, price: 20, stock: 6 }
        ]
      }, {
        id: 200,
        header: { specifyKey: '规格2', order: 2, imgOpen: 0 },
        deleted: 0,
        body: [
          { id: 2001, specifyValue: '规格2-1', order: 1, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297507_4.jpg', default: 1, deleted: 0, price: 0, stock: 1 },
          { id: 2002, specifyValue: '规格2-2', order: 2, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297510_-.jpg', default: 0, deleted: 0, price: 0.66, stock: 4 },
          { id: 2003, specifyValue: '规格2-2', order: 3, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297510_-.jpg', default: 0, deleted: 0, price: 7.36, stock: 5 }
        ]
      }, {
        id: 300,
        header: { specifyKey: '规格3', order: 3, imgOpen: 1 },
        deleted: 0,
        body: [
          { id: 3001, specifyValue: '规格3-1', order: 1, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297507_4.jpg', default: 1, deleted: 0, price: 0, stock: 1 },
          { id: 3002, specifyValue: '规格3-2', order: 2, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297510_-.jpg', default: 0, deleted: 0, price: 30, stock: 55 },
          { id: 3003, specifyValue: '规格3-2', order: 3, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297510_-.jpg', default: 0, deleted: 0, price: 50, stock: 662 }
        ]
      }],
      gidRefList: [
        { gid: 100 },
        { gid: 101 }
      ],
      categoryList: null,
      categoryDefaultProps: {
        children: 'children',
        label: 'name'
      },
      labelPosition: 'right',
      tabPosition: 'left',
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      uploadUrl: '/vue_admin/goods.php?action=uploadImg',
      ruleForm: {
        g_sku: '',
        g_name: '',
        g_alias: ''

      },
      rules: {
        g_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getCategoryList().then(response => {
        this.categoryList = response.data.items
      })
    },
    handleRemove(file) {
      console.log(file)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>

<style scope>

</style>
