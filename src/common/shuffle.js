//取得一个整随机数，取值范围为[lowerValue,upperValue]
function randomFrom(lowerValue,upperValue){
    return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
}

function unique(arr){
    var hash=[];
    for (var i = 0; i < arr.length; i++) {
      for (var j = i+1; j < arr.length; j++) {
        if(arr[i]===arr[j]){
          ++i;
        }
      }
        hash.push(arr[i]);
    }
    return hash;
  }

//以字符串str为种子，生成一个长度至少为minLen的字符数组，不够的部分随机填充
function shuffle(str, minLen) {
    //把字符串转成数组
	var arr=str.split('');
    var len=Math.max(minLen,arr.length);
    var mod=len%5;
    if(mod!==0){
        len=len+(5-mod);
    }

    //这一步必须在循环外计算，否则会随着arr.length的变化而变化
    var appendLen=len-arr.length;

    for(var i=0;i<appendLen;i++){
        var s=String.fromCharCode(randomFrom(97,117));
        arr.push(s);
    }

    //打乱：从数组中随机取一个数，移至末尾；然后从未移动过的数中再取一个数，移至倒数第二……
    for(let i=len-1;i>0;i--){
        var rnd=randomFrom(0,i);
        var item=arr.splice(rnd,1)
        arr.splice(i,0,item);
    }

    return arr;
	
}

export default shuffle;