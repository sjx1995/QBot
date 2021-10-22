/*
 * @Description: 淘汰赛对阵图
 * @Author: Sunly
 * @Date: 2021-10-11 19:33:01
 */
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const Axios = require("axios");

const url = "https://www.dota2.com.cn/international/2021/rank?task=main_map";
const winnerLogoUrl =
  "https://liquipedia.net/commons/images/d/d6/TheInternationalSmall.png";
const winnerLogoName = "TheInternationalSmall";

const id2pose = {
  1: [280, 50, 200, 40],
  2: [280, 150, 200, 40],
  3: [280, 250, 200, 40],
  4: [280, 350, 200, 40],
  5: [680, 70, 200, 100],
  6: [680, 270, 200, 100],
  7: [1080, 120, 0, 200],
  8: [80, 470, 0, 40],
  9: [80, 570, 0, 40],
  10: [80, 670, 0, 40],
  11: [80, 770, 0, 40],
  12: [280, 450, 0, 40],
  13: [280, 550, 0, 40],
  14: [280, 650, 0, 40],
  15: [280, 750, 0, 40],
  16: [480, 470, 0, 100],
  17: [480, 670, 0, 100],
  18: [680, 480, 0, 40],
  19: [680, 680, 0, 40],
  20: [880, 500, 0, 200],
  21: [1080, 560, 0, 40],
  22: [1280, 220, 0, 360],
  23: [1480, 400],
};

if (!fs.existsSync(path.resolve(__dirname, "./logos"))) {
  fs.mkdirSync(path.resolve(__dirname, "./logos"));
}

const logos = fs
  .readdirSync(path.resolve(__dirname, "./logos"))
  .map((filename) => path.basename(filename, path.extname(filename)));

const cvsWidth = 1600;
const cvsHeight = 900;
const cvs = createCanvas(cvsWidth, cvsHeight);
const ctx = cvs.getContext("2d");
const grd = ctx.createLinearGradient(0, 0, cvsWidth, 0);
grd.addColorStop(0, "rgb(255,204,0)");
grd.addColorStop(1, "red");
ctx.strokeStyle = grd;

async function saveLogo(name, url) {
  if (!logos.includes(name)) {
    const logoCvs = createCanvas(40, 40);
    const logoCtx = logoCvs.getContext("2d");
    const logo = await loadImage(url);
    logoCtx.drawImage(logo, 0, 0, 40, 40);
    const dataUrl = logoCvs.toDataURL();
    const dataBuffer = new Buffer(
      dataUrl.replace("data:image/png;base64,", ""),
      "base64"
    );
    fs.writeFileSync(
      path.resolve(__dirname, "./logos", `${name}.png`),
      dataBuffer
    );
    logos.push(name);
  }
}

async function getLogo(name) {
  const imgData = await loadImage(
    path.resolve(__dirname, "./logos", `${name}.png`)
  );
  return imgData;
}

function drawTeams(id, name1, logo1, name2, logo2) {
  const [x, y, justify, vertical] = id2pose[id];
  if (id === 23) {
    ctx.drawImage(logo1, x, y, 40, 40);
  } else {
    ctx.drawImage(logo1, x, y, 40, 40);
    ctx.drawImage(logo2, x, y + vertical, 40, 40);
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(0,0,0,1)";
    let x1 = x + 50;
    let x2 = x + 150;
    let y1 = y + 20;
    let y2 = y + vertical + 20;
    let x3 = x2 + 40 + justify;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x2, (y1 + y2) / 2);
    ctx.moveTo(x1, y2);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2, (y1 + y2) / 2);
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.moveTo(x2, (y1 + y2) / 2);
    ctx.lineTo(x3, (y1 + y2) / 2);
    ctx.stroke();
  }
}

function generateMap() {
  return Axios.get(url).then(async ({ data }) => {
    const { result } = data;
    await main(result);
  });
}

async function main(data) {
  const bgImg = await loadImage(
    path.resolve(__dirname, "./assets", "background.png")
  );
  ctx.drawImage(bgImg, 0, 0, cvsWidth, cvsHeight);
  await saveLogo(winnerLogoName, winnerLogoUrl);
  let winName = "TBD";
  let winLogo = await getLogo(winnerLogoName);
  for (let i in data) {
    const { team1, team2 } = data[i];
    await saveLogo(team1.name, team1.logo);
    await saveLogo(team2.name, team2.logo);
    let logo1 = await getLogo(team1.name);
    const logo2 = await getLogo(team2.name);
    drawTeams(i, team1.name, logo1, team2.name, logo2);
    if (data[22].is_finish) {
      winName = [team1, team2].find(
        (team) => team.id === data[22].win_team_id
      ).name;
      winLogo = await getLogo(winName);
    }
  }
  // winner
  drawTeams(23, winName, winLogo);
  // save map
  const imgUrl = cvs.toDataURL();
  const dataBuffer = new Buffer(
    imgUrl.replace("data:image/png;base64,", ""),
    "base64"
  );
  fs.writeFileSync(
    path.resolve(__dirname, "./logos", `ti10-map.png`),
    dataBuffer
  );
}

module.exports = { generateMap };
