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
    const selector_input = 'input.gLFyf.gsfi';

    await page.goto(url);
    await page.type(selector_input, request);
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
    const selector_a = 'a[href="/afisha"]';
    const selector_title = 'title';
    const timeout = 3000000
    const viewport = {
      width: 1280,
      height: 720
    };

    await page.setViewport(viewport);
    await page.goto(url, {timeout});

    await page.waitForSelector(selector_title);
    let title1 = await page.evaluate(el => el.innerText, await page.$(selector_title));
    console.log(`title ponominalu.ru: ${title1}`);

    await page.waitForSelector(selector_a);
    await page.$eval(selector_a, el => el.click());
    
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    let title2 = await page.evaluate(el => el.innerText, await page.$(selector_title));
    console.log(`title ponominalu.ru/afisha: ${title2}`);

    expect(title1 !== title2).toBe(true);
  });

  afterAll(async () => {
    await page.close();
    await browser.close();
  });
});