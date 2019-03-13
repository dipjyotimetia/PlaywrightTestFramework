/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();
  await client.send('Network.enable');
  await client.send('Network.clearBrowserCache');
  await page.goto('https://beteasy.com.au', {
    timeout: 50000,
  });
  const performance = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  );
  console.log(
    `Time to interactive${performance.domInteractive}` -
      performance.navigationStart
  );
  await browser.close();
})();

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.emulate(devices.iPhone6);
  await page.goto('https://betaesy.com.au', {
    timeout: 50000,
  });
  await page.screenshot({ path: 'iphone6.png' });

  await page.emulate(devices['Nexus 6P']);
  await page.goto('https://betaesy.com.au', {
    timeout: 50000,
  });
  await page.screenshot({ path: 'nexus.png' });

  await browser.close();
})();

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://betaesy.com.au');
  await page.screenshot({ path: 'es.png' });

  await browser.close();
})();

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://betaesy.com.au');
  await page.pdf({ path: 'es.pdf', type: ' A4 ' });

  await browser.close();
})();

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');

  const dimensions = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    deviceScaleFactor: window.devicePixelRatio,
  }));

  console.log('Dimensions:', dimensions);

  await browser.close();
})();

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage(),
  ]);

  await page.goto('https://google.com.au', {
    timeout: 0,
  });

  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);

  let totalBytes = 0;
  let usedBytes = 0;
  const coverage = [...jsCoverage, ...cssCoverage];
  for (const entry of coverage) {
    totalBytes += entry.text.length;
    for (const range of entry.ranges) {
      usedBytes += range.end - range.start - 1;
    }
  }
  console.log(`Bytes used: ${(usedBytes / totalBytes) * 100}%`);

  await page.close();
})();

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.tracing.start({ path: 'trace.json' });
  await page.goto('https://beteasy.com.au', {
    waitUntil: 'networkidle',
  });
  await page.tracing.stop();
  browser.close();
})();

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://beteasy.com.au', {
    waitUntil: 'networkidle2',
  });

  const pageLinks = await page.$$eval('a', links => {
    links = links
      .filter(a => {
        if (a.href) {
          const sameOrigin =
            new URL(location).origin === new URL(a.href).origin;
          const samePage = a.href === location.href;
          return !samePage && sameOrigin;
        }
      })
      .map(a => a.href);
    return Array.from(new Set(links));
  });

  console.log(pageLinks);
  browser.close();
})();

(async () => {
  const responses = {
    get_saved_posts: {
      status: 200,
      // Body has to be a string
      body: JSON.stringify({
        data: {
          posts: ['post1', 'post2'],
        },
      }),
    },
  };

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://beteasy.com.au', {
    waitUntil: 'networkidle2',
  });

  page.on('request', interceptedRequest => {
    const endpoint = interceptedRequest.url.split('/').pop();
    if (responses[endpoint]) {
      request.respond(responses[endpoint]);
    } else {
      request.continue();
    }
  });
  browser.close();
})();
