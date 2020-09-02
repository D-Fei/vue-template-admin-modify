import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://localhost:8001/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'http://localhost:8001/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getList(params) {
  return request({
    url: 'http://localhost:8001/users/get',
    method: 'get',
    params
  })
}

export function addUser(data) {
  return request({
    url: 'http://localhost:8001/user/create',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  console.log(data)
  return request({
    url: `http://localhost:8001/user/update`,
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `http://localhost:8001/user/delete/${id}`,
    method: 'get'
  })
}