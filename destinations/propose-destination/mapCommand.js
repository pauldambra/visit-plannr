
const fromAPI = (apiEvent, type) => {
  const dest = JSON.parse(apiEvent.body)
  const parsedCommand = {
    name: dest.name,
    geolocation: dest.geolocation,
    type
  }
  console.log(`received ${type} command: ${JSON.stringify(parsedCommand)}`)
  return parsedCommand
}

module.exports = {
  fromAPI
}
