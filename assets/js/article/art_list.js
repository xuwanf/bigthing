$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;
  //定义请求数据对象
  var q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
  };
  //获取文章列表并渲染到页面
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status != 0) {
          return layer.msg('获取文章列表失败！')
        }
        // console.log(res);
        var htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
        //调用渲染分页
        initPage(res.total);
      }
    })
  };
  initTable();
  // 美化时间
  template.defaults.imports.dataFormat = function (data) {
    const dt = new Date(data);
    var y = padZero(dt.getFullYear());
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());
    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  };
  //时间补0函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  };
  //获取文章分类函数
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status != 0) {
          layer.msg('获取文章分类分类失败！')
        }
        var htmlStr = template('tpl-cate', res);
        $('[name="cate_id"]').html(htmlStr);
        //layui重新渲染表单
        form.render('select');
      }
    })
  };
  initCate();
  //根据选择的下拉列表状态重新渲染列表
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    var cate_id = $('[ name="cate_id"]').val(),
      state = $('[name="state"]').val();
    q.cate_id = cate_id;
    q.state = state;
    //调用重新渲染
    initTable();
  });
  //分页渲染
  function initPage(total) {
    laypage.render({
      elem: 'pageBox',
      count: total,
      limit: q.pagesize,
      limits: [2, 5, 6, 10],
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      curr: q.pagenum,
      jump: function (obj, first) {
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        //第一次不掉用渲染函数
        if (!first) {
          initTable();
        }
      }
    })
  };
  //删除文章按钮
  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id');
    var len = $('.btn-delete').length;
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status != 0) {
            return layer.msg('删除文章失败！')
          };
          layer.msg('删除文章成功！')
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        }
      });
      layer.close(index);
    });
  });


})