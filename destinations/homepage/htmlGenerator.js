
module.exports = {
  homepage: ([one, two, three, four, five]) => (`
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
      <li>${one.name}</li>
      <li>${two.name}</li>
      <li>${three.name}</li>
      <li>${four.name}</li>
      <li>${five.name}</li>
    </ul>
  </div>
</body>
</html>
`)
}
