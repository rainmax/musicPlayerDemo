(function () {
  /**
   * 歌词处理模块
   * @param {jqueryDom} $lyricArea 歌词显示区域,用于动态插入歌词
   */
  function Lyric($lyricArea) {
    return new Lyric.prototype.init($lyricArea);
  }

  Lyric.prototype = {
    construct: Lyric,
    init: function ($lyricArea) {
      this.$lyricArea = $lyricArea;
      this.lyricContent = null; //存放歌词与时间轴
      this.lyricTime = null; //存放时间轴
      this.lyricTimeIndex = 0; //歌词时间轴数组的索引
    },

    //用于加载歌词
    loadLyric: function (path) {
      var grepReg = /\[.+\].+/; //过滤无效行
      var timeReg = /^\[(\d+):(\d+)\.\d+\]/; //得到时间

      $.ajax({
        url: path,
        dataType: 'text',
        context: this,
        success: function (data) {
          //获取歌词文本
          this.lyricContent = data.split('\n');
          //去掉无歌词的行
          this.lyricContent = $.grep(this.lyricContent, function (item) {
            return grepReg.test(item);
          });
          //获取歌词时间轴
          this.lyricTime = $.map(this.lyricContent, function (item) {
            return parseInt(item.match(timeReg)[1]) * 60 + parseInt(item.match(timeReg)[2]);
          })
          //插入歌词
          this.insertLyric();
          
          //初始化索引
          this.lyricTimeIndex = 0;

        },
        error: function () {
          console.log('获取歌词失败');
        }
      })
    },

    //将歌词插入dom中
    insertLyric: function () {
      var that = this;
      var lyricReg = /\[.+\](.+)/; //得到歌词
      this.$lyricArea.empty();

      $.each(this.lyricContent, function (index, item) {
        // console.log(item.match(lyricReg)[1]);
        var text = item.match(lyricReg)[1];
        var html = `<p data-id=${index}>${text}</p>`;
        that.$lyricArea.append($(html));
      })
    },

    /**
     * 获取全歌词
     */
    getFullLyric: function () {
      return $.map(that.lyricContent, function (item) {
        return item.match(lyricReg)[1];
      });
    },

    /**
     * 获取当前歌词的时间轴
     * @return {number} 当前歌词对应的时间轴
     */
    getCurLyricTime: function () {
      return this.lyricTime[this.lyricTimeIndex];
    },
    /**
     * 时间轴数组索引往下移一步
     */
    goNext: function () {
      this.lyricTimeIndex = this.lyricTimeIndex === this.lyricTime.length - 1 ?
        this.lyricTimeIndex : this.lyricTimeIndex + 1;
    },

    /**
     * 获取索引
     */
    getCurIndex: function () {
      return this.lyricTimeIndex;
    },

    /**
     * 根据传入的时间设置索引
     * @param {double} currentTime 当前的时间
     */
    setCurIndex: function (currentTime) {
      var that = this;
      currentTime = parseInt(currentTime);
      $.each(this.lyricTime, function (index, item) {
        if (currentTime <= item) { 
          that.lyricTimeIndex = index-1;
          return false;
        }
      })
    }
  },

    Lyric.prototype.init.prototype = Lyric.prototype;
  window.Lyric = Lyric;
})(window)