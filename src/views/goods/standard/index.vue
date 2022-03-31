<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <el-button type="primary" @click="createGoods()">新增</el-button>
      </el-header>
      <el-main>
        <el-table
          v-loading="listLoading"
          :row-style="{height:0+'px'}"
          :cell-style="{padding:0+'px'}"
          header-cell-style="background: rgb(244, 244, 245, 0.6);"
          :data="tableData"
          element-loading-text="Loading"
          height="780"
          border
          fit
          highlight-current-row
        >
          <el-table-column fixed="left" align="center" label="商品ID" width="95">
            <template slot-scope="scope">
              {{ scope.row.g_id }}
            </template>
          </el-table-column>
          <el-table-column label="SKU" width="95" align="center">
            <template slot-scope="scope">
              {{ scope.row.g_sku }}
            </template>
          </el-table-column>
          <el-table-column label="商品名称" width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.g_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="URL KEY" width="180" align="center">
            <template slot-scope="scope">
              <el-link type="primary" :href="domainUrl + scope.row.g_alias" target="_blank">{{ scope.row.g_alias }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="图片" width="120" align="center" vertical-align="middle">
            <template slot-scope="scope">
              <img :src="cdnPrefix + scope.row.g_img" width="90" height="90" style="margin-top: 7px;" alt="">
            </template>
          </el-table-column>
          <el-table-column label="价格" width="90" align="center">
            <template slot-scope="scope">
              {{ scope.row.g_price }}
            </template>
          </el-table-column>
          <el-table-column label="置顶号" width="55" align="center">
            <template slot-scope="scope">
              {{ scope.row.g_order }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="70" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.g_status == 1" style="color:#67C23A;">上架中</span>
              <span v-else style="color:#F56C6C;">已下架</span>
            </template>
          </el-table-column>
          <el-table-column label="促销倒计时" width="95" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.g_under_discount == 0" style="color:#F56C6C;">否</span>
              <template v-else>
                <div v-if="scope.row.g_discount_end_time < currentTime" style="color: #909399">已结束</div>
                <div v-else-if="currentTime < scope.row.g_discount_start_time">
                  <span style="color: #409EFF">未开始</span>
                  <br> 开始时间 <br>
                  {{ scope.row.g_discount_start_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
                </div>
                <div v-else-if="scope.row.g_discount_start_time <= currentTime && currentTime <= scope.row.g_discount_end_time">
                  <span style="color: #67C23A">进行中</span>
                  <br> 结束时间 <br>
                  {{ scope.row.g_discount_end_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
                </div>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="推荐" width="40" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.g_recommended == 1" style="color:#67C23A;">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="新品" width="40" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.g_new == 1" style="color:#67C23A;">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="热门" width="40" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.g_hot == 1" style="color:#67C23A;">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="浏览数" width="55" align="center">
            <template slot-scope="scope">
              {{ scope.row.g_views }}
            </template>
          </el-table-column>
          <el-table-column label="加购数" width="55" align="center">
            <template slot-scope="scope">
              {{ scope.row.add_click }}
            </template>
          </el-table-column>
          <el-table-column label="自然人气值" width="70" align="center">
            <template />
          </el-table-column>
          <el-table-column label="修改时间" width="100" align="center">
            <template slot-scope="{row}">
              <span>{{ row.g_last_time | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="100" align="center">
            <template slot-scope="{row}">
              <span>{{ row.g_add_time | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="edit(scope.row.g_id)" />
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteGoods(scope.row.g_id, scope)" />
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        style="margin-top: 10px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-container>
  </div>
</template>

<script>
import { getList, deleteGoods } from '@/api/goods/standard'
import { parseTime } from '@/utils'
import { getToken } from '@/utils/auth'

export default {
  name: 'StandardGoods',
  filters: {
    parseTime: parseTime
  },
  data() {
    return {
      height: 40,
      padding: 15,
      domainUrl: null,
      currentTime: null,
      currentPage: 1,
      totalCount: 0,
      pageSize: 20,
      tableData: null,
      listLoading: true,
      token: null,
      cdnPrefix: '//du7nt18x31vr8.cloudfront.net/assets/images/product/'
    }
  },
  created() {
    this.token = getToken()
    this.fetchData()
  },
  mounted() {
    this.getCurrentTime()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.token, this.pageSize, this.currentPage).then(response => {
        this.tableData = response.data.list
        this.domainUrl = response.data.domain
        this.totalCount = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    edit(id) {
      this.$router.push(`standard_goods_edit/${id}`)
    },
    createGoods() {
      this.$router.push(`standard_goods_edit/:id`)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    deleteGoods(gid, scope) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoods(this.token, gid).then(() => {
          this.$message.success('删除成功')
          this.totalCount -= 1
          this.tableData.splice(scope.$index, 1)
        })
      }).catch(() => {})
    },
    getCurrentTime() {
      var timestamp = Date.parse(new Date())
      this.currentTime = timestamp / 1000
    }
  }
}
</script>

<style scoped>
  .el-main { padding: 0 !important}
</style>
