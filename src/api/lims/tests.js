import request from '@/utils/request'

// 查询检验项目（LIMS_TESTS）列表
export function listTests(query) {
  return request({
    url: '/lims/tests/list',
    method: 'get',
    params: query
  })
}

// 查询检验项目（LIMS_TESTS）详细
export function getTests(TESTSID) {
  return request({
    url: '/lims/tests/' + TESTSID,
    method: 'get'
  })
}

// 新增检验项目（LIMS_TESTS）
export function addTests(data) {
  return request({
    url: '/lims/tests',
    method: 'post',
    data: data
  })
}

// 修改检验项目（LIMS_TESTS）
export function updateTests(data) {
  return request({
    url: '/lims/tests',
    method: 'put',
    data: data
  })
}

// 删除检验项目（LIMS_TESTS）
export function delTests(TESTSID) {
  return request({
    url: '/lims/tests/' + TESTSID,
    method: 'delete'
  })
}
