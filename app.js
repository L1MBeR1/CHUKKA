const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.type('html').send(html));

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <link rel="stylesheet" href="/Styles/MainStyles.css">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CHUKKA</title>
</head>
<body>
  <header>
    <div class="header-block">
      <div class="logo-block"><p class="logo">chukka</p></div>
      <div class="categories-block">
        <div class="categories"><p>Man</p></div>
        <div class="categories"><p>Women</p></div>
        <div class="categories"><p>Kids</p></div>
        <div class="categories"><p>Sale</p></div>
        <div class="categories"><p>New</p></div>
      </div>
      <div class="func-btn">
        <img src="icons/lens.png">
        <img src="icons/profile.png">
        <img src="icons/bag.png">
      </div>
    </div>
    <div class="header-info">
      
    </div>
    <div class="scroll-block"><img src="icons/scroll-wheel.png"></div>
  </header>
  <div class="new-sale-block">

  </div>
  <div class="types-block">
    <div class="types-block-item"></div>
    <div class="types-block-item"></div>
    <div class="types-block-item"></div>
  </div>
  <div class="about-block">
    <div class="ab-photo"></div>
    <div class="ab-info"></div>
  </div>
  
  <div class="footer-preview">
    <p>chukka</p>
  </div>
  <footer>

  </footer>
</body>
</html>
`
