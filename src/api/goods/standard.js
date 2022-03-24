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

export function checkUrlKey(token, gName) {
  return request({
    url: '/goods.php?action=checkUrlKey',
    method: 'post',
    params: { token, gName }
  })
}

export function submitCreate(token, form) {
  return request({
    url: '/goods.php?action=submitStandardCreate',
    method: 'post',
    params: { token },
    data: { form }
  })
}

export function getGoodsInfo(token, gid) {
  return request({
    url: '/goods.php?action=getGoodsInfo',
    method: 'post',
    params: { token, gid }
  })
}

export function getStandardImg(token, gid) {
  return request({
    url: '/goods.php?action=getImgInfo',
    method: 'post',
    params: { token, gid }
  })
}
