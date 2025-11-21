import request from '@/utils/request'

// 查询测试方法列表
export function listMethods(query) {
  return request({
    url: '/lims/methods/list',
    method: 'get',
    params: query
  })
}

// 查询测试方法详细
export function getMethods(testMethodsId) {
  return request({
    url: '/lims/methods/' + testMethodsId,
    method: 'get'
  })
}

// 新增测试方法
export function addMethods(data) {
  return request({
    url: '/lims/methods',
    method: 'post',
    data: data
  })
}

// 修改测试方法
export function updateMethods(data) {
  return request({
    url: '/lims/methods',
    method: 'put',
    data: data
  })
}

// 删除测试方法
export function delMethods(testMethodsId) {
  return request({
    url: '/lims/methods/' + testMethodsId,
    method: 'delete'
  })
}
