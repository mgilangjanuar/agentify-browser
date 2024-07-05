import { Playwright } from './lib/playwright'

const server = Bun.serve({
  port: process.env.PORT || 4013,
  async fetch(req: Request) {
    const secret = req.headers.get('Authorization')
    if (secret !== `Bearer ${process.env.SECRET}`) {
      return new Response(JSON.stringify({}), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        }
      })
    }

    const body = await req.json() as { url: string }
    if (!body.url) {
      return new Response(JSON.stringify({}), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        }
      })
    }

    const browser = await new Playwright(body.url).launch()
    const buffer = await browser.getScreenshot(true)
    await browser.close()
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      }
    })
  },
})

console.log(`Listening on localhost:${server.port}`)
