/**
 * @description 
 * Returns a function which will sort an
 * array of objects by the given key.
 * 
 * @param  {String}  key
 * @param  {Boolean} reverse
 * @return {Function}     
 */
function sortBy(key, reverse) {

  // Move smaller items towards the front
  // or back of the array depending on if
  // we want to sort the array in reverse
  // order or not.
  var moveSmaller = reverse ? 1 : -1;

  // Move larger items towards the front
  // or back of the array depending on if
  // we want to sort the array in reverse
  // order or not.
  var moveLarger = reverse ? -1 : 1;

  /**
   * @param  {*} a
   * @param  {*} b
   * @return {Number}
   */
  return function(a, b) {
    if (a[key] < b[key]) {
      return moveSmaller;
    }
    if (a[key] > b[key]) {
      return moveLarger;
    }
    return 0;
  };

}

module.exports = sortBy;
