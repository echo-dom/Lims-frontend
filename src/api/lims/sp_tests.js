import request from '@/utils/request'

// 查询方案项目列表
export function listSp_tests(query) {
  return request({
    url: '/lims/sp_tests/list',
    method: 'get',
    params: query
  })
}

// 查询方案项目详细
export function getSp_tests(spTestsId) {
  return request({
    url: '/lims/sp_tests/' + spTestsId,
    method: 'get'
  })
}

// 新增方案项目
export function addSp_tests(data) {
  return request({
    url: '/lims/sp_tests',
    method: 'post',
    data: data
  })
}

// 修改方案项目
export function updateSp_tests(data) {
  return request({
    url: '/lims/sp_tests',
    method: 'put',
    data: data
  })
}

// 删除方案项目
export function delSp_tests(spTestsId) {
  return request({
    url: '/lims/sp_tests/' + spTestsId,
    method: 'delete'
  })
}
