<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <el-button type="primary" @click="createGoods()">新增</el-button>
      </el-header>
      <el-main>
        <el-table v-loading="listLoading" :data="tableData" element-loading-text="Loading" height="780" border fit highlight-current-row>
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
              {{ scope.row.g_alias }}
            </template>
          </el-table-column>
          <el-table-column label="图片" width="120" align="center">
            <template slot-scope="scope">
              <img :src="cdnPrefix + scope.row.g_img" width="90" height="90" alt="">
            </template>
          </el-table-column>
          <el-table-column label="价格" width="90" align="center">
            <template slot-scope="scope">
              {{ scope.row.g_price }}
            </template>
          </el-table-column>
          <el-table-column label="置顶号" width="90" align="center">
            <template slot-scope="scope">
              {{ scope.row.g_order }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="90" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.g_status == 1" style="color:#67C23A;">上架中</span>
              <span v-else style="color:#F56C6C;">已下架</span>
            </template>
          </el-table-column>
          <el-table-column label="促销倒计时" width="90" align="center">
            <template />
          </el-table-column>
          <el-table-column label="推荐" width="90" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.g_recommended == 1" style="color:#67C23A;">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="新品" width="90" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.g_new == 1" style="color:#67C23A;">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="热门" width="90" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.g_hot == 1" style="color:#67C23A;">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="浏览数" width="90" align="center">
            <template slot-scope="scope">
              {{ scope.row.g_views }}
            </template>
          </el-table-column>
          <el-table-column label="加购数" width="90" align="center">
            <template slot-scope="scope">
              {{ scope.row.add_click }}
            </template>
          </el-table-column>
          <el-table-column label="自然人气值" width="90" align="center">
            <template />
          </el-table-column>
          <el-table-column label="修改时间" width="120" align="center">
            <template slot-scope="{row}">
              <span>{{ row.g_last_time | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="120" align="center">
            <template slot-scope="{row}">
              <span>{{ row.g_add_time | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120" align="center">
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
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.token, this.pageSize, this.currentPage).then(response => {
        this.tableData = response.data.list
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
          this.tableData.splice(scope.$index)
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>
