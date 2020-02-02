
module.exports = {
  homepage: destinations => {
    const head = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Proof if proof be need be</title>
</head>
<body>
  <h1>proof if proof be need be</h1>
  <div>
    <ul>
`

    const tail = `
    </ul>
  </div>
</body>
</html>
`

    const list = destinations.map(d => `      <li>${d.name}</li>`).join('\n')

    return head + list + tail
  }
}
