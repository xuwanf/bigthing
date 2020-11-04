$.ajaxPrefilter(function (option) {
    option.url = 'http://ajax.frontend.itheima.net' + option.url;
    //区分/my/请求
    if (option.url.indexOf('itheima.net/my/') != -1) {
        option.headers = { Authorization: localStorage.getItem('token') || '' };
    };
    //是否清除token
    option.complete = function (res) {
        // console.log(res);
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    }
})