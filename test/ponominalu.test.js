const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
var fs = require('fs');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;

let browser;
let page;

const headless = false;

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
    const timeout = 3000000;
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

  // it('iphone X', async () => {
  //   const url = 'https://ponominalu.ru/';
  //   const timeout = 3000000;
  //   const selector_a_categories = 'a[class="pn-nav-bar__menu-link"]';
  //   const selector_a_concerts = 'a[href="/category/concerts"]';
  //   const selector_div_event_list = 'a[/href="/event/atl"]';
  //   const selector_a_event_card = 'a[class="pn-card__name pn-card__link"]';
  //   const selector_button_ticket= 'button[class="pn-event__afisha-btn pn-event__afisha-btn_red"]';
  //   const selector_div_pwn = 'div[class="widget-scheme"]';

  //   await page.emulate(devices['iPhone X']);
  //   await page.goto(url, {timeout});

  //   await page.waitForSelector(selector_a_categories);
  //   await page.$eval(selector_a_categories, el => el.click());
  //   await page.waitForSelector(selector_a_concerts);
  //   await page.$eval(selector_a_concerts, el => el.click());
  //   await page.waitForSelector(selector_div_event_list);
  //   await page.$eval(selector_div_event_list, el => {
  //     el.scrollIntoView();
  //   });
  //   await page.$eval(selector_div_event_list, el => el.click());
  //   await page.waitForSelector(selector_button_ticket);
  //   await page.$eval(selector_button_ticket, el => el.click());
  //   await page.waitForSelector(selector_div_pwn, {timeout});

  //   await page.screenshot({
  //       path: './screenshots/iphone-x-ticket.png',
  //       fullPage: true
  //   });
  // });

  afterAll(async () => {
    await page.close();
    await browser.close();
  });
});