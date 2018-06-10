
const stringify = d => {
  d = d || new Date()
  return d.toISOString()
}

const decorate = (toDecorate, date) => {
  const timestamp = stringify(date)

  let copy = JSON.parse(JSON.stringify(toDecorate))
  copy.timestamp = timestamp

  if (copy.event) {
    copy.event.timestamp = timestamp
  }

  return copy
}

module.exports = {
  stringify,
  decorate
}
