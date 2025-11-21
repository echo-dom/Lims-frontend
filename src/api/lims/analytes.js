import request from '@/utils/request'

// 查询分析项目定义列表
export function listAnalytes(query) {
  return request({
    url: '/lims/analytes/list',
    method: 'get',
    params: query
  })
}

// 查询分析项目定义详细
export function getAnalytes(analytesid) {
  return request({
    url: '/lims/analytes/' + analytesid,
    method: 'get'
  })
}

// 新增分析项目定义
export function addAnalytes(data) {
  return request({
    url: '/lims/analytes',
    method: 'post',
    data: data
  })
}

// 修改分析项目定义
export function updateAnalytes(data) {
  return request({
    url: '/lims/analytes',
    method: 'put',
    data: data
  })
}

// 删除分析项目定义
export function delAnalytes(analytesid) {
  return request({
    url: '/lims/analytes/' + analytesid,
    method: 'delete'
  })
}
