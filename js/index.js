$(function(){
  $('.checkbox').click(function(){
    $(this).toggleClass('select');
  });

  //添加滚动条
  $('.music-list').mCustomScrollbar();

  //播放按钮
  $('.play').click(function() {
    $(this).toggleClass('pause');
  })

  //播放模式：列表循环、顺序播放、随机播放、单曲循环
  var modeArr = ['mode-loop-list', 'mode-order', 'mode-random', 'mode-loop-single'];
  var modeIndex = 0;
  $('.mode-loop-list').click(function() {
    $(this).removeClass(modeArr[modeIndex]);
    modeIndex = (modeIndex + 1) % modeArr.length;
    $(this).addClass(modeArr[modeIndex]);
  })

  //喜欢按钮
  $('.fav').click(function() {
    $(this).toggleClass('fav-click');
  })

  //纯净模式切换按钮
  $('.only-off').click(function() {
    $(this).toggleClass('only-on');
  })
})