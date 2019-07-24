
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
      this.progressDragInit();
    },

    progressClick: function (callback) {
      var that = this;

      //进度条点击事件，点击改变进度条宽度
      this.$barBottom.click(function (event) {
        //获取整个进度条完整的宽度
        var fullWidth = that.$barBottom.get(0).clientWidth;

        //获取鼠标点击位置距离进度条开始位置的宽度
        var w = event.pageX - $(this).offset().left;
        //设置进度条的宽度
        that.$barTop.css('width', `${w}px`);
        
        var radio = w / fullWidth;
        // var ratio = 
        callback(radio);

      })
    },

    progressDragInit: function () {
      var that = this;
      var minLength = 0;
      var maxLength = this.$barBottom.get(0).clientWidth;
      this.$barDot.mousedown(function () {
        $(document).mousemove(function (event) {
          var w = event.pageX - that.$barBottom.offset().left;
          if (minLength <= w && w <= maxLength) {
            that.$barTop.css('width', `${w}px`);
            //改变时间
            var tempArr1 = that.$time.text().split('/');
            var tempArr2 = tempArr1[1].split(':');

            var songFullSecond = parseInt(tempArr2[0]) * 60 + parseInt(tempArr2[1]);
            var rate = w / that.$barBottom.get(0).clientWidth;
            var curFullSecond = parseInt(songFullSecond * rate);
            var curMin = parseInt(curFullSecond / 60);
            var curSecond = curFullSecond % 60;

            curMin = curMin.toString().padStart(2, '0');
            curSecond = curSecond.toString().padStart(2, '0');
            that.$time.text(`${curMin}:${curSecond} / ${tempArr1[1]}`);
          }
        })

        $(document).mouseup(function () {
          $(document).off('mousemove');
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