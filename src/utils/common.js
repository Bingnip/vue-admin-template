export function in_array(stringToSearch, arrayToSearch) {
  var thisEntry = ''

  for (let s = 0; s < arrayToSearch.length; s++) {
    thisEntry = arrayToSearch[s].toString()
    if (thisEntry == stringToSearch) {
      return true
    }
  }
  return false
}
