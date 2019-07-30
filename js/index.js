$(function () {
  //初始化播放器
  var player = new Player($('audio'));
  player.setVolume(0.5);

  var $lyShowArea = $('.music-lyric-inner');
  var lyric = new Lyric($lyShowArea);

  //初始化时间进度条
  var $timeBarBottom = $('.time-progress .bar-bottom');
  var $timeBarTop = $('.time-progress .bar-top');
  var $timeBarDot = $('.time-progress .bar-dot');
  var $time = $('.time-progress .time');

  var timeProgress = new Progress($timeBarBottom, $timeBarTop, $timeBarDot, $time);

  //初始化音量进度条
  var $volumeButton = $('.volume .volume-button');
  var $volumeBarBottom = $('.volume .bar-bottom');
  var $volumeBarTop = $('.volume .bar-top');
  var $volumeBarDot = $('.volume .bar-dot');

  var volume = new Volume($volumeButton, $volumeBarBottom, $volumeBarTop, $volumeBarDot);

  //设置dom元素的事件监听
  handleInit();

  //动态加载音乐列表
  getMusicList();

  function handleInit() {
    $('.checkbox').click(function () {
      $(this).toggleClass('select');
    });

    //添加滚动条
    $('.music-list-wrap').mCustomScrollbar();

    //播放按钮
    $('.ft-pause').click(function () {
      $(this).toggleClass('ft-play');
    })

    //播放模式：列表循环、顺序播放、随机播放、单曲循环
    var modeArr = ['mode-loop-list', 'mode-order', 'mode-random', 'mode-loop-single'];
    var modeIndex = 0;
    $('.mode-loop-list').click(function () {
      $(this).removeClass(modeArr[modeIndex]);
      modeIndex = (modeIndex + 1) % modeArr.length;
      $(this).addClass(modeArr[modeIndex]);
    })

    //喜欢按钮
    $('.fav').click(function () {
      $(this).toggleClass('fav-click');
    })

    //纯净模式切换按钮
    $('.only-off').click(function () {
      $(this).toggleClass('only-on');
    })

    //使用事件委托处理动态加载的dom中的一些事件
    var prevMusicIndex = 0;
    var curMusicIndex = 0;
    var lastClickIndex = -1;

    $('.music-list').on('click', 'i', function () {
      $(this).parent().toggleClass('select');
    });

    $('.music-list-head').on('click', 'i', function () {
      $(this).parent().toggleClass('select');
    });

    //音乐列表中的播放按钮
    $('.music-list').on('click', '.menu-list-js-play', function () {
      curMusicIndex = $(this).parents('.list-item').index();
      var $prevListIitem = $('.music-list .list-item').eq(prevMusicIndex);
      var $curListItem = $(this).parents('.list-item');

      //设置封面、歌名等信息
      curMusicIndex === prevMusicIndex ? 0 : setMusicInfo($curListItem.get(0).music);
      //是否在同一首歌之间切换播放与暂停
      if (curMusicIndex === prevMusicIndex) {
        $curListItem.find('.num').toggleClass('select'); //将歌曲序号替换为播放gif图
        $curListItem.toggleClass('list-item-light');
        $(this).toggleClass('menu-list-play');
      } else {
        //1.停止正在播放的另一首音乐
        $prevListIitem.find('.menu-list-js-play').removeClass('menu-list-play');
        $(this).addClass('menu-list-play');

        //2.去除其他行的高亮，让当前行高亮
        $prevListIitem.removeClass('list-item-light');
        $curListItem.addClass('list-item-light');

        //3.隐藏上一首的按钮列表
        $prevListIitem.find('.menu-list').removeClass('show');
        $prevListIitem.find('.time').removeClass('show');

        //4.取出其他行的播放gif图
        $prevListIitem.find('.num').removeClass('select');
        $curListItem.find('.num').addClass('select');

        //5.加载新歌的歌词
        lyric.loadLyric($curListItem.get(0).music.link_lrc);
      }
      prevMusicIndex = curMusicIndex;
      //固定显示当前歌曲的播放等按钮
      $(this).parent().addClass('show');
      $curListItem.find('.time').addClass('show');
      //与下栏的播放按钮同步
      $(this).hasClass('menu-list-play') ? $('.ft-pause').addClass('ft-play') : $('.ft-pause').removeClass('ft-play');

      //播放或暂停歌曲
      player.play(curMusicIndex);

      if (lastClickIndex !== -1 && lastClickIndex !== prevMusicIndex) {
        $('.music-list .list-item').eq(lastClickIndex).find('.menu-list').removeClass('show');
        $('.music-list .list-item').eq(lastClickIndex).find('.time').removeClass('show');
      }
      lastClickIndex = curMusicIndex;
    });

    //音乐列表删除按钮
    $('.music-list').on('click', '.menu-list-js-delete', function () {
      var length = $('.music-list .list-item .num').length;
      var curIndex = $(this).parents('.list-item').index();
      var $curlistItem = $(this).parents('.list-item');
      var $numItems = $('.music-list .list-item .num');
      var $prePlayItem = $('.music-list .list-item').eq(lastClickIndex);

      $prePlayItem.hasClass('list-item-light') ? $prePlayItem.removeClass('list-item-light') : 0;
      $prePlayItem.find('.num').hasClass('select') ? $prePlayItem.find('.num').removeClass('select') : 0;
      $prePlayItem.find('.menu-list-js-play').removeClass('menu-list-play');
      $prePlayItem.find('.time').removeClass('show');
      $prePlayItem.find('.menu-list').hasClass('show') ? $prePlayItem.find('.menu-list').removeClass('show') : 0;

      $curlistItem.remove();

      player.deleteMusic(curIndex);
      player.prevIndex = -10;
      curIndex = curIndex > (player.musicList.length - 1) ? curIndex - 1 : curIndex;

      var $curPlayingItem = $('.music-list .list-item').eq(curIndex);
      setMusicInfo($curPlayingItem.get(0).music);
      lastClickIndex = prevMusicIndex = curMusicIndex = curIndex;
      $('.ft-pause').trigger('click');
      for (var i = curIndex; i < length; i++) {
        $numItems.eq(i).text(i);
      }
    })

    //底部上一首、播放和下一首按钮事件监听
    $('.ft-pause').click(function () {
      var $curListItem = $('.music-list .list-item').eq(curMusicIndex);

      if (player.prevIndex === -1) {
        //如果没有歌曲被选中，则默认播放第一首
        player.play(0);
      } else {
        player.play(curMusicIndex);
      }
      $curListItem.toggleClass('list-item-light');
      $curListItem.find('.menu-list-js-play').toggleClass('menu-list-play');
      $curListItem.find('.num').toggleClass('select');
    })

    $('.ft-prev').click(function () {
      if (player.prevIndex === -1) return;

      var $prevListItem = $('.music-list .list-item').eq(curMusicIndex);

      if ($prevListItem.find('.menu-list-js-play').hasClass('menu-list-play')) {

        //给播放列表中正在播放的歌曲添加样式
        $prevListItem.toggleClass('list-item-light');
        $prevListItem.find('.menu-list-js-play').toggleClass('menu-list-play');
        $prevListItem.find('.num').toggleClass('select');
        $('.ft-pause').addClass('ft-play');
      }

      //播放音乐
      player.playPrev();

      //更新当前音乐的位置下标
      curMusicIndex = player.prevIndex;
      prevMusicIndex = curMusicIndex;
      var $curListItem = $('.music-list .list-item').eq(curMusicIndex);

      $curListItem.toggleClass('list-item-light');
      $curListItem.find('.menu-list-js-play').toggleClass('menu-list-play');
      $curListItem.find('.num').toggleClass('select');

      setMusicInfo($curListItem.get(0).music);
    })

    $('.ft-next').click(function () {
      var $prevListItem = $('.music-list .list-item').eq(curMusicIndex);

      if ($prevListItem.find('.menu-list-js-play').hasClass('menu-list-play')) {
        //给播放列表中正在播放的歌曲添加样式
        $prevListItem.toggleClass('list-item-light');
        $prevListItem.find('.menu-list-js-play').toggleClass('menu-list-play');
        $prevListItem.find('.num').toggleClass('select');
        $('.ft-pause').addClass('ft-play');
      }

      //播放音乐
      player.playNext();

      //更新当前音乐的位置下标
      curMusicIndex = player.prevIndex;
      prevMusicIndex = curMusicIndex;
      var $curListItem = $('.music-list .list-item').eq(curMusicIndex);

      $curListItem.toggleClass('list-item-light');
      $curListItem.find('.menu-list-js-play').toggleClass('menu-list-play');
      $curListItem.find('.num').toggleClass('select');

      setMusicInfo($curListItem.get(0).music);
    })


    //该变量为进度条滑动标记，当进度条被用户滑动时，值为true
    var progressMoving = false;
    var jumpTo = false;
    var ySum = 0;
    var lyIndex = 0;
    //播放事件钩子，用于音乐播放时不停的改变时间
    player.audioTimeUpdate(function (currentTime, duration, timeStr) {
      if(parseInt(currentTime) < 1) {
        ySum = 0;
      }
      //用户在滑动进度条时，这里就不该动进度条的长度了
      if (!progressMoving) {
        $time.text(timeStr);
        timeProgress.setprogressWidth(currentTime / duration * 100);
      }
      //用户点击了进度条跳转，此时应该将索引设到对应歌词上
      if (jumpTo) {
        lyric.setCurIndex(currentTime);
        lyIndex = lyric.getCurIndex();
        ySum = 0;
        $lyShowArea.find('p').each(function (index, domElem) {
          if (index > lyIndex - 3) return false;
          ySum += $(domElem).innerHeight();
        })
        jumpTo = false;
      }

      //同步歌词
      if (parseInt(currentTime) >= lyric.getCurLyricTime()) {
        lyIndex = lyric.getCurIndex();
        $lyShowArea.find('p').eq(lyIndex).addClass('on').siblings('[class=on]').removeClass('on');
        lyric.goNext();
        if (lyIndex < 2) return;
        var yLength = $lyShowArea.find('p').eq(lyIndex - 2).innerHeight();
        ySum += yLength;
        $lyShowArea.css('transform', `translate(0px, -${ySum}px)`);
      }
    })


    //进度条点击钩子，用于点击后改变当前歌曲时间
    timeProgress.progressClick(function (radio) {
      jumpTo = true;
      player.setCurTime(radio);
    })


    //进度条移动钩子，用于点击后改变当前歌曲时间
    timeProgress.progressMoveEvent(function (radio) {
      progressMoving = true;
      //改变当前显示的歌曲进度
      var duration = player.getDuration();
      var currentTime = duration * radio;
      var timeStr = timeFormat(currentTime, duration);
      $time.text(timeStr);
    }, function (radio) {
      progressMoving = false;
      jumpTo = true;
      player.setCurTime(radio);
    })

    //音量按钮点击钩子，点击切换静音
    volume.ButtonClick(function (radio) {
      $volumeButton.toggleClass('muted');

      $volumeButton.hasClass('muted') ? player.setVolume(0) : player.setVolume(radio);
    })

    //音量进度条点击钩子，实现点击改变音量
    volume.ProgressClick(function (radio) {
      player.setVolume(radio);
    })

    //音量进度条移动钩子，用户滑动进度条时会多次触发回调
    volume.progressMove(function (radio) {
      player.setVolume(radio);
    })

    //播放结束钩子，播放结束后自动切换下一首歌
    player.audioEndEvent(function () {
      $('.ft-next').trigger('click');
    });
  }

  function getMusicList() {
    $.ajaxSetup({
      url: '/musicPlayerDemo/'
    })

    $.ajax({
      url: 'source/musiclist.json',
      dataType: 'JSON',
      success: function (data) {
        player.musicList = data;
        var musicList = $('.music-list')
        $.each(data, function (index, item) {
          var musicItem = createMusicListItem(index, item);
          musicItem.get(0).music = item;
          musicList.append(musicItem);
        });
        setMusicInfo(data[0]);
        player.loadMusic(data[0].link_url);
        player.prevIndex = 0;
        //载入歌词
        lyric.loadLyric(data[0].link_lrc);
      },
      error: function () {
        console.log('网络请求出错');
      }
    })
  }

  function createMusicListItem(index, item) {
    if (item == null) return;
    var html = `
    <li class="list-item">
      <div class="checkbox"><i></i></div>
      <div class="num">${index + 1}</div>
      <div class="song">${item.name} 
        <div class="menu-list">
          <a href="javascript:;" title="播放" class="menu-list-pause menu-list-js-play"></a>
          <a href="javascript:;" title="添加" class="menu-list-add menu-list-js-add"></a>
          <a href="javascript:;" title="下载" class="menu-list-download menu-list-js-download"></a>
          <a href="javascript:;" title="分享" class="menu-list-share"></a> 
        </div>
      </div>
      <div class="singer">${item.singer}</div>
      <div class="time"><a href="javascript:;" title="删除" class="menu-list-js-delete"></a><span>${item.time}</span></div>
    </li>`
    return $(html);
  }

  function setMusicInfo(music) {
    var $musicName = $('.music-info .music-name');
    var $musicSinger = $('.music-info .singer');
    var $musicAblum = $('.music-info .ablum');
    var $musicCover = $('.music-info .cover img');
    var $songAndSinger = $('.song-info .song-and-singer');
    var $musicTime = $('.song-info .time');
    var $musicBg = $('.mask-bg');

    $musicName.text(music.name);
    $musicSinger.text(music.singer);
    $musicAblum.text(music.album);
    $musicTime.text(`00:00 / ${music.time}`);
    $songAndSinger.text(`${music.name} / ${music.singer}`);

    $musicCover.attr('src', music.cover);
    $musicBg.css('background-image', `url(${music.cover})`);
  }
})