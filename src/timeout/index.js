/*
 * @Description: 考研倒计时
 * @Author: Sunly
 * @Date: 2021-10-22 19:03:51
 */
const cron = require("node-cron");
const { dayjs } = require("../localTime");

const kaoYanTimeout = (groupNumber) => {
  cron.schedule(
    "00 00 07 * * *",
    () => {
      const end = dayjs.tz("2021-12-25 23:59:59");
      const start = dayjs().tz("Asia/Shanghai");
      const days = ~~((end - start) / 1000 / 3600 / 24);
      if (days > 0) {
        client.sendGroupMsg(groupNumber, `距考研还有${days}天！加油！！！`);
      } else if (days === 0) {
        client.sendGroupMsg(
          groupNumber,
          `从容面对！沉着冷静！全力以赴！加油冲鸭！`
        );
      }
      if (dayjs.tz().isSame("2021-10-01", "day")) {
        client.sendGroupMsg(groupNumber, "祝大火国庆快乐:)");
      }
      if (dayjs.tz().isSame("2021-10-05", "day")) {
        client.sendGroupMsg(
          groupNumber,
          "今天开始考研报名了，https://yz.chsi.com.cn/yzwb/"
        );
      }
      if (dayjs.tz().isSame("2021-12-18", "day")) {
        client.sendGroupMsg(groupNumber, "别忘记下载准考证哦~");
      }
    },
    {
      timezone: "Asia/Shanghai",
    }
  );
};

module.exports = { kaoYanTimeout };
