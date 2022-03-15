<template>
  <div class="app-container">
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          height="820"
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
              {{ scope.row.g_alias }}
            </template>
          </el-table-column>
          <el-table-column label="图片" width="90" align="center">
            <template slot-scope="scope">
              {{ scope.row.g_img }}
            </template>
          </el-table-column>
          <el-table-column label="价格" width="90" align="center">
            <template slot-scope="scope">
              {{ scope.row.g_price }}
            </template>
          </el-table-column>
          <el-table-column label="置顶号" width="90" align="center">
            <template />
          </el-table-column>
          <el-table-column label="状态" width="90" align="center">
            <template />
          </el-table-column>
          <el-table-column label="促销倒计时" width="90" align="center">
            <template />
          </el-table-column>
          <el-table-column label="推荐" width="90" align="center">
            <template />
          </el-table-column>
          <el-table-column label="新品" width="90" align="center">
            <template />
          </el-table-column>
          <el-table-column label="热门" width="90" align="center">
            <template />
          </el-table-column>
          <el-table-column label="浏览数" width="90" align="center">
            <template />
          </el-table-column>
          <el-table-column label="加购数" width="90" align="center">
            <template />
          </el-table-column>
          <el-table-column label="自然人气值" width="90" align="center">
            <template />
          </el-table-column>
          <el-table-column label="修改时间" width="120" align="center">
            <template />
          </el-table-column>
          <el-table-column label="创建时间" width="120" align="center">
            <template />
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120" align="center">
            <template />
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getList } from '@/api/goods/standard'

export default {
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
</style>
