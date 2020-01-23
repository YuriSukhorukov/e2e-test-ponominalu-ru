const puppeteer = require('puppeteer');
var fs = require('fs');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;

let browser;
let page;

const headless = true

describe('Google', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({headless});
    page = await browser.newPage();
  });

  it('screenshot of the request "ponominalu" must be saved', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const folder = './screenshots';
    const file = 'google-search-ponominalu.png';
    const url = 'https://google.com';
    const request = 'ponominalu';

    await page.goto(url);
    await page.type('input.gLFyf.gsfi', request);
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    if (fs.existsSync(`${folder}/${file}`)) {
      fs.unlink(`${folder}/${file}`, e => {});
    } else if (!fs.existsSync(`${folder}`)) {
      fs.mkdirSync(`${folder}`);
    }

    await page.screenshot({
        path: `${folder}/${file}`,
        fullPage: true
    })

    expect(fs.existsSync(`${folder}/${file}`)).toBe(true);
    
    await browser.close();
  });

  afterAll(async () => {
    await page.close();
    await browser.close();
  });
});