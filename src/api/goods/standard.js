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
