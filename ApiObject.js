export function ApiObject(baseUrl) {
  let segments = []
  let params = ''
  let headers = {}
  let httpVerbs = ['get', 'post', 'put', 'patch', 'delete']

  function addQueryParams(receiver) {
    return function (queryParams) {
      params = Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join('&')
      return receiver
    }
  }

  function addHeaders(receiver) {
    return function (hdrs) {
      headers = hdrs
      return receiver
    }
  }

  function buildRequest(options) {
    return function (body) {
      const url = baseUrl + '/' + segments.join('/') + '?' + params
      segments = []
      return fetch(url, {...options, headers, body})
    }
  }
  
  const proxy = new Proxy({}, {
    get(target, prop, receiver) {

      if(prop === 'params') {
        return addQueryParams(receiver)
      }

      if(prop === 'headers') {
        return addHeaders(receiver)
      }

      if(httpVerbs.indexOf(prop) >= 0) {
        return buildRequest({ method: prop })
      }
      
      segments.push(prop)
      
      return receiver
    }
  })
  
  return proxy
}
