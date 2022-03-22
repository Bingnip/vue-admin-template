import request from '@/utils/request'

export function getList(token) {
  return request({
    url: '/goods.php?action=getList',
    method: 'post',
    params: { token }
  })
}

export function getCategoryList(token) {
  return request({
    url: '/goods.php?action=getCategory',
    method: 'post',
    params: { token }
  })
}

export function getSpecifyData(token) {
  return request({
    url: 'https://www.fastmock.site/mock/2971170e7da934619bdc8517bbda52f9/nf_sale_admin/goods/getCategory',
    method: 'post',
    params: { token }
  })
}
