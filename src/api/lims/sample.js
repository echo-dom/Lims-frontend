import request from '@/utils/request'

// 查询LIMS样品列表
export function listSample(query) {
  return request({
    url: '/lims/sample/list',
    method: 'get',
    params: query
  })
}

// 查询LIMS样品详细
export function getSample(sampleId) {
  return request({
    url: '/lims/sample/' + sampleId,
    method: 'get'
  })
}

// 新增LIMS样品
export function addSample(data) {
  return request({
    url: '/lims/sample',
    method: 'post',
    data: data
  })
}

// 修改LIMS样品
export function updateSample(data) {
  return request({
    url: '/lims/sample',
    method: 'put',
    data: data
  })
}

// 删除LIMS样品
export function delSample(sampleId) {
  return request({
    url: '/lims/sample/' + sampleId,
    method: 'delete'
  })
}
