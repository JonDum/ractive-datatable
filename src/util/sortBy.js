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
    a = a[key];
    b = b[key];
    // convert to lowercase for case insensitive sorting if items are strings only
    if ( typeof a === 'string' ) {
      a = a.toLowerCase();
    }
    if ( typeof b === 'string' ) {
      b = b.toLowerCase();
    }

    if (a < b) {
      return moveSmaller;
    }
    if (a > b) {
      return moveLarger;
    }
    return 0;
  };

}

module.exports = sortBy;
