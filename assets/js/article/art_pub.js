$(function () {
    var layer = layui.layer;
    var form = layui.form;

    //渲染富文本域名
    initEditor();

    //获取文章分类并渲染列表
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name="cate_id"]').html(htmlStr);
                form.render();
            }
        })
    };
    initCate();

    // 1. 初始化图片裁剪器
    var $image = $('#image');

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    // 3. 初始化裁剪区域
    $image.cropper(options);


    // 选择封面按钮添加选择文件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    });

    //用户选择文件  
    $('#coverFile').on('change', function (e) {
        // 获取到文件列表的数组
        var files = e.target.files;
        if (file.length === 0) {
            return
        };
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    //定义文章默认状态
    var art_state = '发布';
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    //像服务器上传表单数据
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // var fm = $('#form-pub')[0];
        var fd = new FormData($(this)[0]);
        fd.append('state', art_state);
        //添加封面图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                publishArticle(fd);
            })
    });

    //调用上传文章接口上传数据
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('上传文章失败！')
                }
                layer.msg('上传文章成功！');
                location.href = '/article/art_list.html'
            }
        })
    }
})