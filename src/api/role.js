import request from '@/utils/request'

export function getRoles(params) {
  return request({
    url: 'http://localhost:8001/roles/get',
    method: 'get',
    params
  })
}

export function addRole(data) {
  return request({
    url: 'http://localhost:8001/role/create',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `http://localhost:8001/role/update`,
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `http://localhost:8001/role/delete/${id}`,
    method: 'get'
  })
}

export function getMenus() {
  return request({
    url: 'http://localhost:8001/menus/get',
    method: 'get'
  })
}
