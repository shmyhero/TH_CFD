'use strict'

var commonUtil = {
  //array 去重
  removeRepeat1:function(arr){
       for(var i=0;i<arr.length;i++)
           for(var j=i+1;j<arr.length;j++)
               if(arr[i]===arr[j]){arr.splice(j,1);j--;}

       return arr.sort(function(a,b){return a-b});
   },
}


module.exports = commonUtil;
