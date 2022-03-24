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

export function submitCreateOrEdit(token, form, editType) {
  switch (editType) {
    case 'edit':
      return request({
        url: '/goods.php?action=submitStandardEdit',
        method: 'post',
        params: { token },
        data: { form }
      })
    case 'create':
      return request({
        url: '/goods.php?action=submitStandardCreate',
        method: 'post',
        params: { token },
        data: { form }
      })
  }
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

export function editAlias(token, urlKey, gid) {
  return request({
    url: '/goods.php?action=editUrlKey',
    method: 'post',
    params: { token, urlKey, gid }
  })
}

export function getAlias(token, gid) {
  return request({
    url: '/goods.php?action=getUrlKey',
    method: 'post',
    params: { token, gid }
  })
}

export function setRedirectUrl(token, targetPath, rid) {
  return request({
    url: '/goods.php?action=setUrlKey',
    method: 'post',
    params: { token, targetPath, rid }
  })
}

export function removeStandardImg(token, imgId) {
  return request({
    url: '/goods.php?action=removeStandardImg',
    method: 'post',
    params: { token, imgId }
  })
}

