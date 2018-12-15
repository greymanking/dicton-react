//const audioPath = 'http://localhost:4000/sounds/';
//const hostPath = 'http://localhost:4000/';
const audioPath = '/sounds/';
const hostPath = '/';

const NORMAL = 'normal', SUCCESS = 'right', WRONG = 'wrong';

const MESSAGE = {
    error: '服务器君遇到了麻烦 : (',
    nodata: '暂时没有东西要学~~',
    timeout: '服务器君久久不理我们 :(',
    loading: '正在载入数据……',
    uploading: '正在上传数据……',
    rest: '今日份练习已完成，休息一下吧！',
    authfail:'登录失败！请检查用户名和密码',
    uploadfail:'上传数据失败'
}

export {
    audioPath, hostPath, NORMAL, SUCCESS, WRONG, MESSAGE
};