import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';
const jabamaDomain: string = (process.env.JABAMA_URL)!.toString()
const roomFinder = async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(jabamaDomain);
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "temp.png" });

  const html = await page.content();
  const $ = cheerio.load(html);
  const firstRoomCard = $("div.plp-items > a");

  if (firstRoomCard) {
    const allRoomsCount = $("div.plp-items").children().nextAll('.product-card').length + 1 
    // tslint:disable-next-line: no-console
    console.log({
      availableRoomsCount: allRoomsCount,
      firstRoomUrl: `https://www.jabama.com${firstRoomCard.attr("href")}`,
      allRoomsLink: jabamaDomain,
    });
  }else{
      // tslint:disable-next-line: no-console
      console.log("not found");
  }
};

setInterval(() => {
    roomFinder();
}, 60 * 1000 * 2);
