import request from '@/utils/request'

// 查询执行标准列表
export function listPrograms(query) {
  return request({
    url: '/lims/programs/list',
    method: 'get',
    params: query
  })
}

// 查询执行标准详细
export function getPrograms(sampleProgramsId) {
  return request({
    url: '/lims/programs/' + sampleProgramsId,
    method: 'get'
  })
}

// 新增执行标准
export function addPrograms(data) {
  return request({
    url: '/lims/programs',
    method: 'post',
    data: data
  })
}

// 修改执行标准
export function updatePrograms(data) {
  return request({
    url: '/lims/programs',
    method: 'put',
    data: data
  })
}

// 删除执行标准
export function delPrograms(sampleProgramsId) {
  return request({
    url: '/lims/programs/' + sampleProgramsId,
    method: 'delete'
  })
}
