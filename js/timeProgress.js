
(function (window) {

  function Progress($barBottom, $barTop, $barDot, $time) {
    return new Progress.prototype.init($barBottom, $barTop, $barDot, $time);
  }


  Progress.prototype = {
    construct: Progress,
    init: function ($barBottom, $barTop, $barDot, $time) {
      this.$barBottom = $barBottom;
      this.$barTop = $barTop;
      this.$barDot = $barDot;
      this.$time = $time;
    },

    /**
     * 进度条点击钩子
     * @param {function} callback 
     * @param {double} radio 进度条当前宽度与总宽度的比值
     */
    progressClick: function (callback) {
      var that = this;

      //进度条点击事件，点击改变进度条宽度
      this.$barBottom.click(function (event) {
        //获取整个进度条完整的宽度
        var fullWidth = $(this).innerWidth();

        //获取鼠标点击位置距离进度条开始位置的宽度
        var w = event.pageX - $(this).offset().left;
        //设置进度条的宽度
        that.$barTop.css('width', `${w}px`);
        
        var radio = w / fullWidth;
        
        callback(radio);
      })
    },

    /**
     * 进度条移动钩子
     * @param {function} moveFn 回调函数，进度条被用户滑动时会被连续调用
     * @param {function} moveUpFn 回调函数，用户点击或滑动进度条后松开鼠标时被调用
     * @param {double} radio 进度条当前宽度与总宽度的比值
     */
    progressMoveEvent: function (moveFn, moveUpFn) {
      var that = this;
      var minLength = 0;
      var maxLength = this.$barBottom.get(0).clientWidth;
      var radio = 0; //比例
      this.$barDot.mousedown(function () {
        $(document).mousemove(function (event) {
          var w = event.pageX - that.$barBottom.offset().left;
          if (minLength <= w && w <= maxLength) {
            that.$barTop.css('width', `${w}px`);
            radio = w / maxLength;
            moveFn(radio);
          }
        })

        $(document).mouseup(function () {
          //解绑事件，以免造成叠加绑定
          $(document).off('mousemove').off('mouseup');
          moveUpFn(radio);
        })
      })
    },


    //设置进度条宽度
    setprogressWidth: function (value) {
      if (value < 0 || value > 100) return;
      this.$barTop.css('width', `${value}%`);
    }
  }
  Progress.prototype.init.prototype = Progress.prototype;
  window.Progress = Progress;
})(window)