/*
 * @Description: 读取ti决赛结果
 * @Author: Sunly
 * @Date: 2021-10-16 23:59:19
 */
const Axios = require("axios");

const url = "https://www.dota2.com.cn/international2021/getMatchSchedule";

let lgdScore = 0;
let secretScore = 0;
let isSend = false;

let matchesData = [];

async function getWinner() {
  const { data } = await Axios.get(url);
  const { matches } = data.result;
  matchesData = matches[matches.length - 1];
  if (matchesData.matchStatus !== 1) {
    if (matchesData.awayScore === 0 && matchesData.homeScore === 0) {
      if (!isSend) {
        isSend = true;
        return `TI10决赛正式开始：\nPSG.LGD VS ${matchesData.awayName}`;
      } else {
        return false;
      }
    }
    if (
      matchesData.awayScore !== secretScore ||
      matchesData.homeScore !== lgdScore
    ) {
      secretScore = matchesData.awayScore;
      lgdScore = matchesData.homeScore;
      if (secretScore === 3) {
        return `恭喜${matchesData.awayName} 获得冠军，wuwuwu`;
      }
      if (lgdScore === 3) {
        return `恭喜萧瑟圆梦TI成功举盾！\nLGD！咚咚咚！`;
      }
      return `第${secretScore + lgdScore}场比赛结束：
PSG.LGD ${lgdScore}:${secretScore} ${matchesData.awayName}`;
    }
  }
  return false;
}

module.exports = { getWinner };
