import request from '@/utils/request'

// 查询方案项目列表
export function listTests(query) {
  return request({
    url: '/lims/tests/list',
    method: 'get',
    params: query
  })
}

// 查询方案项目详细
export function getTests(spTestsId) {
  return request({
    url: '/lims/tests/' + spTestsId,
    method: 'get'
  })
}

// 新增方案项目
export function addTests(data) {
  return request({
    url: '/lims/tests',
    method: 'post',
    data: data
  })
}

// 修改方案项目
export function updateTests(data) {
  return request({
    url: '/lims/tests',
    method: 'put',
    data: data
  })
}

// 删除方案项目
export function delTests(spTestsId) {
  return request({
    url: '/lims/tests/' + spTestsId,
    method: 'delete'
  })
}
