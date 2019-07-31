
// 两个数组比较，找到相同的删除掉
const unique = function (obj, ary) {
  return obj.filter(function (item) {
    return ary.indexOf(item.name) === -1
  })
}

export { unique }
