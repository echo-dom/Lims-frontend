import request from '@/utils/request'

// 查询方案项目列表
export function listSpTests(query) {
    return request({
        url: '/lims/sp_tests/list',
        method: 'get',
        params: query
    })
}

// 查询方案项目详细
export function getSpTests(spTestsId) {
    return request({
        url: '/lims/sp_tests/' + spTestsId,
        method: 'get'
    })
}

// 新增方案项目
export function addSpTests(data) {
    return request({
        url: '/lims/sp_tests',
        method: 'post',
        data: data
    })
}

// 修改方案项目
export function updateSpTests(data) {
    return request({
        url: '/lims/sp_tests',
        method: 'put',
        data: data
    })
}

// 删除方案项目
export function delSpTests(spTestsIds) {
    return request({
        url: '/lims/sp_tests/' + spTestsIds,
        method: 'delete'
    })
}

// 导出方案项目
export function exportSpTests(query) {
    return request({
        url: '/lims/sp_tests/export',
        method: 'post',
        params: query
    })
}
