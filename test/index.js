// (async () => {
//   const request = require("request");
//   const requestPromise = require("request-promise");
//   const cheerio = require("cheerio");
//   const download = require("image-downloader");
//   const URL = "https://www.cbre-propertysearch.jp/industrial/tokyo/?q=東京都";

//   requestPromise(encodeURI(URL), async function (error, response, body) {
//     if (error) {
//       console.error(error);
//       return;
//     }

//     let $ = cheerio.load(body);

//     // Lấy link của các page
//     let totalPage = +$(
//       "#contents > div > div.propertyList > div > div.tools.bottom > div > ul > li:last-child > a"
//     ).text();
//     let listPage = [];
//     for (let i = 1; i <= totalPage; i++) {
//       listPage.push(
//         `https://www.cbre-propertysearch.jp/industrial/tokyo/?q=東京都&page=${i}`
//       );
//     }
//     // Đã lấy được listPage
//     // console.log(listPage);

//     // Lặp từng page lấy ra link của các warehouse
//     let listLink = [];
//     let promiseArray = listLink.map(async(url)=>{
//       const options = {
//         method:'get',
//         uri:url
//       }
//       let data = await requestPromise(options); 
//       let $ = cheerio.load(body);

//           // Lấy tất cả link của các warehouse trong 1 trang
//       let warehouses = $("div.itemGroup div.item h2.name a");
//       warehouses = [...warehouses];

//       let links = warehouses.map(function (item) {
//         return $(item).attr("href");
//       });
//       console.log(links); 
//       return link
//     })
//     await Promise.all(promiseArray);
//     // await requestPromise(listPage.forEach((page, index) => {
//     // Promise.all(
//     //   listPage.map(async (page) => {
//     //     await request(encodeURI(page), function (error, response, body) {
//     //       if (error) {
//     //         console.error(error);
//     //         return;
//     //       }

//     //       let $ = cheerio.load(body);

//     //       // Lấy tất cả link của các warehouse trong 1 trang
//     //       let warehouses = $("div.itemGroup div.item h2.name a");
//     //       warehouses = [...warehouses];

//     //       let links = warehouses.map(function (item) {
//     //         return $(item).attr("href");
//     //       });
//     //     console.log(links);
//     //       listLink.push(links);
//     //     });
//     //   })
//     // );
//   });
// })();
  const request = require("request");
  const requestPromise = require("request-promise");
  const cheerio = require("cheerio");
  const download = require("image-downloader");
  const URL = "https://www.cbre-propertysearch.jp/industrial/tokyo/?q=東京都";
  const getData = async ()=>{
    let options ={
      method:'get',
      uri:encodeURI(URL)
    }
    let data = await requestPromise(options);
    let $ = cheerio.load(data);
    // console.log(data);
        let totalPage = +$(
      "#contents > div > div.propertyList > div > div.tools.bottom > div > ul > li:last-child > a"
    ).text();
    
    let listPage = [];
    for (let i = 1; i <= totalPage; i++) {
      listPage.push(
        `https://www.cbre-propertysearch.jp/industrial/tokyo/?q=東京都&page=${i}`
      );
    }
    // console.log(listPage);
    let listPromise = listPage.map((item)=>getLinkFromUrl(item));
    let result = await Promise.all(listPromise);
    let resutLink= [].concat(...result); 
    console.log(resutLink);
    console.log(resutLink.length)
    
  }
const getLinkFromUrl = async(url)=>{
  let options = {
    method:'get',
    uri:encodeURI(url)
  }
  let data = await requestPromise(options);
  let $ = cheerio.load(data);
  // Lấy tất cả link của các warehouse trong 1 trang
  let warehouses = $("div.itemGroup div.item h2.name a");
  warehouses = [...warehouses];
  let links = warehouses.map(function (item) {
    return $(item).attr("href");
  });
  return links ;
}
getData();
