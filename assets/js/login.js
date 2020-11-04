$(function () {
    // 切换登陆注册
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    });
    //表单验证
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 密码二次校验
        repwd: function (value) {
            var pwd = $('.reg-box [name="password"]').val()
            if (value != pwd) {
                return '两次密码输入不一致！'
            }
        }
    });
    //注册
    $('#form_reg').on('submit', function (e) {
        //阻止表单默认提交行为
        e.preventDefault();
        var data = {
            username: $('#form_reg [name="username"]').val(),
            password: $('#form_reg [name="password"]').val()
        };
        console.log(data);
        $.post('/api/reguser', data, function (res) {
            if (res.status != 0) {
                return layer.msg(res.message)
            }
            layer.msg(res.message);
            $('#link_login').click();
        })
    })
    //登陆
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // layer.msg(res.message);
                // console.log(res.token);
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        })
    })



})