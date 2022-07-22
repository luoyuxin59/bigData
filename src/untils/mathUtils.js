export  function mathMax(arr) {
  var max = arr[0];
  for(var i = 1; i < arr.length; i++) {
    if(arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

export  function mathMin(arr){
  var min = arr[0];
  for(var i = 1; i < arr.length; i++) {
    if(arr[i] < min) {
      min = arr[i];
    }
  }
  return min;
}
