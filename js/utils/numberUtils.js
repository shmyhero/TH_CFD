Number.prototype.maxDecimal = function(decimalLength){
  return parseFloat(this.toFixed(decimalLength));
}
