<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="6">
          <h2 v-if="editType == 'create'">新增商品</h2>
          <h2 v-else>编辑商品</h2>
        </el-col>
        <el-col :span="2" :offset="10"><el-button type="info" @click="goBack()">返回列表</el-button></el-col>
        <el-col :span="1">
          <el-button type="primary" @click="onSubmit()">保存</el-button>
        </el-col>
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
                <el-input v-model="ruleForm.g_alias" readonly />
              </el-col>
              <el-col :span="12"><el-button v-if="ruleForm.g_alias != '' && editType == 'edit'" type="primary" size="small" @click="editUrlKey()">修改</el-button></el-col>
            </el-form-item>
            <el-form-item label="克重：" prop="g_weight">
              <el-col :span="12">
                <el-input v-model="ruleForm.g_weight" />
              </el-col>
              <el-col :span="12">（需填写单位，例如：300g/㎡）</el-col>
            </el-form-item>
            <el-form-item v-if="ruleForm.g_alias != '' && editType == 'edit'" label="重定向URL：" prop="g_url">
              <el-col :span="12">
                <el-input v-model="ruleForm.g_alias" disabled />
              </el-col>
              <el-col :span="12"><el-button type="danger" size="small" @click="setRedirect()">301重定向设置</el-button></el-col>
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
                    <el-date-picker v-model="ruleForm.g_discount_start_time" type="datetime" placeholder="开始日期" style="width: 100%;" @blur="checkDiscountTime()" />
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="1" :offset="1">~</el-col>
                <el-col :span="5">
                  <el-form-item prop="g_discount_end_time">
                    <el-date-picker v-model="ruleForm.g_discount_end_time" type="datetime" placeholder="结束时间" style="width: 100%;" @blur="checkDiscountTime()" />
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
                <ImgUpload v-model="ruleForm.imgList" :edit-type="editType" />
              </el-col>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品规格">
            <el-header>
              <el-button type="primary" size="mini" @click="addSpecify()">添加规格项目</el-button>
            </el-header>
            <el-main v-if="specifyList.length > 0">
              <table v-for="(item, index) in specifyList" :key="item.id" class="price-stock-table">
                <el-row :gutter="24">
                  <el-col :span="2">
                    <el-form-item label="规格名：" />
                  </el-col>
                  <el-col :span="5"><el-input v-model="item.specifyValue" /></el-col>
                  <el-col :span="2">
                    <el-form-item label="标识：" />
                  </el-col>
                  <el-col :span="4">
                    <el-select v-model="specifyList[index].customOptionKey" placeholder="请选择属性标识">
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
                      <el-col :span="7">
                        <el-form-item label="规则值" />
                      </el-col>
                      <el-col :span="4">
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
                      <el-col :span="8"><el-input v-model="row.specifyValue" /></el-col>
                      <el-col :span="3"><el-input v-model="row.order" /></el-col>
                      <el-col v-if="item.imgOpen == 1" :span="9">
                        <el-upload :ref="'upload' + index" class="avatar-uploader" action="" :show-file-list="false" :auto-upload="false" accept=".jpg,.jpeg,.png" :limit="1" :on-change="(file, fileList) => {handleUploadChange(file, fileList, index, rowIndex)}">
                          <img v-if="row.img" :src="cdnPrefix + row.img" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon" />
                          <span v-if="row.isUploading" style="position: absolute; bottom: 0; left: 0; color: #8c939d">正在上传...</span>
                        </el-upload>
                      </el-col>
                      <el-col :span="2">
                        <input type="radio" :name="item.id" :checked="row.default == 1" @click="resetCheckbox(index, rowIndex)">
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
                <tr class="price-stock-table-header price-stock-table-th">
                  <td v-for="(pstItem, pstIndex) in priceStockTableBatch.specify" :key="pstIndex">
                    <el-select v-model="pstItem.id" clearable placeholder="选择规格" @change="batchBarSelect()">
                      <el-option v-for="(sfItem) in pstItem.standard_format" :key="sfItem.id" :label="sfItem.specifyValue" :value="sfItem.id" />
                    </el-select>
                  </td>
                  <td>
                    <el-input v-model="priceStockTableBatch.price" placeholder="请输入价格" type="number" @mousewheel.native.prevent @keyup.native="prevent($event)" @input="batchBarSelect($event)" />
                  </td>
                  <td>
                    <el-input v-model="priceStockTableBatch.stock" placeholder="请输入库存" type="number" @mousewheel.native.prevent @keyup.native="prevent($event)" @input="batchBarSelect($event)" />
                  </td>
                </tr>
                <tr class="price-stock-table-th">
                  <td v-for="(items, idx) in specifyList" :key="idx">{{ items.specifyValue }}</td>
                  <td>价格</td><td>库存</td></tr>
                <template v-for="(item, idx) in priceStockList">
                  <tr :key="idx" class="row-hightlight">
                    <td v-for="(psItem, psIdx) in item.specify" :key="psIdx" :name="psItem.id">{{ psItem.specifyValue }}</td>
                    <td><el-input v-model="priceStockList[idx].price" type="number" @mousewheel.native.prevent @keyup.native="prevent($event)" /></td>
                    <td><el-input v-model="priceStockList[idx].stock" type="number" @mousewheel.native.prevent @keyup.native="prevent($event)" @input="countAllStock" @blur="resetStockInput(idx)" /></td>
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
                  <el-input v-model="ruleForm.throughLinePrice" type="number" @mousewheel.native.prevent @keyup.native="prevent($event)" />
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
                <el-button type="primary" size="small" @click="fillMetaTitle()">填充商品名称</el-button>
              </el-col>
            </el-form-item>
            <el-form-item label="META关键词：">
              <el-col :span="12">
                <el-input v-model="ruleForm.g_meta_keywords" type="textarea" prop="g_meta_keywords" />
              </el-col>
              <el-col :span="12">
                <el-button type="primary" size="small" @click="fillMetaKeywords()">填充商品分类信息</el-button>
              </el-col>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane v-if="editType == 'edit'" label="关联商品">
            <el-form-item label="商品ID">
              <el-col :span="12">
                <el-input v-model="refGid" placeholder="输入ID" />
              </el-col>
              <el-col :span="4">
                <el-button type="primary" size="small" @click="addRefGid">加入</el-button>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-table :data="ruleForm.gidRefList" stripe style="width: 180px;">
                <el-table-column label="商品ID" width="100">
                  <template slot-scope="scope">
                    <span>{{ scope.row.rgr_recommend_gid }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="70">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delRecommendGid(scope.row.rgr_id, scope)">删除</el-button>
                  </template>
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
import { getCategoryList, checkUrlKey, submitCreateOrEdit, getGoodsInfo, getStandardImg, editAlias, getAlias, setRedirectUrl, uploadImg, addRefGoods, removeSpecify, removeSpecifyValue, delRefGoods } from '@/api/goods/standard'
import Tinymce from '@/components/Tinymce'
import ImgUpload from '@/components/ImgUpload'
import { in_array, createdTimeFormat } from '@/utils'
import { getToken } from '@/utils/auth'
import { Loading } from 'element-ui'

export default {
  components: { Tinymce, ImgUpload },
  data() {
    return {
      loading: null,
      token: null,
      editRedirect: { // 临时的变
        redirectId: null,
        redirectUrl: null
      },
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
        label: function(data) {
          return data.name + ' ' + data.desc
        }
      },
      tempImgIndex: { // 规格中图片的临时下标
        index: 0,
        rowIndex: 0
      },
      refGid: null,
      uploadUrl: '/goods.php?action=imgUpload',
      cdnPrefix: '//du7nt18x31vr8.cloudfront.net/assets/images/product/',
      labelPosition: 'right',
      tabPosition: 'left',
      ruleForm: {
        seriesType: 'new_standard',
        gid: 0,
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
        throughLinePrice: 0, // 划线价
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
    this.getCategoryList()
    this.editTypeCheck()

    if (this.editType == 'edit') {
      this.getImgDetail()
    }
  },
  methods: {
    getGoodsInfo() { // 如果是编辑就获取商品信息
      getGoodsInfo(this.token, this.ruleForm.gid).then(response => {
        var ret = response.data
        this.setDefaultCheckedTree(ret.categoryInfo)

        var goodsInfo = ret.goodsInfo
        this.specifyList = ret.attrInfo
        this.priceStockList = ret.priceStockInfo
        this.ruleForm.gidRefList = ret.refInfo
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
        this.ruleForm.g_discount_start_time = goodsInfo.g_discount_start_time == 0 ? '' : new Date(createdTimeFormat(goodsInfo.g_discount_start_time))
        this.ruleForm.g_discount_end_time = goodsInfo.g_discount_end_time == 0 ? '' : new Date(createdTimeFormat(goodsInfo.g_discount_end_time))
        this.ruleForm.g_add_time = new Date(createdTimeFormat(goodsInfo.g_add_time, 'date'))
        this.ruleForm.g_desc = goodsInfo.g_desc
        this.ruleForm.g_meta_title = goodsInfo.g_meta_title
        this.ruleForm.g_meta_keywords = goodsInfo.g_meta_keywords
        this.ruleForm.throughLinePrice = goodsInfo.default_price

        this.priceStockBatchBar()
        this.countAllStock()
      })
    },
    editTypeCheck() { // 判断是编辑还是新增
      var reg = /\d/
      var pattern = new RegExp(reg)
      if (pattern.test(this.$route.params.id)) {
        this.ruleForm.gid = this.$route.params.id
        this.editType = 'edit'
        this.getGoodsInfo()
      }
    },
    filterSubmitData() {
      if (this.ruleForm.g_sku.trim() == '') {
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
      } else if (this.ruleForm.imgList.length < 3) {
        this.$message.warning('产品图不足')
        return false
      } else if (this.specifyList.length == 0) {
        this.$message.warning('请输入规格')
        return false
      } else if (this.ruleForm.categoryListChecked.length == 0) {
        this.$message.warning('选择分类')
        return false
      } else if (!this.checkThrougnLinePrice()) {
        return false
      } else if (!this.checkDiscountTime()) {
        return false
      }

      return true
    },
    filterSpecifyValuePrice() { // 检查价格表价格是否有0
      for (var i of this.priceStockList) {
        if (i.price == 0) {
          var msg = '价格未填： '
          for (var k of i.specify) {
            msg += k.specifyValue + ' '
          }
          this.$message.warning(msg)
          return false
        }
      }

      return true
    },
    onSubmit() {
      if (!this.filterSubmitData()) { return false }
      this.ruleForm.specifyList = this.specifyList
      this.ruleForm.priceStockList = this.priceStockList
      // if (this.editType == 'edit') { this.buildePriceStockList(false) }
      if (!this.checkSpecifyValue()) { return false }
      if (!this.filterSpecifyValuePrice()) { return false }

      this.$loading()
      submitCreateOrEdit(this.token, this.ruleForm, this.editType).then(response => {
        this.$message.success(response.data)
        this.$loading().close()
        if (this.editType == 'edit') {
          this.$router.go(0)
        } else {
          this.$router.push(`../standard_goods`)
        }
      })
    },
    priceStockBatchBar() { // 组装价格库存批处理的数据
      var allOptions = { id: 0, specifyValue: 'All' }
      this.priceStockTableBatch.specify = []

      for (let index = 0; index < this.specifyList.length; index++) {
        var children = JSON.parse(JSON.stringify(this.specifyList[index].children))
        children.unshift(allOptions)

        var obj = {}
        obj['id'] = ''
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
    getCategoryList() {
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
      getStandardImg(this.token, this.ruleForm.gid).then(res => {
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
          { id: i1, specifyValue: '', order: '', img: '', default: 1, deleted: 0, isUploading: false },
          { id: i2, specifyValue: '', order: '', img: '', default: 0, deleted: 0, isUploading: false },
          { id: i3, specifyValue: '', order: '', img: '', default: 0, deleted: 0, isUploading: false }
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
      if (this.specifyList[index].id > 100) {
        this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeSpecify(this.token, this.specifyList[index].id).then(response => {
            this.specifyList.splice(index, 1)
          })
        }).catch(() => {})
      } else {
        this.specifyList.splice(index, 1)
      }

      this.fetchPriceStockData(this.specifyList)
      this.renderPriceStockBatchTable()
      this.priceStockBatchBar()
      this.countAllStock()
    },
    addSpecifyImg(index) { // 添加规格图片
      if (event.target.checked) {
        this.specifyList[index].imgOpen = 1
      } else {
        this.specifyList[index].imgOpen = 0
      }
    },
    addSpecifyValue(index) { // 添加规格值
      if (this.specifyList[index].children.length >= 10) {
        this.$message.warning('规格已超 10 个')
        return false
      }
      this.newSpcifyValueIndex += 1
      var v = { id: this.newSpcifyValueIndex, specifyValue: '', order: '', img: '', default: 0, deleted: 0, isUploading: false }
      this.specifyList[index].children.push(v)
    },
    removeSpecifyValue(index, rowIndex) { // 删除规格值
      var isRemoveChecked = false
      if (this.specifyList[index].children[rowIndex].default == 1) {
        isRemoveChecked = true
      }

      if (this.specifyList[index].children[rowIndex].id > 500) {
        this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeSpecifyValue(this.token, this.specifyList[index].children[rowIndex].id).then(response => {
            this.specifyList[index].children.splice(rowIndex, 1)
            if (isRemoveChecked && this.specifyList[index].children.length > 0) {
              this.specifyList[index].children[0].default = 1
            }
          })
        }).catch(() => {})
      } else {
        this.specifyList[index].children.splice(rowIndex, 1)
        if (isRemoveChecked && this.specifyList[index].children.length > 0) {
          this.specifyList[index].children[0].default = 1
        }
      }
    },
    resetCheckbox(index, rowIndex) { // checkbox确认
      for (var it of this.specifyList[index].children) {
        it.default = 0
      }

      this.specifyList[index].children[rowIndex].default = 1
    },
    specifyValueCheck(index, rowIndex) { // 规格值默认项选中
      this.specifyList[index].children.forEach(e => {
        e.default = 0
      })
      this.specifyList[index].children[rowIndex].default = 1
    },
    handleUploadChange(file, fileList, index, rowIndex) { // 规格图片上传
      this.$refs['upload' + index][rowIndex].clearFiles()
      this.specifyList[index].children[rowIndex].isUploading = true

      const formData = new FormData()
      formData.append('file', file.raw)

      uploadImg(this.token, formData, index, rowIndex).then(response => {
        var index = response.data.index
        var rowIndex = response.data.rowIndex

        this.specifyList[index].children[rowIndex].isUploading = false
        this.specifyList[index].children[rowIndex].img = response.data.gi_img
      })
    },
    buildePriceStockList(alert = true) { // 重置价格表
      const oldPriceStockList = this.priceStockList
      this.priceStockList = []
      this.fetchPriceStockData(this.specifyList)
      const newPriceStockList = this.priceStockList

      if (!oldPriceStockList) { return false }
      this.matchPriceStock(oldPriceStockList, newPriceStockList)
      this.priceStockBatchBar()
      this.countAllStock()
      this.priceStockTableBatch.price = ''
      this.priceStockTableBatch.stock = ''
      if (alert) { this.$message.success('重置成功') }
    },
    matchPriceStock(oldList, newList) { // 旧表数据回填到新表
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
    formatSpecifyList(list) { // 格式化规格的数据用于重置价库表
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
        for (var item of specify) {
          var selected = []
          if (item.id === '') {
            this.$message.warning('请输入批量修改 规格 ' + item.name)
            return false
          }
          if (item.id == 0) {
            for (let index = 1; index < item.standard_format.length; index++) {
              selected.push(item.standard_format[index].specifyValue)
            }
          } else {
            var selectedId = item.id
            for (let index = 1; index < item.standard_format.length; index++) {
              if (item.standard_format[index].id == selectedId) {
                selected.push(item.standard_format[index].specifyValue)
              }
            }
          }
          specifySelected.push(selected)
        }
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
              if (typeof (batchObj.price) != 'undefined' && batchObj.price != '') { e.price = batchObj.price }
              if (typeof (batchObj.stock) != 'undefined' && batchObj.stock != '') { e.stock = batchObj.stock }
            }
            break
          case 2:
            var specify1 = batchSpecify[0]
            var specify2 = batchSpecify[1]
            if (in_array(e.specify[0].specifyValue, specify1) && in_array(e.specify[1].specifyValue, specify2)) {
              if (typeof (batchObj.price) != 'undefined' && batchObj.price != '') { e.price = batchObj.price }
              if (typeof (batchObj.stock) != 'undefined' && batchObj.stock != '') {
                e.stock = batchObj.stock
              }
            }
            break
          case 3:
            var specifys1 = batchSpecify[0]
            var specifys2 = batchSpecify[1]
            var specifys3 = batchSpecify[2]
            if (in_array(e.specify[0].specifyValue, specifys1) && in_array(e.specify[1].specifyValue, specifys2) && in_array(e.specify[2].specifyValue, specifys3)) {
              if (typeof (batchObj.price) != 'undefined' && batchObj.price != '') { e.price = batchObj.price }
              if (typeof (batchObj.stock) != 'undefined' && batchObj.stock != '') { e.stock = batchObj.stock }
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
      for (var i of list) {
        this.ruleForm.categoryListChecked.push(i.c_id)
      }

      this.$nextTick(function() {
        this.$refs.tree.setCheckedKeys(this.ruleForm.categoryListChecked)
      })

      // return true
    },
    editUrlKey() { // 修改url-key
      this.$prompt(' 原url key:   ' + this.ruleForm.g_alias, '修改 URL KEY', {
      }).then(({ value }) => {
        if (!value) {
          this.$message.warning('请输入新的url key')
          return
        }

        if (value.trim() == this.ruleForm.g_alias.trim()) {
          this.$message.warning('输入一致，请重输')
          return
        }

        editAlias(this.token, value, this.ruleForm.gid).then(response => {
          if (response.data.code != 200) {
            this.$message.warning(response.data.msg)
            return
          }

          this.ruleForm.g_alias = value
          this.$message.success(response.data.msg)
        })
      })
    },
    getRedirect() { // 获取有效值
      this.loading = Loading.service({
        text: '获取中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })

      getAlias(this.token, this.ruleForm.gid).then(response => {
        this.editRedirect.redirectId = response.data.r_id
        this.editRedirect.redirectUrl = response.data.redirect
      })

      this.loading.close()
    },
    setRedirect() { // 修改301重定向
      this.getRedirect()
      this.$prompt(' request_path:   ' + this.ruleForm.g_alias, '301重定向', {
      }).then(({ value }) => {
        if (!value) {
          this.$message.warning('请输入 target_path')
          return
        }

        if (value.trim() == this.editRedirect.redirectUrl.trim()) {
          this.$message.warning('输入一致，请重输')
          return
        }

        setRedirectUrl(this.token, value, this.editRedirect.redirectId).then(response => {
          this.ruleForm.g_alias = value
          this.$message.success(response.data.msg)
        })
      })
    },
    fillMetaTitle() {
      if (!this.ruleForm.g_name.trim()) {
        this.$message.warning('商品名称未填')
        return
      }
      this.ruleForm.g_meta_title = this.ruleForm.g_name
    },
    fillMetaKeywords() {
      if (this.ruleForm.categoryListChecked.length == 0) {
        this.$message.warning('商品分类未勾选')
        return
      }

      var cateIdArr = this.ruleForm.categoryListChecked
      var cateInfo = ''

      this.categoryList.forEach(e => {
        e.children.forEach(el => {
          if (in_array(el.c_id, cateIdArr)) {
            cateInfo += el.name + ','
          }
        })
      })

      this.ruleForm.g_meta_keywords = cateInfo.substring(0, cateInfo.length - 1)
    },
    checkDiscountTime() { // 检查活动起止时间
      if (this.ruleForm.g_under_discount == 1) {
        if (!this.ruleForm.g_discount_start_time) {
          this.$message.warning('促销开始时间必填')
          return false
        } else if (!this.ruleForm.g_discount_end_time) {
          this.$message.warning('促销结束时间必填')
          return false
        }
      }

      if (this.ruleForm.g_discount_start_time && this.ruleForm.g_discount_end_time && this.ruleForm.g_under_discount == 1) {
        if (this.ruleForm.g_discount_start_time >= this.ruleForm.g_discount_end_time) {
          this.$message.warning('结束时间必须大于开始时间')
          return false
        }
      }

      return true
    },
    checkSpecifyValue() { // 检查规则值空，或重复
      if (this.specifyList.length == 0) { return }

      var list = this.specifyList
      var specify = [] // 规格名称集合
      var specifyValue = [] // 规格值集合
      var flag = true

      for (var item of list) {
        var a = item.specifyValue.trim()
        if (!a) {
          this.$message.warning(`请输入规格名称 或 删除空配置`)
          flag = false
          break
        } else if (!item.customOptionKey.trim()) {
          this.$message.warning(`请选择规格 ${a} 的标识`)
          flag = false
          break
        }
        specify.push(a)
        var arr = []
        for (var k of item.children) {
          var b = k.specifyValue.trim()
          var c = k.img

          if (!b) {
            this.$message.warning(`请输入 ${a} 规格值 或 删除空配置`)
            flag = false
            break
          }

          if (!c && item.imgOpen == 1) {
            this.$message.warning(`请上传 ${a} ${b} 的图片`)
            flag = false
            break
          }
          arr.push(b)
        }
        specifyValue.push(arr)
      }

      if (!flag) { return false }

      for (var i = 0; i < specify.length - 1; i++) {
        if (specify[i] == specify[i + 1]) {
          this.$message.warning('重复规格名称：' + specify[i])
          return false
        }
      }

      for (var it of specifyValue) {
        for (var j = 0; j < it.length - 1; j++) {
          if (it[j] == it[j + 1]) {
            this.$message.warning('重复规格值：' + it[j] + ', 请重置')
            return false
          }
        }
      }

      for (var items of this.specifyList) {
        if (item.children.length == 0) {
          this.$message.warning(`请设置规格 ${items.specifyValue} 的规格值`)
          return false
        }
      }

      return true
    },
    addRefGid() { // 添加关联商品
      addRefGoods(this.token, this.refGid, this.ruleForm.gid).then(response => {
        if (response.data.error == 1) {
          this.$message.error(response.data.msg)
          return
        }

        this.ruleForm.gidRefList.push(response.data.obj)
      })
    },
    delRecommendGid(id, scope) { // 删除关联产品
      delRefGoods(this.token, id).then(response => {
        this.$message.success(response.data)
        this.ruleForm.gidRefList.splice(scope.$index)
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    batchBarSelect() { // batchBar触发强制刷新
      this.$forceUpdate()
    },
    checkThrougnLinePrice() { // 检查划线价是否高于规格最高价
      if (parseFloat(this.ruleForm.throughLinePrice) > 0) {
        for (var i of this.priceStockList) {
          if (parseFloat(this.ruleForm.throughLinePrice) <= parseFloat(i.price)) {
            this.$message.warning('划线价未超过规格最高价')
            return false
          }
        }
      }
      return true
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
  .price-stock-table{width: 80%; margin: 15px; padding: 20px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);border-radius: 4px;}
  .price-stock-table-th {font-weight: 700; color: #606266;}
</style>
