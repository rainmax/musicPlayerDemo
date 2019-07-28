(function (window) {
  function Player($audio) {
    return new Player.prototype.init($audio);
  } 

  Player.prototype = {
    construct : Player,
    musicList : [],
    
    init : function ($audio) {
      this.$audio = $audio;
      this.audio = $audio.get(0);

    },
    prevIndex : -1,
    play : function (index) {
      var that = this;
      if(this.prevIndex === index) {
        //同一首歌，执行暂停或播放
        this.audio.paused ? this.audio.play() : this.audio.pause();
      } else {
        this.$audio.attr('src', this.musicList[index].link_url);
        this.audio.load();
        this.$audio.off('durationchange').on('durationchange', function () {
          that.audio.play();
        })
      }
      this.prevIndex = index;
    },

    playPrev: function () {
      if(this.prevIndex === -1) return;
      this.prevIndex - 1 < 0 ? this.play(this.musicList.length - 1) : this.play(this.prevIndex - 1);
    },
    playNext: function () {
      if(this.prevIndex === -1) return;
      this.prevIndex + 1 > this.musicList.length - 1 ? this.play(0) : this.play(this.prevIndex + 1);
    },
    deleteMusic: function (index) {
      this.musicList.splice(index,1);
    },
    
    /**
     * 播放事件钩子，播放时会不停调用回调函数
     * @param {function} callback 
     * @param {double} currentTime //歌曲当前的时间，以秒为单位
     * @param {double} duration //歌曲总体时长，以秒为单位
     * @param {String} timeStr //特定格式的时间字符串，如 00:23 / 05:23
     */
    audioTimeUpdate: function (callback) {
      var that = this;
      var startTimeStamp = Date.now();

      $('audio').on('timeupdate', function () {
        //节流下，频繁调用会影响性能
        var now = Date.now();
        var duration = that.audio.duration;
        
        duration = duration ? duration : 0;
        if (now - startTimeStamp < 800) return;
        startTimeStamp = now;
        var currentTime = that.audio.currentTime;

        callback(currentTime, duration, timeFormat(currentTime, duration));
      })  
    },

    /**
     * 播放结束钩子
     */
    audioEndEvent: function (callback) {
      this.$audio.on('ended', function () {
        callback();
      })
    },
    
    /**
     * 设置歌曲跳转到某时间点
     * @param {double} radio 比例，可根据比例与歌曲总长度算出跳转的位置
     */
    setCurTime: function (radio) {
      this.audio.currentTime = radio * this.audio.duration;
    },

    /**
     * 设置音量
     * @param {double} value 取值范围为0~1 
     */
    setVolume: function (value) {
      if (value < 0 || value > 1) return;
      this.audio.volume = value;
    },

    /**
     * 获取歌曲的总时长
     * @return {double} 歌曲的时长，以秒为单位，带有小数点
     */
    getDuration: function () {
      return this.audio.duration;
    },

    loadMusic: function (src) {
      this.audio.src = src;
    }
  }

  Player.prototype.init.prototype = Player.prototype;
  window.Player = Player;

})(window)