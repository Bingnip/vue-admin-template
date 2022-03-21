import { getToken } from '@/utils/auth'
import request from '@/utils/request'

const token = getToken()

export function getList() {
  return request({
    url: '/goods.php?action=getList',
    method: 'post',
    params: { token }
  })
}

export function getCategoryList() {
  return request({
    url: '/goods.php?action=getCategory',
    method: 'post',
    params: { token }
  })
}

export function getSpecifyData() {
  return request({
    url: 'https://www.fastmock.site/mock/2971170e7da934619bdc8517bbda52f9/nf_sale_admin/goods/getCategory',
    method: 'post',
    params: { token }
  })
}
