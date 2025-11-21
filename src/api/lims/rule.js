import request from '@/utils/request'

// 查询样品编码规则列表
export function listRule(query) {
  return request({
    url: '/lims/rule/list',
    method: 'get',
    params: query
  })
}

// 查询样品编码规则详细
export function getRule(ruleId) {
  return request({
    url: '/lims/rule/' + ruleId,
    method: 'get'
  })
}

// 新增样品编码规则
export function addRule(data) {
  return request({
    url: '/lims/rule',
    method: 'post',
    data: data
  })
}

// 修改样品编码规则
export function updateRule(data) {
  return request({
    url: '/lims/rule',
    method: 'put',
    data: data
  })
}

// 删除样品编码规则
export function delRule(ruleId) {
  return request({
    url: '/lims/rule/' + ruleId,
    method: 'delete'
  })
}
