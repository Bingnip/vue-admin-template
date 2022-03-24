<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="6">
          <h2 v-if="editType == 'create'">新增商品</h2>
          <h2 v-else>编辑商品</h2>
        </el-col>
        <el-col :span="6" :offset="12"><el-button type="primary" @click="onSubmit()">保存</el-button></el-col>
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
                <el-input v-model="ruleForm.g_name" @blur="gnameToUrlkey()" />
              </el-col>
              <el-col :span="12">（该字段为网站前端展示的商品名称，需填写法语)</el-col>
            </el-form-item>
            <el-form-item label="URL KEY：" prop="g_alias">
              <el-col :span="12">
                <el-input v-model="ruleForm.g_alias" disabled />
              </el-col>
              <el-col :span="12"><el-button type="primary" size="small">修改</el-button></el-col>
            </el-form-item>
            <el-form-item label="克重：" prop="g_weight">
              <el-col :span="12">
                <el-input v-model="ruleForm.g_weight" />
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
            <el-form-item label="促销倒计时：" prop="g_under_discount">
              <el-col :span="3">
                <el-radio v-model="ruleForm.g_under_discount" label="0">关闭</el-radio>
                <el-radio v-model="ruleForm.g_under_discount" label="1">开启</el-radio>
              </el-col>
              <div v-if="ruleForm.g_under_discount == '1'">
                <el-col :span="5">
                  <el-form-item prop="g_discount_start_time">
                    <el-date-picker v-model="ruleForm.g_discount_start_time" type="datetime" placeholder="开始日期" style="width: 100%;" value-format="timestamp" />
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="1" :offset="1">~</el-col>
                <el-col :span="5">
                  <el-form-item prop="g_discount_end_time">
                    <el-date-picker v-model="ruleForm.g_discount_end_time" type="datetime" placeholder="结束时间" style="width: 100%;" value-format="timestamp" />
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

          <el-tab-pane label="商品图片" class="img-upload-pane">
            <el-form-item label="上传图片：" prop="imgList">
              <el-col :span="20">
                <ImgUpload v-model="ruleForm.imgList" />
              </el-col>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品规格">
            <el-header><el-button type="primary" size="mini" @click="addSpecify()">添加规格项目</el-button></el-header>
            <el-main v-if="specifyList.length > 0">
              <table v-for="(item, index) in specifyList" :key="item.id" style="width: 80%; margin: 15px; padding: 20px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);border-radius: 4px;">
                <el-row :gutter="24">
                  <el-col :span="2">
                    <el-form-item label="规格名：" />
                  </el-col>
                  <el-col :span="5"><el-input v-model="item.specifyValue" /></el-col>
                  <el-col :span="2">
                    <el-form-item label="Key：" />
                  </el-col>
                  <el-col :span="4">
                    <el-select v-model="item.customOptionKey" placeholder="请选择属性标识">
                      <el-option v-for="(cokItem, cokIndex) in customOptionKeyGourp" :key="cokIndex" :label="cokItem" :value="cokItem" />
                    </el-select>
                  </el-col>
                  <el-col :span="2">
                    <el-form-item label="排序：" />
                  </el-col>
                  <el-col :span="2"><el-input v-model="item.order" /></el-col>
                  <el-col :span="5">
                    <el-form-item>
                      <el-checkbox :checked="item.imgOpen == 1" @change="addSpecifyImg(index)">添加规格图片</el-checkbox>
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
                      <el-col v-if="item.imgOpen == 1" :span="5">
                        <el-form-item label="图片" />
                      </el-col>
                      <el-col :span="3">
                        <el-form-item label="默认" />
                      </el-col>
                      <el-col :span="3" />
                    </el-row>
                    <el-row v-for="(row, rowIndex) in item.children" :key="row.id" :gutter="24">
                      <el-col :span="9" :offset="1"><el-input v-model="row.specifyValue" /></el-col>
                      <el-col :span="3" :offset="1"><el-input v-model="row.order" /></el-col>
                      <el-col v-if="item.imgOpen == 1" :span="5">
                        <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" accept=".jpg,.jpeg,.png" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                          <img v-if="row.img" :src="row.img" class="avatar" @click="changeUpload(index, rowIndex)">
                          <i v-else class="el-icon-plus avatar-uploader-icon" @click="changeUpload(index, rowIndex)" />
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
            <template v-if="specifyList.length > 0">
              <el-row>
                <el-col :span="2" :offset="1"><el-button type="primary" size="small" @click="buildePriceStockList">重置价格表</el-button></el-col>
                <el-col :span="3"><el-button type="primary" size="small" @click="batchFillTable">批量填充</el-button></el-col>
                <el-col :span="15">
                  <el-form-item>
                    在标题栏中输入或选择内容可以进行筛选和批量填充
                  </el-form-item>
                </el-col>
              </el-row>
              <table v-if="priceStockTableBatch.specify.length > 0" class="price-stock-table" border="0" cellspacing="0" cellpadding="0">
                <tr class="price-stock-table-header">
                  <td v-for="(pstItem, pstIndex) in priceStockTableBatch.specify" :key="pstIndex">
                    <el-select v-model="pstItem.id" clearable placeholder="选择规格">
                      <el-option v-for="(sfItem) in pstItem.standard_format" :key="sfItem.id" :label="sfItem.specifyValue" :value="sfItem.id" />
                    </el-select>
                  </td>
                  <td>
                    <el-input v-model="priceStockTableBatch.price" placeholder="请输入价格" type="number" @mousewheel.native.prevent @keyup.native="prevent($event)" />
                  </td>
                  <td>
                    <el-input v-model="priceStockTableBatch.stock" placeholder="请输入库存" type="number" @mousewheel.native.prevent @keyup.native="prevent($event)" />
                  </td>
                </tr>
                <tr>
                  <td v-for="(items, idx) in specifyList" :key="idx">{{ items.specifyValue }}</td>
                  <td>价格</td><td>库存</td></tr>
                <template v-for="(item, idx) in priceStockList">
                  <tr :key="idx" class="row-hightlight">
                    <td v-for="(psItem, psIdx) in item.specify" :key="psIdx" :name="psItem.id">{{ psItem.specifyValue }}</td>
                    <td><el-input v-model="item.price" type="number" @mousewheel.native.prevent @keyup.native="prevent($event)" /></td>
                    <td><el-input v-model="item.stock" type="number" @mousewheel.native.prevent @keyup.native="prevent($event)" @input="countAllStock" @blur="resetStockInput(idx)" /></td>
                  </tr>
                </template>
              </table>
            </template>
            <br>
            <el-row>
              <el-col :span="1">
                <el-form-item label="划线价：" />
              </el-col>
              <el-col :span="7">
                <el-form-item>
                  <el-input v-model="ruleForm.througnLinePrice" type="number" @mousewheel.native.prevent @keyup.native="prevent($event)" />
                </el-form-item>
              </el-col>
              <el-col :span="16">
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
                  <span v-if="specifyList.length == 0">0</span>
                  <span v-else>{{ ruleForm.stockCount }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="分类选择">
            <el-tree ref="tree" :data="categoryList" show-checkbox default-expand-all node-key="c_id" highlight-current :props="categoryDefaultProps" :default-checked-keys="ruleForm.categoryListChecked" @check="handleCurrentChecked" />
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
              <el-table :data="ruleForm.gidRefList" stripe style="width: 60%">
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
import { getCategoryList, checkUrlKey, submitCreate, getGoodsInfo, getStandardImg } from '@/api/goods/standard'
import Tinymce from '@/components/Tinymce'
import ImgUpload from '@/components/ImgUpload'
import { in_array, createdTimeFormat } from '@/utils'
import { getToken } from '@/utils/auth'

export default {
  components: { Tinymce, ImgUpload },
  data() {
    return {
      token: null,
      gid: 0,
      editType: 'create',
      newSpcifyIndex: 0, // 新增规格临时下标
      newSpcifyValueIndex: 10, // 新增规格值的临时下标
      priceStockList: [],
      specifyList: [],
      priceStockTableBatch: {},
      customOptionKeyGourp: [
        'standard_color',
        'standard_dimension',
        'standard_pattern',
        'standard_style'
      ],
      categoryList: null,
      categoryDefaultProps: {
        children: 'children',
        label: 'name'
      },
      tempImgIndex: { // 规格中图片的临时下标
        index: 0,
        rowIndex: 0
      },
      uploadUrl: '/goods.php?action=imgUpload',
      cdnPrefix: '//du7nt18x31vr8.cloudfront.net/assets/images/product/',
      labelPosition: 'right',
      tabPosition: 'left',
      ruleForm: {
        seriesType: 'new_standard',
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
        g_under_discount: '0',
        g_add_time: '',
        g_discount_start_time: '',
        g_discount_end_time: '',
        imgList: [],
        g_desc: '',
        g_meta_title: '',
        g_meta_keywords: '',
        categoryListChecked: [], // 被选中的分类
        stockCount: 0, // 库存总计
        througnLinePrice: 0, // 划线价
        gidRefList: [],
        priceStockList: [],
        specifyList: []
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
        ],
        g_add_time: [
          { required: true, message: '请输入添加时间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.token = getToken()
    this.uploadUrl = this.uploadUrl + '&token=' + this.token
    this.editTypeCheck()
    this.fetchData()

    if (this.editType == 'edit') {
      this.getImgDetail()
    }
  },
  methods: {
    getGoodsInfo() { // 如果是编辑就获取商品信息
      getGoodsInfo(this.token, this.gid).then(response => {
        var ret = response.data
        var goodsInfo = ret.goodsInfo

        this.specifyList = ret.attrInfo
        this.priceStockList = ret.priceStockInfo
        // var refInfo = ret.refInfox
        this.ruleForm.g_sku = goodsInfo.g_sku
        this.ruleForm.g_name = goodsInfo.g_name
        this.ruleForm.g_alias = goodsInfo.g_alias
        this.ruleForm.g_weight = goodsInfo.g_weight
        this.ruleForm.g_status = goodsInfo.g_status
        this.ruleForm.g_order = goodsInfo.g_order
        this.ruleForm.g_recommended = goodsInfo.g_recommended == 1
        this.ruleForm.g_new = goodsInfo.g_new == 1
        this.ruleForm.g_hot = goodsInfo.g_hot == 1
        this.ruleForm.is_special_offer = goodsInfo.is_special_offer == 1
        this.ruleForm.g_under_discount = goodsInfo.g_under_discount
        this.ruleForm.g_discount_start_time = new Date(createdTimeFormat(goodsInfo.g_discount_start_time))
        this.ruleForm.g_discount_end_time = new Date(createdTimeFormat(goodsInfo.g_discount_end_time))
        this.ruleForm.g_add_time = new Date(createdTimeFormat(goodsInfo.g_add_time, 'date'))
        this.ruleForm.g_desc = goodsInfo.g_desc
        this.ruleForm.g_meta_title = goodsInfo.g_meta_title
        this.ruleForm.g_meta_keywords = goodsInfo.g_meta_keywords

        this.setDefaultCheckedTree(ret.categoryInfo)
        this.fetchPriceStockData(this.specifyList)
        this.priceStockBatchBar()
        this.countAllStock()
      })
    },
    editTypeCheck() { // 判断是编辑还是新增
      var reg = /\d/
      var pattern = new RegExp(reg)
      if (pattern.test(this.$route.params.id)) {
        this.gid = this.$route.params.id
        this.editType = 'edit'
        this.getGoodsInfo()
      }
    },
    filterSubmitData() {
      if (this.specifyList.length == 0) {
        this.$message.warning('请输入规格')
        return false
      } else if (this.ruleForm.imgList.length < 3) {
        this.$message.warning('产品图不足')
        return false
      } else if (this.ruleForm.categoryListChecked.length == 0) {
        this.$message.warning('选择分类')
        return false
      } else if (this.ruleForm.g_sku.trim() == '') {
        this.$message.warning('请填写SKU')
        return false
      } else if (this.ruleForm.g_name.trim() == '') {
        this.$message.warning('请填写商品名称')
        return false
      } else if (this.ruleForm.g_alias.trim() == '') {
        this.$message.warning('请填写URL KEY')
        return false
      } else if (this.ruleForm.g_add_time == '') {
        this.$message.warning('请填写添加时间')
        return false
      }

      return true
    },
    onSubmit() {
      if (!this.filterSubmitData()) {
        return false
      }
      this.ruleForm.specifyList = this.specifyList
      this.ruleForm.priceStockList = this.priceStockList

      submitCreate(this.token, this.ruleForm).then(response => {
        this.$message.success(response.data)
      })
    },
    priceStockBatchBar() { // 组装价格库存批处理的数据
      var allOptions = { id: 0, specifyValue: 'All' }
      this.priceStockTableBatch.specify = []

      for (let index = 0; index < this.specifyList.length; index++) {
        var children = JSON.parse(JSON.stringify(this.specifyList[index].children))
        children.unshift(allOptions)

        var obj = {}
        obj['standard_format'] = children
        obj['name'] = this.specifyList[index].specifyValue
        this.priceStockTableBatch.specify.push(obj)
      }
    },
    fetchPriceStockData(list) { // 组装价格库存数据
      var iterator = []
      switch (list.length) {
        case 1:
          var index = 0
          var children = list[index].children
          if (children) {
            children.forEach(e => {
              var specify = []
              var temp = {}
              specify.push({ id: e.id, specifyValue: e.specifyValue })
              temp.specify = specify
              temp.price = 0
              temp.stock = 0
              iterator.push(temp)
            })
          }
          break
        case 2:
          var idx = 0
          var idx1 = 1
          var child = list[idx].children
          var child1 = list[idx1].children
          if (child) {
            child.forEach(e => {
              var spec = []
              spec.push({ id: e.id, specifyValue: e.specifyValue })
              if (child1) {
                var childSpec = []
                child1.forEach(ele => {
                  childSpec = spec.concat([{ id: ele.id, specifyValue: ele.specifyValue }])
                  var tem = {}
                  tem.specify = childSpec
                  tem.price = 0
                  tem.stock = 0
                  iterator.push(tem)
                })
              }
            })
          }
          break
        case 3:
          var idxs = 0
          var idxs1 = 1
          var idxs2 = 2
          var childs = list[idxs].children
          var childs1 = list[idxs1].children
          var childs2 = list[idxs2].children
          if (childs) {
            childs.forEach(e => {
              var specs = []
              specs.push({ id: e.id, specifyValue: e.specifyValue })
              if (childs1) {
                var childSpecs = []
                childs1.forEach(ele => {
                  childSpecs = specs.concat([{ id: ele.id, specifyValue: ele.specifyValue }])
                  if (childs2) {
                    var childSpec = []
                    childs2.forEach(element => {
                      childSpec = childSpecs.concat([{ id: element.id, specifyValue: element.specifyValue }])
                      var tem = {}
                      tem.specify = childSpec
                      tem.price = 0
                      tem.stock = 0
                      iterator.push(tem)
                    })
                  }
                })
              }
            })
          }
          break
        default:
          break
      }
      this.priceStockList = iterator
    },
    fetchData() {
      getCategoryList(this.token).then(response => {
        this.categoryList = response.data.items
      })
    },
    prevent(e) {
      var keynum = window.event ? e.keyCode : e.which // 获取键盘码

      if (keynum == 189 || keynum == 190 || keynum == 109 || keynum == 110) {
        this.$message.warning('禁止输入小数以及负数')
        e.target.value = ''
      }
    },
    getImgDetail() {
      getStandardImg(this.token, this.gid).then(res => {
        res.data.forEach(e => {
          this.ruleForm.imgList.push(e)
        })
      })
    },
    addSpecify() { // 添加规格项目
      if (this.specifyList.length >= 3) {
        this.$message.error('规格项目不能超过3个')
        return
      }

      this.newSpcifyIndex += 1
      var i1 = this.newSpcifyValueIndex += 1
      var i2 = this.newSpcifyValueIndex += 1
      var i3 = this.newSpcifyValueIndex += 1

      var v = {
        id: this.newSpcifyIndex,
        specifyValue: '',
        customOptionKey: '',
        order: '',
        imgOpen: 0,
        deleted: 0,
        children: [
          { id: i1, specifyValue: '', order: '', img: '', default: 1, deleted: 0 },
          { id: i2, specifyValue: '', order: '', img: '', default: 0, deleted: 0 },
          { id: i3, specifyValue: '', order: '', img: '', default: 0, deleted: 0 }
        ]
      }
      this.specifyList.push(v)
      this.fetchPriceStockData(this.specifyList)

      this.renderPriceStockBatchTable()
      this.priceStockBatchBar()
      this.countAllStock()
    },
    gnameToUrlkey() { // 商品名复制到url-key
      var gName = this.ruleForm.g_name.trim()
      if (gName != '') {
        checkUrlKey(this.token, gName).then(response => {
          this.ruleForm.g_alias = response.data.url
        })
      }
    },
    handleCurrentChecked(nodeObj, selectedObj, a, b) { // 获取分类树点击
      var checked = []
      if (selectedObj.checkedNodes) {
        selectedObj.checkedNodes.forEach(e => {
          if (e.c_id) {
            checked.push(e.c_id)
          }
        })
      }
      this.ruleForm.categoryListChecked = checked
    },
    renderPriceStockBatchTable() { // 生成批量修改的那些数据
      var specify = []

      this.specifyList.forEach(e => {
        var obj = {}
        obj['id'] = ''
        obj['standard_format'] = []
        obj['name'] = e.specifyValue

        specify.push(obj)
      })

      this.priceStockTableBatch.specify = specify
    },
    removeSpecify(index) { // 删除规格项目
      this.specifyList.splice(index, 1)
      this.fetchPriceStockData(this.specifyList)
      this.renderPriceStockBatchTable()
      this.priceStockBatchBar()
      this.countAllStock()
    },
    addSpecifyImg(index) { // 添加规格图片
      this.specifyList[index].imgOpen = event.target.checked
    },
    addSpecifyValue(index) { // 添加规格值
      this.newSpcifyValueIndex += 1
      var v = { id: this.newSpcifyValueIndex, specifyValue: '', order: '', img: '', default: 0, deleted: 0, price: 0, stock: 0 }
      this.specifyList[index].children.push(v)
    },
    removeSpecifyValue(index, rowIndex) { // 删除规格值
      var isRemoveChecked = false

      if (this.specifyList[index].children[rowIndex].default == 1) {
        isRemoveChecked = true
      }
      this.specifyList[index].children.splice(rowIndex, 1)

      if (isRemoveChecked) {
        this.specifyList[index].children[0].default = 1
      }
    },
    specifyValueCheck(index, rowIndex) { // 规格值默认项选中
      this.specifyList[index].children.forEach(e => {
        e.default = 0
      })
      this.specifyList[index].children[rowIndex].default = 1
    },
    handleAvatarSuccess(res) {
      if (!res.code) {
        var index = this.tempImgIndex.index
        var rowIndex = this.tempImgIndex.rowIndex
        var img = this.cdnPrefix + res.result.filename
        this.specifyList[index].children[rowIndex].img = img
      } else {
        this.$message.error(res.msg)
      }
    },
    changeUpload(index, rowIndex) {
      this.tempImgIndex.index = index
      this.tempImgIndex.rowIndex = rowIndex
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
    },
    buildePriceStockList() { // 重置价格表
      const oldPriceStockList = this.priceStockList
      this.priceStockList = []
      this.fetchPriceStockData(this.specifyList)
      const newPriceStockList = this.priceStockList

      if (!oldPriceStockList) { return }
      this.matchPriceStock(oldPriceStockList, newPriceStockList)
      this.priceStockBatchBar()
      this.countAllStock()
      this.$message.success('重置成功')
    },
    matchPriceStock(oldList, newList) {
      var newListSpecify = this.formatSpecifyList(newList)
      var oldListSpecify = this.formatSpecifyList(oldList)
      var specifyLength = newListSpecify[0].specify.length

      // todo 这里试着优化下
      newListSpecify.forEach(e => {
        oldListSpecify.forEach(ele => {
          switch (specifyLength) {
            case 1:
              if (e.specify[0].specifyValue == ele.specify[0].specifyValue) {
                e.price = ele.price
                e.stock = ele.stock
              }
              break
            case 2:
              if (e.specify[0].specifyValue == ele.specify[0].specifyValue && e.specify[1].specifyValue == ele.specify[1].specifyValue) {
                e.price = ele.price
                e.stock = ele.stock
              }
              break
            case 3:
              if (e.specify[0].specifyValue == ele.specify[0].specifyValue && e.specify[1].specifyValue == ele.specify[1].specifyValue && e.specify[2].specifyValue == ele.specify[2].specifyValue) {
                e.price = ele.price
                e.stock = ele.stock
              }
              break
          }
        })
      })

      this.priceStockList = this.rewriteFormatSpecify(newListSpecify, specifyLength)
    },
    rewriteFormatSpecify(list, specifyLength) { // 对新的list写回原来的格式
      if (!list) { return }
      var newList = []

      list.forEach(e => {
        var specify = []
        for (let index = 0; index < specifyLength; index++) {
          specify.push({ id: e.specify[index].id, specifyValue: e.specify[index].specifyValue })
        }

        var obj = {}
        obj.specify = specify
        obj.price = e.price
        obj.stock = e.stock
        newList.push(obj)
      })

      return newList
    },
    formatSpecifyList(list) {
      if (!list) { return }
      var newList = []

      list.forEach(e => {
        var obj = {}
        var specify = []
        e.specify.forEach(el => {
          specify.push({ id: el.id, specifyValue: el.specifyValue })
        })
        obj.specify = specify
        obj.price = e.price
        obj.stock = e.stock
        newList.push(obj)
      })

      return newList
    },
    batchFillTable() { // 批量填充价格库存表
      var specify = this.priceStockTableBatch.specify
      var specifySelected = []

      if (specify) {
        specify.forEach(e => {
          var selected = []

          if (e.id === '') {
            this.$message.warning('请输入批量修改 ' + e.name)
            return false
          }

          if (e.id == 0) {
            for (let index = 1; index < e.standard_format.length; index++) {
              selected.push(e.standard_format[index].specifyValue)
            }
          } else {
            var selectedId = e.id
            for (let index = 1; index < e.standard_format.length; index++) {
              if (e.standard_format[index].id == selectedId) {
                selected.push(e.standard_format[index].specifyValue)
              }
            }
          }

          specifySelected.push(selected)
        })
      }

      if (!this.priceStockTableBatch.price) {
        this.$message.warning('请输入批量修改 价格')
        return false
      }

      if (!this.priceStockTableBatch.stock) {
        this.$message.warning('请输入批量修改 库存')
        return false
      }

      var batchObj = {}
      batchObj.specify = specifySelected
      batchObj.price = this.priceStockTableBatch.price
      batchObj.stock = this.priceStockTableBatch.stock

      this.batchFillOperate(batchObj)
      this.countAllStock()
    },
    batchFillOperate(batchObj) { // 开始真正的批量操作
      var batchSpecify = batchObj.specify
      var specifyLength = batchSpecify.length

      this.priceStockList.forEach(e => {
        // todo 这里需要优化下
        switch (specifyLength) {
          case 1:
            var specify = batchSpecify[0]
            if (in_array(e.specify[0].specifyValue, specify)) {
              e.price = batchObj.price
              e.stock = batchObj.stock
            }
            break
          case 2:
            var specify1 = batchSpecify[0]
            var specify2 = batchSpecify[1]
            if (in_array(e.specify[0].specifyValue, specify1) && in_array(e.specify[1].specifyValue, specify2)) {
              e.price = batchObj.price
              e.stock = batchObj.stock
            }
            break
          case 3:
            var specifys1 = batchSpecify[0]
            var specifys2 = batchSpecify[1]
            var specifys3 = batchSpecify[2]
            if (in_array(e.specify[0].specifyValue, specifys1) && in_array(e.specify[1].specifyValue, specifys2) && in_array(e.specify[2].specifyValue, specifys3)) {
              e.price = batchObj.price
              e.stock = batchObj.stock
            }
            break
        }
      })
    },
    countAllStock() { // 计算总库存
      var stockCount = 0
      if (this.priceStockList) {
        var priceStockList = this.priceStockList

        priceStockList.forEach(e => {
          stockCount += parseInt(e.stock)
        })
        this.ruleForm.stockCount = stockCount
      }
    },
    resetStockInput(index) { // 库存input空的话改0
      if (this.priceStockList[index].stock.trim() === '') {
        this.priceStockList[index].stock = 0
      }
    },
    setDefaultCheckedTree(list) { // 动态选中赋值分类tree
      list.forEach(e => {
        this.ruleForm.categoryListChecked.push(e.c_id)
      })
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
  .price-stock-table .price-stock-table-header td {
    background:rgb(242, 242, 242, 1);
  }
  .price-stock-table {
    width: 80%; margin: 0 0 0 30px; border: 1px solid #ebeef5;
  }
  .price-stock-table td {
    border: 1px solid #ebeef5;
    padding: 10px 10px;
    min-width: 0;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align:center;
  }
  .row-hightlight:hover{
    background: rgb(242, 242, 242, 1);
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }
</style>
