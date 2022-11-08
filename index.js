

let arr = [
    { id: 1, name: '部门1', pid: 0 },
    { id: 2, name: '部门2', pid: 1 },
    { id: 3, name: '部门3', pid: 1 },
    { id: 4, name: '部门4', pid: 3 },
    { id: 5, name: '部门5', pid: 4 },
]

let obj = {}

arr.forEach(i => {

    if (obj[i.pid]) {
        obj[i.pid].push(i)
    } else {
        obj[i.pid] = [i]
    }
})

arr.forEach(i => {
    if (obj[i.id]) {
        i.children = obj[i.id]
    }
})

console.log(arr)