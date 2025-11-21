<template>
    <el-container class="container">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane v-for="tab in tabs" :key="tab.name" :name="tab.name" :label="tab.label">
                <el-button v-for="button in tab.buttons" :key="button.label" @click="button.handler" class="btn">{{ button.label }}</el-button>
            </el-tab-pane>
        </el-tabs>
        <el-config-provider :locale="locale">
            <el-table 
                @selection-change="handleSelectionChange" 
                ref="multipleTableRef"
                v-loading.lock="loading" id="mtable"
                @row-click="hangdleRowClick"
                highlight-current-row
                :header-cell-style="{ 'font-size': '14px', 'font-weight': '700', 'color': '#000', 'background-color': '#dee5ed' }"
                stripe :data="tableData" border style="width: 100%;height: 100%;">
                <el-table-column type="selection" width="55" />
                <el-table-column v-for="cloumn in columnList" :key="cloumn.prop" align="center" show-overflow-tooltip
                    :filters="buildFilter(cloumn.prop)" :filter-method="filterHandler" sortable :prop="cloumn.prop"
                    :label="cloumn.label" :width="cloumn.width">
                    <template #header>
                        <!-- 使用 div 包裹表头文本和输入框 -->
                        <div class="header-container">
                            <!-- 表头文本 -->
                            <span class="header-text" title="{{ cloumn.label }}">{{ cloumn.label }}</span>
                            <!-- 输入框 -->
                            <el-input v-if="!cloumn.type" @keyup.enter="searchTable" v-model="cloumn.keyword" size="small" />
                            <div v-if="cloumn.type == 'date'">
                                <div style="display: flex;">
                                    <el-date-picker v-model="cloumn.keyword" type="date" placeholder="开始时间" :size="'small'"
                                        style="margin-bottom: 2px;" @change="changeTime(cloumn)" />
                                    <el-date-picker v-model="cloumn.keyword2" type="date" placeholder="结束时间" :size="'small'"
                                        @change="changeTime(cloumn)" />
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-if="typeof cloumn.renderer == 'function'" #default="scope">
                        <div v-html="cloumn.renderer(scope)"></div>
                    </template>
                </el-table-column>
            </el-table>


            <el-pagination style="margin-top: 5px;" v-model:current-page="currentPage" v-model:page-size="pageSize"
                :page-sizes="[50, 100, 200, 500, 1000, total]" layout="total, sizes, prev, pager