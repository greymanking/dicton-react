//const audioPath = 'http://localhost:4000/sounds/';
//const hostPath = 'http://localhost:4000/';
const audioPath = '/sounds/';
const hostPath = '/';

const ACHIEVE = {
    normal: -1,
    wrong: 0,
    correct: 1,
    dictFalse: 1,
    dictSuccess: 2,
    puzzleFalse: 4,
    puzzleSuccess: 8
}

const MESSAGE = {
    error: '服务器君遇到了麻烦 : (',
    nodata: '暂时没有东西要学~~',
    timeout: '服务器君久久不理我们 :(',
    loading: '正在载入数据……',
    uploading: '正在上传数据……',
    rest: '今日份练习已完成，休息一下吧！',
    authFail: '登录失败！请检查用户名和密码',
    uploadFail: '上传数据失败',
    usernameInvalid: '用户名须以字母或中文开头，包含3-10个字母、中文和数字',
    passwordInvalid: '密码应包含8-20个字母或数字',
    passwordConfirmFail: '两次输入的密码不一致',
    usernameDuplicated: '用户名已经存在'
}

const ULSTATUS = {
    notGoing: 0,
    going: 1,
    fail: 2,
    done: 3
}

const PATTERN = {
    username: /^([\u4E00-\u9FA5\uF900-\uFA2D]|[a-zA-Z]){1}([\u4E00-\u9FA5\uF900-\uFA2D]|[a-zA-Z0-9]){2,9}$/,
    password: /^[a-zA-Z0-9]{8,20}$/
}

export {
    audioPath, hostPath, ACHIEVE, MESSAGE, PATTERN, ULSTATUS
};