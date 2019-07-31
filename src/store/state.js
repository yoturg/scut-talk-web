
let defaultData = '默认显示系统'

try {
  if (localStorage.data) {
    defaultData = localStorage.data
  }
} catch (e) {
}

export default {
  data: defaultData
}
