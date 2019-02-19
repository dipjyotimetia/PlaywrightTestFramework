const puppeteer = require('puppeteer');
const chalk = require('chalk');

async function run(site) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const mainUrl = site;

  let mainUrlStatus;

  await page.setRequestInterception(true);

  page.on('request', request => {
    const url = request.url();
    console.log(chalk.blue('request url:'), url);
    request.continue();
  });

  page.on('requestfailed', request => {
    const url = request.url();
    console.log(chalk.bgRed('request failed url:'), url);
  });

  page.on('response', response => {
    const request = response.request();
    const url = request.url();
    const status = response.status();
    if (status.toString() === '200') {
      console.log(chalk.yellow('response url:'), url, chalk.bgGreen('status:'), chalk.green(status));
    } else {
      console.log(chalk.red('response url:'), url, chalk.bgRed('status:'), chalk.red(status));
    }

    if (url === mainUrl) {
      mainUrlStatus = status;
    }
  });

  await page.goto(mainUrl);
  console.log('status for main url:', mainUrlStatus);
  await browser.close();
}

run('https://beteasy.com.au/rewards');
run('https://beteasy.com.au/rewards');
run('https://beteasy.com.au/multi-express');
run('https://beteasy.com.au/live-in-play-betting');
run('https://beteasy.com.au/sports-betting');
run('https://beteasy.com.au/racing-betting');
run('https://beteasy.com.au/');