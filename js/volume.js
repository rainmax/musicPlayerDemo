(function (window) {

  function Volume($volumeButton, $barBottom, $barTop, $barDot) {
    return Volume.prototype.init($volumeButton, $barBottom, $barTop, $barDot);
  }

  Volume.prototype = {
    construct: Volume,
    init: function ($volumeButton, $barBottom, $barTop, $barDot) {
      this.$volumeButton = $volumeButton;
      this.$barBottom = $barBottom;
      this.$barTop = $barTop;
      this.$barDot = $barDot;
      this.fullWidth = $barBottom.innerWidth();
    },

    /**
     * 音量按钮点击钩子
     */
    ButtonClick: function (callback) {
      var that = this;
      this.$volumeButton.on('click', function () {
        var radio = that.$barTop.innerWidth() / that.fullWidth;
        callback(radio);
      })
    },

    /**
     * 音量进度条点击钩子
    */
    ProgressClick: function (callback) {
      var that = this;
      this.$barBottom.on('click', function (event) {
        var w = event.pageX - $(this).offset().left;
        that.$barTop.css('width', `${w}px`);
        var radio = w / that.fullWidth;
        callback(radio);
      })
    },

    /**
     * 音乐进度条移动钩子
     */
    progressMove: function (callback) {
      var that = this;
      this.$barDot.on('mousedown', function () {
        $(document).mousemove(function (event) {
          var w = event.pageX - that.$barBottom.offset().left;
          if (0 > w || that.fullWidth < w) return;
          that.$barTop.css('width', `${w}px`);
          callback(w / that.fullWidth);
        }),
        $(document).off('mouseup').mouseup(function () {
          $(this).off('mousemove');
        })
      })
    }
  },

  Volume.prototype.init.prototype = Volume.prototype;
  window.Volume = Volume;

})(window)