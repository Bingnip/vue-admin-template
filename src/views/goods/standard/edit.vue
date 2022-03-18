<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="6">
          <h2 v-if="editType == 'create'">新增商品</h2>
          <h2 v-else>编辑商品</h2>
        </el-col>
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
              <el-radio v-model="ruleForm.g_status" label="1">上架中</el-radio>
              <el-radio v-model="ruleForm.g_status" label="0">已下架</el-radio>
            </el-form-item>
            <el-form-item label="置顶号：" prop="g_order">
              <el-col :span="4">
                <el-input v-model="ruleForm.g_order" type="number" @mousewheel.native.prevent @keyup.native="prevent($event)" />
              </el-col>
              <el-col :span="10">（越大越靠前)</el-col>
            </el-form-item>
            <el-form-item label="销售标识：" prop="g_recommended">
              <el-checkbox v-model="ruleForm.g_recommended">推荐</el-checkbox>
              <el-checkbox v-model="ruleForm.g_new">新品</el-checkbox>
              <el-checkbox v-model="ruleForm.g_hot">热门</el-checkbox>
              <el-checkbox v-model="ruleForm.is_special_offer">特价</el-checkbox>
            </el-form-item>
            <el-form-item label="促销倒计时：" prop="g_discount_rate">
              <el-col :span="3">
                <el-radio v-model="ruleForm.g_discount_rate" label="0">关闭</el-radio>
                <el-radio v-model="ruleForm.g_discount_rate" label="1">开启</el-radio>
              </el-col>
              <div v-if="ruleForm.g_discount_rate == '1'">
                <el-col :span="5">
                  <el-form-item prop="g_discount_start_time">
                    <el-date-picker v-model="ruleForm.g_discount_start_time" type="datetime" placeholder="开始日期" style="width: 100%;" />
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="1" :offset="1">~</el-col>
                <el-col :span="5">
                  <el-form-item prop="g_discount_end_time">
                    <el-date-picker v-model="ruleForm.g_discount_end_time" type="datetime" placeholder="结束时间" style="width: 100%;" />
                  </el-form-item>
                </el-col>
              </div>
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
            <el-form-item label="上传图片：" prop="imgList">
              <el-col :span="20">
                <ImgUpload v-model="ruleForm.imgList" />
              </el-col>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品规格">
            <el-header><el-button type="primary" size="mini" @click="addSpecify()">添加规格项目</el-button></el-header>
            <el-main>
              <table v-for="(item, index) in specifyList" :key="item.id" style="width: 80%; margin: 15px; padding: 20px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);border-radius: 4px;">
                <el-row :gutter="24">
                  <el-col :span="2">
                    <el-form-item label="规格名：" />
                  </el-col>
                  <el-col :span="8"><el-input :value="item.specifyValue" /></el-col>
                  <el-col :span="2">
                    <el-form-item label="排序：" />
                  </el-col>
                  <el-col :span="2"><el-input :value="item.order" /></el-col>
                  <el-col :span="8">
                    <el-form-item>
                      <el-checkbox :checked="item.imgOpen" @change="addSpecifyImg(index)">添加规格图片</el-checkbox>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <i class="el-icon-error" style="font-size: 35px;" @click="removeSpecify(index)" />
                  </el-col>
                </el-row>
                <el-row>
                  <table>
                    <el-row :gutter="24">
                      <el-col :span="10">
                        <el-form-item label="规则值" />
                      </el-col>
                      <el-col :span="3">
                        <el-form-item label="排序" />
                      </el-col>
                      <el-col v-if="item.imgOpen == true" :span="5">
                        <el-form-item label="图片" />
                      </el-col>
                      <el-col :span="3">
                        <el-form-item label="默认" />
                      </el-col>
                      <el-col :span="3" />
                    </el-row>
                    <el-row v-for="(row, rowIndex) in item.children" :key="row.id" :gutter="24">
                      <el-col :span="9" :offset="1"><el-input :value="row.specifyValue" /></el-col>
                      <el-col :span="3" :offset="1"><el-input :value="row.order" /></el-col>
                      <el-col v-if="item.imgOpen == true" :span="5">
                        <el-upload class="avatar-uploader" action="/goods.php?action=imgUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                          <img v-if="row.img" :src="row.img" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon" />
                        </el-upload>
                      </el-col>
                      <el-col :span="2" :offset="1">
                        <input type="radio" :name="item.id" :checked="row.default" @click="specifyValueCheck(index, rowIndex)">
                      </el-col>
                      <el-col :span="2"><el-button type="danger" size="mini" @click="removeSpecifyValue(index, rowIndex)">删除</el-button></el-col>
                    </el-row>
                  </table>
                </el-row>
                <el-row>
                  <el-col :span="3" :offset="1">
                    <span class="addSpecify" @click="addSpecifyValue(index)">+ 添加规则值</span>
                  </el-col>
                  <el-col :span="20" />
                </el-row>
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
            <el-table :data="priceStockList" :span-method="objectSpanMethod" border style="width: 80%; margin: 0 0 0 30px;">
              <el-table-column prop="p1" width="180" />
              <el-table-column prop="p2" />
              <el-table-column prop="p3" />
              <el-table-column prop="price" label="价格" />
              <el-table-column prop="stock" label="库存" />
            </el-table>
            <br>
            <el-row>
              <el-col :span="1">
                <el-form-item label="划线价：" />
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-input />
                </el-form-item>
              </el-col>
              <el-col :span="19">
                <el-form-item>
                  （未编辑则前端不显示划线价及折扣比例）
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="1">
                <el-form-item label="库存总计：" />
              </el-col>
              <el-col :span="23">
                <el-form-item>
                  <span>2222</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="分类选择">
            <el-tree ref="tree" :data="categoryList" show-checkbox default-expand-all node-key="id" highlight-current :props="categoryDefaultProps" />
          </el-tab-pane>

          <el-tab-pane label="内容信息">
            <el-form-item label="描述：">
              <el-col :span="20">
                <tinymce v-model="ruleForm.g_desc" :height="300" />
              </el-col>
            </el-form-item>
            <el-form-item label="META标题：">
              <el-col :span="12">
                <el-input v-model="ruleForm.g_meta_title" type="textarea" prop="g_meta_title" />
              </el-col>
              <el-col :span="12">
                <el-button type="primary" size="small">填充商品名称</el-button>
              </el-col>
            </el-form-item>
            <el-form-item label="META关键词：">
              <el-col :span="12">
                <el-input v-model="ruleForm.g_meta_keywords" type="textarea" prop="g_meta_keywords" />
              </el-col>
              <el-col :span="12">
                <el-button type="primary" size="small">填充商品名称</el-button>
              </el-col>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane v-if="editType == 'edit'" label="关联商品">
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
import Tinymce from '@/components/Tinymce'
import ImgUpload from '@/components/ImgUpload'

export default {
  components: { Tinymce, ImgUpload },
  data() {
    return {
      editType: 'create',
      type: 'add', // 图片上传的类型
      priceStockList: [],
      specifyList: [{
        id: 100,
        specifyValue: '规格1',
        order: 23,
        imgOpen: true,
        deleted: 0,
        children: [
          { id: 1001, specifyValue: '规格1-1', order: 1, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297507_4.jpg', default: 1, deleted: 0, price: 0, stock: 1 },
          { id: 1002, specifyValue: '规格1-2', order: 2, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297510_-.jpg', default: 0, deleted: 0, price: 10, stock: 5 },
          { id: 1003, specifyValue: '规格1-3', order: 3, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297510_-.jpg', default: 0, deleted: 0, price: 20, stock: 6 }
        ]
      }, {
        id: 200,
        specifyValue: '规格2',
        order: 2,
        imgOpen: false,
        deleted: 0,
        children: [
          { id: 2001, specifyValue: '规格2-1', order: 1, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297507_4.jpg', default: true, deleted: 0, price: 0, stock: 1 },
          { id: 2002, specifyValue: '规格2-2', order: 2, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297510_-.jpg', default: false, deleted: 0, price: 0.66, stock: 4 },
          { id: 2003, specifyValue: '规格2-3', order: 3, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297510_-.jpg', default: false, deleted: 0, price: 7.36, stock: 5 }
        ]
      }, {
        id: 300,
        specifyValue: '规格3',
        order: 3,
        imgOpen: false,
        deleted: 0,
        children: [
          { id: 3001, specifyValue: '规格3-1', order: 1, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297507_4.jpg', default: true, deleted: 0, price: 0, stock: 1 },
          { id: 3002, specifyValue: '规格3-2', order: 2, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297510_-.jpg', default: false, deleted: 0, price: 30, stock: 55 },
          { id: 3003, specifyValue: '规格3-3', order: 3, img: 'https://du7nt18x31vr8.cloudfront.net/assets/images/product_particular/1646297510_-.jpg', default: false, deleted: 0, price: 50, stock: 662 }
        ]
      }],
      gidRefList: [],
      categoryList: null,
      categoryDefaultProps: {
        children: 'children',
        label: 'name'
      },
      labelPosition: 'right',
      tabPosition: 'left',
      ruleForm: {
        g_sku: '',
        g_name: '',
        g_alias: '',
        g_weight: '',
        g_status: '0',
        g_order: 0,
        g_recommended: false,
        g_new: false,
        g_hot: false,
        is_special_offer: false,
        g_discount_rate: '0',
        imgList: [],
        g_desc: 'test g_desc',
        g_meta_title: '',
        g_meta_keywords: ''
      },
      rules: {
        g_sku: [
          { required: true, message: '请输入SKU', trigger: 'blur' }
        ],
        g_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        g_alias: [
          { required: true, message: '请输入URL KEY', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
    if (this.specifyList) {
      this.fetchPriceStockData(this.specifyList)
    }

    this.type = this.$route.query.type || 'add'
    if (this.type === 'edit') {
      this.getDetail()
    }
  },
  methods: {
    fetchPriceStockData(list, index = 0) {
      if (list.length === index) {
        return
      }

      const children = list[index]['children']
      var iterator = []

      if (children) {
        if (this.priceStockList.length == 0) {
          children.forEach(e => {
            var idx = 'p' + (index + 1)
            var temp = {}
            temp[idx] = e.specifyValue
            temp['price'] = e.price
            temp['stock'] = e.stock

            iterator.push(temp)
          })
        } else {
          this.priceStockList.forEach(e => {
            children.forEach(ele => {
              // todo 这里优化下
              var idx = 'p' + (index + 1)
              var prevIdx = 'p' + index
              var parentIdx = 'p' + (index - 1)

              var temp = {}
              temp[parentIdx] = e[parentIdx]
              temp[prevIdx] = e[prevIdx]
              temp[idx] = ele.specifyValue
              temp['price'] = e.price
              temp['stock'] = e.stock

              iterator.push(temp)
            })
          })
        }

        this.priceStockList = iterator
      }

      index++
      this.fetchPriceStockData(list, index)
    },
    fetchData() {
      getCategoryList().then(response => {
        this.categoryList = response.data.items
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex === 0) {
      //   if (rowIndex % 2 === 0) {
      //     return {
      //       rowspan: 2,
      //       colspan: 1
      //     }
      //   } else {
      //     return {
      //       rowspan: 0,
      //       colspan: 0
      //     }
      //   }
      // }
    },
    prevent(e) {
      var keynum = window.event ? e.keyCode : e.which // 获取键盘码
      if (keynum == 189 || keynum == 190 || keynum == 109 || keynum == 110) {
        this.$message.warning('禁止输入小数以及负数')
        e.target.value = ''
      }
    },
    getDetail() {
      setTimeout(() => {
        const res = {
          imgList: ['https://abc.png']
        }
        this.formData = res
      }, 1000)
    },
    addSpecify() { // 添加规格项目
      if (this.specifyList.length >= 3) {
        this.$message.error('规格项目不能超过3个')
        return
      }
      var v = {
        id: 400,
        specifyValue: '',
        order: '',
        imgOpen: 0,
        deleted: 0,
        children: [
          { id: '', specifyValue: '', order: '', img: '', default: 1, deleted: 0, price: 0, stock: 0 },
          { id: '', specifyValue: '', order: '', img: '', default: 0, deleted: 0, price: 0, stock: 0 },
          { id: '', specifyValue: '', order: '', img: '', default: 0, deleted: 0, price: 0, stock: 0 }
        ]
      }
      this.specifyList.push(v)
    },
    removeSpecify(index) { // 删除规格项目
      this.specifyList.splice(index, 1)
    },
    addSpecifyImg(index) { // 添加规格图片
      this.specifyList[index].imgOpen = event.target.checked
    },
    addSpecifyValue(index) { // 添加规格值
      var v = { id: '', specifyValue: '', order: '', img: '', default: 1, deleted: 0, price: 0, stock: 0 }
      this.specifyList[index].children.push(v)
    },
    removeSpecifyValue(index, rowIndex) { // 删除规格值
      this.specifyList[index].children.splice(rowIndex, 1)
    },
    specifyValueCheck(index, rowIndex) { // 规格值默认项选中
      this.specifyList[index].children.forEach(e => {
        e.default = 0
      })
      this.specifyList[index].children[rowIndex].default = 1
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpg/jpeg/png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style scope>
  .addSpecify {
    font-size: 14px; color: #409EFF; cursor: pointer;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
