$(function () {
    var layer = layui.layer
    var form = layui.form;
    initArtCateList();

    // 获取文章分类的列表 通过模板引擎渲染到表单
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    });
    //发起添加类ajax请求
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('新增分类失败!')
                }
                initArtCateList();
                layer.msg('添加分类成功');
                //根据索引关闭特定弹出层
                layer.close(indexAdd);
            }
        })
    });
    //给编辑按钮绑定点击事件 通过id获取对应数据
    var indexEdit = null;
    $('body').on('click', '.btn-edit', function () {
        //利用layui设置弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取该项分类失败!')
                }
                // console.log(res);
                //利用layui快速给表单渲染数据
                form.val('form-edit', res.data);
                
            }
        })
    });
    // 确认修改按钮 发起修改请求
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('编辑分类失败！')
                }
                initArtCateList();
                //关闭该弹出层
                layer.close(indexEdit);
                layer.msg('编辑分类成功！')
            }
        })
    });
    //删除分类  为删除按钮添加点击事件
    $('body').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: "/my/article/deletecate/" + id,
            success: function (res) {
                if (res.status != 0) {
                    console.log(res);
                    return layer.msg('删除该分类失败')
                }
                initArtCateList();
                layer.msg('删除该分类成功！')
            }
        })
    });
})
