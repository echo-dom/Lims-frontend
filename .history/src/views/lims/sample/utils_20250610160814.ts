// utils.ts
export const formatDateByYMD = (timestamp: any, fmt: string) => {
    const date = new Date(timestamp);
    const o: Record<string, any> = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds()
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, date.getFullYear().toString().substr(4 - RegExp.$1.length));
    }

    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1,
                RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(o[k].toString().length));
        }
    }
    return fmt;
};

export const getColumnTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
        'text': '文本',
        'number': '数字',
        'date': '日期',
        'boolean': '布尔值',
        'custom': '自定义'
    };
    return typeMap[type] || type;
};