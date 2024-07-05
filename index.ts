const server = Bun.serve({
  port: process.env.PORT || 4013,
  fetch(request) {
    return new Response("Welcome to Bun!")
  },
})

console.log(`Listening on localhost:${server.port}`)
