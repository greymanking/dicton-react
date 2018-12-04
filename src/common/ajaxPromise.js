function ajax(url,method) {
    var p = new Promise(function (resolve, reject) {
        var mtd=method?method:'GET';

        var xhr = new XMLHttpRequest();
        xhr.open(mtd, url, true);
        xhr.onload = function (ev) {
            resolve(this.responseText);
        }
        xhr.onerror = function (ev) { reject(ev.error) }
        xhr.ontimeout = function (ev) { reject("time out") }
        xhr.send();
    });
    return p;
}

export default ajax;