const request = require("request");
const { JSDOM } = require("jsdom");

const fs = require("fs");

function render(html) {
  return new JSDOM(html);
}

const data = [];
function getData(page) {
  request.get(
    `https://members-fmff.net/?page=${page}`,
    { json: false },
    (err, res, body) => {
      if (err) {
        console.log("ERR - " + err.message);
      } else {
        const { document } = render(body).window;
        if (document) {
          const aa = document.getElementsByClassName("card");

          for (let i = 0; i < aa.length; i++) {
            const companyInfo = aa[i].children[0];
            const contactInfo = aa[i].children[1];

            if (companyInfo.children.length === 1) {
              continue;
            }

            data.push({
              company: {
                name: companyInfo.children[0].textContent,
                address: companyInfo.children[1].textContent,
                tel: companyInfo.children[2].textContent.replace("Tel: ", ""),
                email: companyInfo.children[3].textContent.replace(
                  "Email: ",
                  ""
                ),
                website: companyInfo.children[4].textContent.replace(
                  "Website: ",
                  ""
                )
              },
              contact: {
                name: contactInfo.children[1].textContent,
                email: contactInfo.children[2].textContent.replace(
                  "Email: ",
                  ""
                ),
                tel: contactInfo.children[3].textContent.replace("Tel: ", "")
              }
            });
          }

          fs.writeFileSync("./data.json", JSON.stringify(data, null, "\t"));
        }
      }
    }
  );
}

[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(item => {
  getData(item);
});

// '.card:first-chi .content:'

// function renderWeb(url) {
//   const dom = new JSDOM(``, {
//     url: url,
//     referrer: "https://members-fmff.net/?page=150",
//     contentType: "text/html",
//     includeNodeLocations: true,
//     storageQuota: 10000000
//   });

//   const aa = dom.window.document.querySelector("title");
//   console.log(aa, dom.window.document.body.children.length);
// }

// renderWeb("https://members-fmff.net/?page=146");
