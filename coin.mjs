/** Coin flip functions 
 * This module will emulate a coin flip given various conditions as parameters as defined below
 */

/** Simple coin flip
 * 
 * Write a function that accepts no parameters but returns either heads or tails at random.
 * 
 * @param {*}
 * @returns {string} 
 * 
 * example: coinFlip()
 * returns: heads
 * 
 */

function coinFlip() {
  var randomInt = Math.floor(Math.random() * 2)
  if (randomInt == 0) { return "heads" }
  else { return "tails" }
}

/** Multiple coin flips
 * 
 * Write a function that accepts one parameter (number of flips) and returns an array of 
 * resulting "heads" or "tails".
 * 
 * @param {number} flips 
 * @returns {string[]} results
 * 
 * example: coinFlips(10)
 * returns:
 *  [
      'heads', 'heads',
      'heads', 'tails',
      'heads', 'tails',
      'tails', 'heads',
      'tails', 'heads'
    ]
 */

function coinFlips(flips) {
  var array = []
  for (var i = 0; i < flips; i++) {
    if (coinFlip() == "heads") { array[i] = "heads" }
    else { array[i] = "tails" }
  }
  return array
}

/** Count multiple flips
 * 
 * Write a function that accepts an array consisting of "heads" or "tails" 
 * (e.g. the results of your `coinFlips()` function) and counts each, returning 
 * an object containing the number of each.
 * 
 * example: countFlips(['heads', 'heads','heads', 'tails','heads', 'tails','tails', 'heads','tails', 'heads'])
 * { tails: 5, heads: 5 }
 * 
 * @param {string[]} array 
 * @returns {{ heads: number, tails: number }}
 */

function countFlips(array) {
  var headsCounter = 0
  var tailsCounter = 0
  for (var i = 0; i < array.length; i++) {
    if (array[i] == "heads") { headsCounter++ }
    else { tailsCounter++ }
  }
  if (tailsCounter == 1 && headsCounter == 0) {
    return {"tails": tailsCounter}
  }
  else if (headsCounter == 1 && tailsCounter == 0) {
    return {"heads": headsCounter}
  }
  return {"tails": tailsCounter, "heads": headsCounter}
}

/** Flip a coin!
 * 
 * Write a function that accepts one input parameter: a string either "heads" or "tails", flips a coin, and then records "win" or "lose". 
 * 
 * @param {string} call 
 * @returns {object} with keys that are the input param (heads or tails), a flip (heads or tails), and the result (win or lose). See below example.
 * 
 * example: flipACoin('tails')
 * returns: { call: 'tails', flip: 'heads', result: 'lose' }
 */

function flipACoin(call) {
  var flip = coinFlip()
  var result = "lose"
  if (call == flip) { result = "win"}
  const object = {
    "call": call,
    "flip": flip,
    "result": result
  }
  return object
}


/** Export 
 * 
 * Export all of your named functions
*/
export { coinFlip, coinFlips, countFlips, flipACoin}
