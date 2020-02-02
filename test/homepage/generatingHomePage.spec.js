const expect = require('chai').expect

const generate = require('../../src/destinations/homepage/htmlGenerator')

const expectedHtml = `
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
      <li>one</li>
      <li>two</li>
      <li>three</li>
      <li>four</li>
      <li>five</li>
    </ul>
  </div>
</body>
</html>
`

const lessThanFiveHTML = `
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
      <li>one</li>
      <li>two</li>
    </ul>
  </div>
</body>
</html>
`

describe('adding recent destinations to the home page', function () {
  it('generates expected html when there are exactly 5', async function () {
    const one = { name: 'one' }
    const two = { name: 'two' }
    const three = { name: 'three' }
    const four = { name: 'four' }
    const five = { name: 'five' }

    const html = await generate.homepage([one, two, three, four, five])
    expect(html).to.eql(expectedHtml)
  })

  it('removes unmatched templates when there are less than 5', async function () {
    const one = { name: 'one' }
    const two = { name: 'two' }

    const html = await generate.homepage([one, two])
    expect(html).to.eql(lessThanFiveHTML)
  })
  it('shows an error when there are no recent destinations')
})
