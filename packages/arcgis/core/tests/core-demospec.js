class Cat {}
function getCat(fn) {
  return fn(new Cat())
}

test('randocall calls its callback with a class instance', () => {
  const mock = jest.fn()
  getCat(mock)
  expect(mock).toBeCalledWith(expect.any(Cat))
})

function randocall(fn) {
  return fn(Math.floor(Math.random() * 6 + 1))
}

test('randocall calls its callback with a number', () => {
  const mock = jest.fn()
  randocall(mock)
  expect(mock).toBeCalledWith(expect.any(Number))
})
