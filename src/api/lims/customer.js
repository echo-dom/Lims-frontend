import request from '@/utils/request'

// 查询LIMS客户列表
export function listCustomer(query) {
  return request({
    url: '/lims/customer/list',
    method: 'get',
    params: query
  })
}

// 查询LIMS客户详细
export function getCustomer(customerId) {
  return request({
    url: '/lims/customer/' + customerId,
    method: 'get'
  })
}

// 新增LIMS客户
export function addCustomer(data) {
  return request({
    url: '/lims/customer',
    method: 'post',
    data: data
  })
}

// 修改LIMS客户
export function updateCustomer(data) {
  return request({
    url: '/lims/customer',
    method: 'put',
    data: data
  })
}

// 删除LIMS客户
export function delCustomer(customerId) {
  return request({
    url: '/lims/customer/' + customerId,
    method: 'delete'
  })
}
