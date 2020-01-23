const puppeteer = require('puppeteer');
var fs = require('fs');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;

let browser;
let page;

const headless = true;

describe('Ponominalu.ru', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({headless});
    page = await browser.newPage();
  });

  it('screenshot of the request "ponominalu" must be saved', async () => {
    
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
  });

  it('compair main and afisha titles', async () => {
    const url = 'https://ponominalu.ru/';

    await page.setViewport({
      width: 1280,
      height: 720
    });
    
    await page.goto(url, {timeout: 3000000});

    await page.waitForSelector('title');
    let title1 = await page.evaluate(el => el.innerHTML, await page.$('title'));
    console.log(`title ponominalu.ru: ${title1}`);

    await page.waitForSelector('a[href="/afisha"]');
    await page.$eval('a[href="/afisha"]', el => el.click());
    
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    let title2 = await page.evaluate(el => el.innerHTML, await page.$('title'));
    console.log(`title ponominalu.ru/afisha: ${title2}`);

    expect(title1 !== title2).toBe(true);
  });

  afterAll(async () => {
    await page.close();
    await browser.close();
  });
});