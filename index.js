const express = require("express");
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const url = "https://www.amazon.in/Parle-g-Original-Glucose-Biscuit-800g/dp/B0118L9WXK/ref=sr_1_1_f3_0o_fs?crid=3EFXEKW1CR7U&keywords=parle+g&qid=1656885893&sprefix=parle+%2Caps%2C372&sr=8-1";

const ParleG = { name: "", price: "", link: "" };

const timeOut = setInterval(webScrapper, 5000);

async function webScrapper() {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const scrap = $('div#dp');

  // name 
  ParleG.name = $(scrap).find('h1 span#productTitle').text();

  // link
  ParleG.link = url;

  // price
  const priceIndex = $(scrap)
    .find('span .a-size-medium')
    .first()
    .text()
    .replace(/[₹,.]/g, "");

  const priceInt = parseInt(priceIndex);
  ParleG.price = priceInt;

  if (priceInt < 8000) {
    client.messages
      .create({
        body: `Hello Ekanshu, The price of ${ParleG.name} is now ${ParleG.price}.You can purchase it from ${ParleG.link}`,
        from: "+19854667798",
        to: process.env.RECEIVER_NUM,
      })
      .then((message) => {
        console.log(message);
        clearInterval(timeOut);
      });
    // .done();
  }





  // console.log($);
};

webScrapper();

app.listen(3000, () => {
  console.log("server is running on port 3000");
});