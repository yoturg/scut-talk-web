let OSS = require('ali-oss')

OSS.urllib.request('http://localhost:8080', {method: 'GET'}, (err, response) => {
  if (err) {
    console.log('ali-err:' + err)
    return ''
    // return alert(err)
  }
  try {
  } catch (e) {
    let errmsg = 'parse sts response info error: ' + e.message
    // return alert(errmsg)
    console.log('ali-errmsg:' + errmsg)
    return ''
  }
})
let client = new OSS({
  region: 'oss-cn-shenzhen',
  accessKeyId: 'LTAItgegSLMtOmNE',
  accessKeySecret: 'H8konZ3buhiYhKiZf7yn6oRBeTV4Y2',
  bucket: 'easytalkimage'
})

/**
 * 生成文件名
 * @returns
 */
function timestamp () {
  var time = new Date()
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var mm = time.getMinutes()
  var s = time.getSeconds()
  return '' + y + add0(m) + add0(d) + add0(h) + add0(mm) + add0(s)
}

function add0 (m) {
  return m < 10 ? '0' + m : m
}
/**
 * statusCode:200表示上传成功，404表示上传异常
 * 请求异常则直接反馈
 * @param {*} file
 * @param {*} callback
 */

export function aliOssUpload (file, callback) {
  let fileName = file.name
  let storeAs = timestamp() + '_' + fileName
  client.multipartUpload(storeAs, file).then(response => {
    // console.log('response:' + JSON.stringify(response))
    if (response.res !== undefined && Number(response.res.statusCode) === 200) {
      let param = {'statusCode': 200, 'fileURL': decodeURI(response.res.requestUrls[0].split('?')[0]), 'fileName': response.name}
      callback(param)
    } else {
      let param2 = {'statusCode': 404, 'message': response.name}
      callback(param2)
    }
  }).catch(err => {
    console.log('上传异常')
    callback(err)
  })
}
