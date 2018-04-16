Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// Date.prototype.getDateString = function(){
//   var dd = this.getDate();
//   var mm = this.getMonth()+1; //January is 0!
//   var yyyy = this.getFullYear();
//   if(dd<10) {
//       dd='0'+dd
//   }
//   if(mm<10) {
//       mm='0'+mm
//   }
//   today = mm+'/'+dd+'/'+yyyy;
//   return today;
// }


Date.prototype.getDateString = function(){
    var dd = this.getDate();
    var mm = this.getMonth()+1; //January is 0!
    var yyyy = this.getFullYear();

    var hour = this.getHours();
    var minute = this.getMinutes();
    if(dd<10) {
        dd='0'+dd
    }
    if(mm<10) {
        mm='0'+mm
    }
    if(hour<10){
        hour='0'+hour
    }
    if(minute<10){
        minute='0'+minute
    }
    today = yyyy+"."+mm+"."+dd+" "+hour+"."+minute;
    return today;
  }


  Date.prototype.getDateSimpleString = function(){
    var hour = this.getHours();
    var minute = this.getMinutes(); 
        
    if(hour<10) {
        hour='0'+hour
    }
    if(minute<10) {
        minute='0'+minute
    }
    today = hour+':'+minute
    return today;
    }

    Date.prototype.getDateFullString = function(){
        var weekday = new Array("日", "一", "二", "三", "四", "五", "六");
        var day = weekday[this.getDay()];//当前系统天数0-6 

        var dd = this.getDate();
        var mm = this.getMonth()+1; //January is 0!
        var yyyy = this.getFullYear();
        var dayName = this.get
        if(dd<10) {
            dd='0'+dd
        }
        if(mm<10) {
            mm='0'+mm
        }

         
        today = yyyy+"年"+mm+"月"+dd+"日" + "  星期" + day;
        return today;
      }




