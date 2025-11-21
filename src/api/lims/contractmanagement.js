import request from '@/utils/request'

// 查询合同管理列表
export function listContractmanagement(query) {
  return request({
    url: '/lims/contractmanagement/list',
    method: 'get',
    params: query
  })
}

// 查询合同管理详细
export function getContractmanagement(contractid) {
  return request({
    url: '/lims/contractmanagement/' + contractid,
    method: 'get'
  })
}

// 新增合同管理
export function addContractmanagement(data) {
  return request({
    url: '/lims/contractmanagement',
    method: 'post',
    data: data
  })
}

// 修改合同管理
export function updateContractmanagement(data) {
  return request({
    url: '/lims/contractmanagement',
    method: 'put',
    data: data
  })
}

// 删除合同管理
export function delContractmanagement(contractid) {
  return request({
    url: '/lims/contractmanagement/' + contractid,
    method: 'delete'
  })
}
