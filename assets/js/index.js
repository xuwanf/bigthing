$(function () {
    getUserMessage();
    //退出
    $('#btnLogout').on('click', function () { 
        layer.confirm('确认退出?', {icon: 3, title:'提示'}, function(index){
            //do something
            localStorage.removeItem('token');
            location.href = '/login.html'
            layer.close(index);
          });
     })
});
// 获取用户信息函数
function getUserMessage() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) { 
            if (res.status != 0) {
                return layui.layer.msg(res.message)
            }
            renderAvatar(res.data);
            // console.log(res.data);
        }
        
    })
};
//渲染头像
function renderAvatar(user) { 
    var uname = user.nickname || user.username;
    $('#welcome').html('欢迎 ' + uname);
    if (!!user.user_pic) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        var firstW = uname[0].toUpperCase();
        $('.text-avatar').html(firstW).show();
        $('.layui-nav-img').hide()
    }
 }