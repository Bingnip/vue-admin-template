import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user.php?action=login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user.php?action=userInfo',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user.php?action=logout',
    method: 'post'
  })
}
