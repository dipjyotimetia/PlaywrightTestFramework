/* eslint-disable */
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const fs = require("fs");

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
      console.log(
        chalk.yellow('response url:'),
        url,
        chalk.bgGreen('status:'),
        chalk.green(status)
      );
    } else {
      console.log(
        chalk.red('response url:'),
        url,
        chalk.bgRed('status:'),
        chalk.red(status)
      );
    }

    if (url === mainUrl) {
      mainUrlStatus = status;
    }
  });

  await page.goto(mainUrl);
  console.log('status for main url:', mainUrlStatus);
  await browser.close();
}

const testLinks = async (site) => {
  const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setUserAgent(USER_AGENT);
  await page.goto(site);

  let links = await page.evaluate(() => {
    let nodes = document.querySelectorAll('a');
    let linkArray = [];
    nodes.forEach(element => {
      if (!element.href.includes('#') && element.href.includes('https://beteasy.com.au')) {
        linkArray.push(element.href);
      }
    });
    return linkArray;
  });

  console.log(`Total links${links.length}`);

  fs.writeFile("browserLinks.json", JSON.stringify(links), (err) => {
    if (err) throw err;
    console.log("Saved!");
  });

  for (let i = 0; i < links.length; i++) {
    console.log(`url:${links[i]}`);
    let resp = await page.goto(links[i]);
    if (resp.status() !== 200 && resp.status() === null) {
      console.log(`An Error occured URL is ${resp.url()}`);
    }
  }
  await page.close();
  await browser.close();
}

testLinks('https://uat.betdev.com.au');
run('https://beteasy.com.au');
run('https://uat.betdev.com.au/racing-betting');
run('https://uat.betdev.com.au/sports-betting');
