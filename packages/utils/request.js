export default function request({
  url = '',
  method = 'GET',
  headers = {},
  dataType = 'text',
  data = {},
  timeout = 30000,
  progress
}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', e => {
      typeof progress === 'function' && progress(e.loaded, e.total)
    }, false)

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response)
        } else {
          reject(xhr)
        }
      }
    }

    xhr.ontimeout = () => reject({
      message: '请求超时'
    })

    xhr.onerror = e => reject(e)

    xhr.open(method, url)

    for (const [key, val] of Object.entries(headers)) {
      xhr.setRequestHeader(key, val)
    }

    xhr.responseType = dataType

    xhr.timeout = timeout

    xhr.send(data)
  })
}
