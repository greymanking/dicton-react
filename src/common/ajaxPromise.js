export default function(url) {
    var p = new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function (ev) {
            resolve(this.responseText);
        }
        xhr.onerror = function (ev) { reject("error") }
        xhr.ontimeout = function (ev) { reject("time out") }
        xhr.send();
    });
    return p;
}