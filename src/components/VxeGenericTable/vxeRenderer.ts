import VXETable from 'vxe-table';
import { h } from 'vue';
import FilterPanel from './FilterPanel.vue';

// 注册自定义筛选渲染器
VXETable.renderer.add('CustomFilter', {
    // 渲染筛选面板
    renderFilter(h, renderOpts, params) {
        return h(FilterPanel, { params });
    },
    // 不显示默认底部按钮
    showFilterFooter: false,
    // 筛选数据方法
    filterMethod(params) {
        const { option, row, column } = params;
        const { vals } = option.data;
        const cellValue = row[column.field];
        return vals.includes(String(cellValue));
    },
    // 重置数据方法
    filterResetMethod(params) {
        const { options } = params;
        options.forEach((option) => {
            option.data = { vals: [] };
        });
    },
});

export default VXETable;
