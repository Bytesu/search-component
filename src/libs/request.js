import {CONST_VARS as config, CONST_VARS} from './const'
//business code
export const ConstCode = {
    OK: 200,
    ERR: -1,
    CANCEL: 0
};

const axios = require('axios').default;

const CancelToken = axios.CancelToken,
    Cancel = axios.Cancel,
    currentRequest = {},
    instance = axios.create({
        baseURL: CONST_VARS.API_URL,
        // headers: {
        //     'content-type':"application/json"
        // }
    });
// abort the same request
const abortPending = (urlstr) => {
    if (currentRequest[urlstr]) {
        currentRequest[urlstr]()
        delete currentRequest[urlstr];
    }
};

function genUniqueUrlStr(config) {
    let data = config.data || {},
        datas = [];
    for (let key in data) {
        datas.push(key + '=' + (typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]));
    }
    return [
        data.requestId || '',
        config.method.toUpperCase(),
        config.url,
        datas.join(',')
    ].join('-')
}

//http request interceptor
axios.interceptors.request.use(
    config => {
        // config.headers['Content-Type']="application/json";
        //prevent duplicate request
        let urlStr = genUniqueUrlStr(config);
        abortPending(urlStr); //
        config.cancelToken = new CancelToken((c) => {
            currentRequest[urlStr] = c
        });
        if (config.requestId) delete config.requestId;

        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

/**
 * abort request manually
 * @param method
 * @param url
 * @param param
 */
export function abortRequest(method, url, param = {}) {
    let urlStr = genUniqueUrlStr({
        method,
        url, data: param
    });
    abortPending(urlStr);
}

export function abortGetFn(url) {
    let urlStr = genUniqueUrlStr({
        method: 'get',
        url, data: {}
    });
    abortPending(urlStr);
}


function updateTk(url) {
    let tk = localStorage.getItem(config.TOKEN);
    // if(userStr){tk = JSON.parse(userStr)}
    if (tk && url.indexOf('sign_in') === -1) {
        instance.defaults.headers.common['Authorization'] = 'Bearer '+tk;
    } else {
        delete instance.defaults.headers.common['Authorization'];
        localStorage.setItem('Authorization', '');
    }
}

function resHandler(pro) {
    return new Promise((resolve, reject) => {
        pro
            .then(function (response) {
                resolve({
                    data: response.data,
                    code: ConstCode.OK,
                })
            })
            .catch(err => {
                if (err instanceof Cancel) {
                    console.warn('canceled->' + err.message || '')
                    reject({
                        code: ConstCode.CANCEL
                    })
                } else {
                    console.warn('failed->' + err.message || '');
                    let resp = err.response || {data: {message: 'request error'}};

                    if (resp.status === 401 || resp.status === 403) {
                        // localStorage.setItem("user", '');
                        // window.location.href = '/signin';
                    }
                    reject({
                        code: ConstCode.ERR,
                        status: resp.status || ConstCode.ERR,
                        statusText: resp.statusText || 'no statusText',
                        msg: err.message || 'error message',
                        ...resp.data,
                    })
                }

            })
    })
}

export function deleteFn(url) {
    updateTk(url);
    return resHandler(instance.delete(url))
}

export function getFn(url,config={}) {
    updateTk(url);
    return resHandler(instance.get(url,config))
}

export function postFn(url, data,config={}) {
    updateTk(url);
    return resHandler(instance.post(url, data || {},config));
}

export async function postAsync(url, data) {
    updateTk(url);
    return await resHandler(instance.post(url, data || {}));
}

export function putFn(url, data) {
    updateTk(url);
    return resHandler(instance.put(url, data || {}));
}
