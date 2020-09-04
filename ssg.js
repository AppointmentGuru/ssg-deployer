const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  var domain = 'https://example.com';
  if (process.argv.length > 2) {
    domain = process.argv[2];
  }
  console.log("fetching " + domain);
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();
  await page.goto(domain, {waitUntil: 'networkidle2'});
  await page.screenshot({path: 'outputs/screenshot.png'});
  // await page.pdf({path: 'vuetify.pdf', format: 'A4'});
  const html = await page.content();
  // console.log(html)
  fs.writeFile('outputs/index.html', html, function (err) {
    if (err) return console.log(err);
    console.log('Wrote index.html');
  })
  await browser.close();
})();