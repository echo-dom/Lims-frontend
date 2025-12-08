<template>
    <div class="filter-panel">
        <div class="filter-content">
            <!-- 文本筛选 -->
            <div class="filter-list">
                <vxe-checkbox v-model="isAll" @change="changeAllEvent" content="全选"></vxe-checkbox>
                <div class="filter-options">
                    <div v-for="(item, index) in valList" :key="index">
                        <vxe-checkbox v-model="item.checked" :content="item.value"></vxe-checkbox>
                    </div>
                </div>
            </div>
        </div>
        <div class="filter-footer">
            <vxe-button size="mini" content="应用" @click="confirmFilter"></vxe-button>
            <vxe-button size="mini" content="清除" @click="resetFilter"></vxe-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import XEUtils from 'xe-utils';

const props = defineProps<{
    params: any;
}>();

const isAll = ref(false);
const valList = ref<Array<{ checked: boolean; value: any }>>([]);
let column: any = null;
let table: any = null;
let panel: any = null;
let option: any = null;

onMounted(() => {
    if (props.params) {
        column = props.params.column;
        table = props.params.$table;
        panel = props.params.$panel;

        const { visibleData } = table.getTableData();
        const { vals } = column.filters[0].data;

        // 获取列的所有唯一值
        const colValList = Object.keys(XEUtils.groupBy(visibleData, column.field)).map((val) => ({
            checked: vals.includes(val),
            value: val
        }));

        option = column.filters[0];
        valList.value = colValList.sort((a, b) =>
            String(a.value).localeCompare(String(b.value))
        );

        // 检查是否全选
        isAll.value = valList.value.every(item => item.checked);
    }
});

const changeAllEvent = () => {
    valList.value.forEach((item) => {
        item.checked = isAll.value;
    });
};

const confirmFilter = () => {
    if (option) {
        const { data } = option;
        data.vals = valList.value.filter((item) => item.checked).map((item) => item.value);
        panel.changeOption(null, true, option);
        panel.confirmFilter();
    }
};

const resetFilter = () => {
    panel.resetFilter();
};
</script>

<style scoped>
.filter-panel {
    min-width: 200px;
    max-width: 300px;
    padding: 10px;
}

.filter-content {
    max-height: 200px;
    min-height: 100px;
}

.filter-list {
    display: flex;
    flex-direction: column;
}

.filter-options {
    max-height: 170px;
    overflow-y: auto;
    margin-top: 5px;
}

.filter-options>div {
    margin-top: 3px;
}

.filter-footer {
    display: flex;
    justify-content: flex-end;
    gap: 5px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #e8e8e8;
}
</style>
