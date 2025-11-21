import request from '@/utils/request'

// 查询样品编码序列列表
export function listSeq(query) {
  return request({
    url: '/lims/seq/list',
    method: 'get',
    params: query
  })
}

// 查询样品编码序列详细
export function getSeq(seqId) {
  return request({
    url: '/lims/seq/' + seqId,
    method: 'get'
  })
}

// 新增样品编码序列
export function addSeq(data) {
  return request({
    url: '/lims/seq',
    method: 'post',
    data: data
  })
}

// 修改样品编码序列
export function updateSeq(data) {
  return request({
    url: '/lims/seq',
    method: 'put',
    data: data
  })
}

// 删除样品编码序列
export function delSeq(seqId) {
  return request({
    url: '/lims/seq/' + seqId,
    method: 'delete'
  })
}
