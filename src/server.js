/*
 * @Description: qq机器人
 * @Author: Sunly
 * @Date: 2021-09-16 20:19:55
 */
const {
  account,
  password,
  test_receiveGroupNumber,
} = require("../qqAccount.config");
const { dayjs } = require("./localTime");
const path = require("path");
const { createClient, segment } = require("oicq");
const client = createClient(account);

const { kaoYanTimeout } = require("./timeout");

const {
  getTodayMatches,
  getTomorrowMatches,
  getYesterdayMatches,
} = require("./ti10");
const { generateMap } = require("./ti10/generateMap");

kaoYanTimeout(test_receiveGroupNumber);

//监听上线事件
client.on("system.online", () => console.log("Logged in!"));

// 登录，回车登录
client
  .on("system.login.slider", function (event) {
    process.stdin.once("data", (input) => {
      this.sliderLogin(input);
    });
  })
  .on("system.login.device", function (event) {
    process.stdin.once("data", () => {
      this.login();
    });
  })
  .login(password);

// 监听群消息
client.on("message.group", (data) => {
  const { group_id, raw_message, message, reply, sender, message_id, atme } =
    data;
  const { user_id } = sender;
  console.log(data, sender);
  if (atme) {
    const {
      data: { text },
    } = message.find((msg) => msg.type === "text");
    if (text.indexOf("爸爸") >= 0) {
      reply(Math.random() > 0.5 ? "什么事？我的好大儿" : "找你爹干**呢");
    } else if (text.indexOf("今日赛程") >= 0) {
      getTodayMatches().then((message) => {
        reply(message);
      });
    } else if (text.indexOf("昨日赛程") >= 0) {
      getYesterdayMatches().then((message) => {
        reply(message);
      });
    } else if (text.indexOf("明日赛程") >= 0) {
      getTomorrowMatches().then((message) => {
        reply(message);
      });
    } else if (text.indexOf("淘汰赛") >= 0) {
      generateMap().then(() => {
        const imgPath = path.resolve(__dirname, "./logos", "ti10-map.png");
        const ImgCtx = segment.image(imgPath);
        reply(ImgCtx);
      });
    } else {
      reply(
        `你可以输入：
【今日赛程】查看TI10今天的比赛
【明日赛程】查看TI10明天的比赛
【昨日赛程】查看TI10昨天的比赛结果
【淘汰赛】查看TI10淘汰赛对阵图
【爸爸】进行一个爹的认`
      );
    }
  }
});
