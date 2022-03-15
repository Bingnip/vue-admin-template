import { getToken } from '@/utils/auth'
import request from '@/utils/request'

export function getList() {
  const token = getToken()
  return request({
    url: '/goods.php?action=getList',
    method: 'post',
    params: { token }
  })
}
