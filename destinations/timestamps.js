
const stringify = d => {
  d = d || new Date()
  return d.toISOString()
}

const decorate = (o, d) => {
  const timestamp = stringify(d)
  let copy = JSON.parse(JSON.stringify(o))
  copy.timestamp = timestamp
  return copy
}

module.exports = {
  stringify,
  decorate
}
