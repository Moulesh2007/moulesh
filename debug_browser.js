const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));
  page.on('requestfailed', request => console.log('BROWSER_NET_FAIL:', request.url(), request.failure().errorText));

  try {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 15000 });
    const content = await page.content();
    console.log('HTML length:', content.length);
    console.log('Root HTML:', await page.$eval('#root', el => el.innerHTML));
  } catch (err) {
    console.log('Puppeteer Error:', err.message);
  } finally {
    await browser.close();
  }
})();
