async function doAsync(callback1, callback2) {
  await new Promise((resolve) => {
    setTimeout(() => {
      callback1(1)
      callback2(2)
      resolve()
    })
  })
}
test('doAsync calls both callbacks', async () => {
  expect.assertions(2)
  function callback1(data) {
    expect(data).toBeTruthy()
  }
  function callback2(data) {
    expect(data).toBeTruthy()
  }
  await doAsync(callback1, callback2)
})
