import { chromium, type Browser, type Page } from 'playwright'

export class Playwright {
  page: Page | null = null
  browser: Browser | null = null

  constructor(public url: string) {}

  async launch() {

    this.browser = await chromium.launch({
      channel: 'chromium',
      headless: true,
      handleSIGHUP: false,
      handleSIGINT: false,
      handleSIGTERM: false,
      args: [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
      ]
    })

    const ctx = await this.browser.newContext({
      viewport: {
        width: 1280,
        height: 720
      },
      acceptDownloads: false,
      permissions: [],
    })
    const page = await ctx.newPage()
    await page.goto(this.url, { waitUntil: 'domcontentloaded' })
    this.page = page
    return this
  }


  async getText(useTextContent: boolean = true) {
    if (!this.page) throw new Error('Page not loaded')
    const $ = this.page.locator('body')
    const result = useTextContent ? await $.textContent() : await $.innerText()
    return result
  }

  async getScreenshot(fullPage: boolean = true) {
    if (!this.page) throw new Error('Page not loaded')
    const result = await this.page.screenshot({ fullPage })
    return result
  }

  async close() {
    if (!this.page) throw new Error('Page not loaded')
    await this.page.context().close()
    await this.browser?.close()
  }
}
