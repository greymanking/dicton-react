function ajax(url, method, body, contentType) {
    var p = new Promise(function (resolve, reject) {

        var xhr = new XMLHttpRequest();


        xhr.open(method, url, true);
        xhr.onload = function (ev) {
            resolve(this.responseText);
        }
        xhr.onerror = function (ev) { reject(ev.error) }
        xhr.ontimeout = function (ev) { reject("time out") }

        let ct = 'text/plain;charset=utf-8"'
        if (contentType === 'json') { ct = 'application/json;charset=utf-8"' }
        else if (contentType === 'xform') { ct = 'application/x-www-form-urlencoded;charset=utf-8"' }
        xhr.setRequestHeader('content-type', ct)

        xhr.send(body);
    });
    return p;
}

function ajaxGet(url) {
    return ajax(url, 'GET')
}

function ajaxPost(url, body, contentType) {
    return ajax(url, 'POST', body, contentType)
}

export { ajaxGet, ajaxPost };