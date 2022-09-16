let list = [
    { id: '01', name: '一级01', key: '01' },
    { id: '02', name: '一级02', key: '02' },
    { id: '03', name: '一级03', key: '03' },
    { id: '0101', name: '二级01', key: '0101' },
    { id: '0102', name: '二级02', key: '0102' },
    { id: '0103', name: '二级03', key: '0103' },
    { id: '010101', name: '三级01', key: '010101' },
    { id: '010103', name: '三级02', key: '010102' },
    { id: '010103', name: '三级03', key: '010103' },
]

function list2Tree(list = []) {
    let _list = list.sort((a, b) => b.key.length - a.key.length)
    const group = {}

    // group 目标 {
    //     'id':[{},{},{}]
    //}
    for (let i in _list) {
        let item = _list[i]
        let key = item.key.slice(0, item.key.length - 2)
        if (group[key]) {
            group[key].push(item)
        } else {
            group[key] = [item]
        }
    }
    _list.forEach((item) => {
        let id = item.id
        if (group.hasOwnProperty(id)) {
            item.children = group[id]
        }
    })
    return group['']
}

function tree2list(tree) {
    const list = []
    const queue = [...tree]
    while (queue.length) {
        const node = queue.shift()
        const children = node.children
        if (children) {
            queue.push(...children)
        }
        list.push(node)
    }
    return list
}

function tree2list2(tree) {
    const list = []
    const stack = [...tree]
    while (stack.length) {
        const node = stack.pop()
        const children = node.children
        if (children) {
            stack.push(...children)
        }
        list.push(node)
    }
    return list
}

let tree = list2Tree(list)

let _list = tree2list(tree)

console.log(JSON.stringify(tree), _list, tree2list2(tree));


let tree2 = [
    {
        "id": "01", "name": "一级01", "key": "01",
        "children":
            [
                {
                    "id": "0101", "name": "二级01", "key": "0101",
                    "children": [
                        { "id": "010101", "name": "三级01", "key": "010101", },
                        { "id": "010103", "name": "三级02", "key": "010102" },
                        { "id": "010103", "name": "三级03", "key": "010103" }]
                },
                { "id": "0102", "name": "二级02", "key": "0102" },
                { "id": "0103", "name": "二级03", "key": "0103" }]
    },
    { "id": "02", "name": "一级02", "key": "02" },
    { "id": "03", "name": "一级03", "key": "03" }
]
// 知道树结构 
// 选中的根节点
//返回所有 节点状态 0 为为选中 1为选中 2为半选（子节点部分选中，父节点为半选）

let _tree = [
    {
        "id": "01", "name": "一级01", "key": "01",
        "children":
            [
                {
                    "id": "0101", "name": "二级01", "key": "0101",
                    "children": [
                        { "id": "010101", "name": "三级01", "key": "010101", },
                        { "id": "010103", "name": "三级02", "key": "010102" },
                        { "id": "010103", "name": "三级03", "key": "010103" }]
                },
                { "id": "0102", "name": "二级02", "key": "0102" },
                { "id": "0103", "name": "二级03", "key": "0103" }]
    },
    { "id": "02", "name": "一级02", "key": "02" },
    { "id": "03", "name": "一级03", "key": "03" }
]
let checkList = [
    { "id": "010101", "name": "三级01", "key": "010101", checked: true },
    { "id": "010103", "name": "三级03", "key": "010103", checked: true },
    { "id": "02", "name": "一级02", "key": "02", checked: true }
]