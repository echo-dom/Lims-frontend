import request from '@/utils/request'

// 查询测试项目列表
export function listTests(query) {
  return request({
    url: '/lims/tests/list',
    method: 'get',
    params: query
  })
}

// 查询测试项目详细
export function getTests(testId) {
  return request({
    url: '/lims/tests/' + testId,
    method: 'get'
  })
}

// 新增测试项目
export function addTests(data) {
  return request({
    url: '/lims/tests',
    method: 'post',
    data: data
  })
}

// 修改测试项目
export function updateTests(data) {
  return request({
    url: '/lims/tests',
    method: 'put',
    data: data
  })
}

// 删除测试项目
export function delTests(testId) {
  return request({
    url: '/lims/tests/' + testId,
    method: 'delete'
  })
}
