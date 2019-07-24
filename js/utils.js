/**
 * 格式化时间
 * @param {double} curTime 当前音乐的秒数
 * @param {double} duration 音乐总长秒数
 * @return {String} 格式为 02:10 / 04:23
 */
function timeFormat(curTime, duration) {
  //根据秒数求出分秒
  curTime = parseInt(curTime);
  var curMin = parseInt(curTime / 60);
  var curSecond = parseInt(curTime % 60);
  duration = parseInt(duration);
  var endMin = parseInt(duration / 60);
  var endSecond = parseInt(duration % 60);

  //不足两位，前面补零
  curMin = curMin.toString().padStart(2, '0');
  curSecond = curSecond.toString().padStart(2, '0');
  endMin = endMin.toString().padStart(2, '0');
  endSecond = endSecond.toString().padStart(2, '0');

  return `${curMin}:${curSecond} / ${endMin}:${endSecond}`;
}