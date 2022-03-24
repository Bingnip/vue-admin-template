<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <el-button type="primary" @click="createGoods()">新增</el-button>
      </el-header>
      <el-main>
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" height="780" border fit highlight-current-row>
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
              <span v-if="scope.row.g_recommended == 1">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="新品" width="90" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.g_new == 1">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="热门" width="90" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.g_hot == 1">是</span>
              <span v-else>否</span>
            </template>
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
            <template slot-scope="{row}">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="edit(row.g_id)" />
              <el-button type="danger" icon="el-icon-delete" circle size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getList } from '@/api/goods/standard'
import { parseTime } from '@/utils'
import { getToken } from '@/utils/auth'

export default {
  name: 'StandardGoods',
  filters: {
    parseTime: parseTime
  },
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
      var token = getToken()
      getList(token).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    edit(id) {
      this.$router.push(`standard_goods_edit/${id}`)
    },
    createGoods() {
      this.$router.push(`standard_goods_edit`)
    }
  }
}
</script>

<style scoped>

</style>
