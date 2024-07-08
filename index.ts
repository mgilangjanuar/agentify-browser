import { NodeHtmlMarkdown } from 'node-html-markdown'
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

    const body = await req.json() as {
      url: string, as?: string
    }
    if (!body.url) {
      return new Response(JSON.stringify({}), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        }
      })
    }

    const browser = await new Playwright(body.url).launch()

    if (body.as === 'text') {
      const html = await browser.getText(false)
      await browser.close()
      console.log(`> innerText: ${body.url}`)
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        }
      })
    }

    if (body.as === 'markdown') {
      const html = await browser.getText(true)
      const text = NodeHtmlMarkdown.translate(html!, {
        keepDataImages: false,
        useLinkReferenceDefinitions: true
      })
      await browser.close()
      console.log(`> markdown: ${body.url}`)
      return new Response(text, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        }
      })
    }

    const buffer = await browser.getScreenshot(true)
    await browser.close()
    console.log(`> screenshot: ${body.url}`)
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      }
    })
  },
})

console.log(`Listening on localhost:${server.port}`)
