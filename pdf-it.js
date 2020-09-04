const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://pixinvent.com/stack-responsive-bootstrap-4-admin-template/html/ltr/vertical-menu-template/', {waitUntil: 'networkidle2'});
  await page.pdf({path: 'download.pdf', format: 'A4'});
  await browser.close();
})();