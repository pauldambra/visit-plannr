
const from = (apiEvent) => {
  const dest = JSON.parse(apiEvent.body)
  return {
    name: dest.name,
    geolocation: dest.geolocation,
    type: 'createDestination'
  }
}

module.exports = {
  from
}
