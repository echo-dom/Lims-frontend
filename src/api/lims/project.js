import request from '@/utils/request'

// 查询方案列表
export function listProject(query) {
  return request({
    url: '/lims/project/list',
    method: 'get',
    params: query
  })
}

// 查询方案详细
export function getProject(projectId) {
  return request({
    url: '/lims/project/' + projectId,
    method: 'get'
  })
}

// 新增方案
export function addProject(data) {
  return request({
    url: '/lims/project',
    method: 'post',
    data: data
  })
}

// 修改方案
export function updateProject(data) {
  return request({
    url: '/lims/project',
    method: 'put',
    data: data
  })
}

// 删除方案
export function delProject(projectId) {
  return request({
    url: '/lims/project/' + projectId,
    method: 'delete'
  })
}
