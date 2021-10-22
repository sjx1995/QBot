/*
 * @Description: ti10
 * @Author: Sunly
 * @Date: 2021-10-22 19:02:46
 */
const Axios = require("axios");
const { dayjs } = require("../localTime");

const url = "https://www.dota2.com.cn/international2021/getMatchSchedule";

const timeMap = {
  7: "小组赛第一天",
  8: "小组赛第二天",
  9: "小组赛第三天",
  10: "小组赛第四天",
  12: "主赛事第一天",
  13: "主赛事第二天",
  14: "主赛事第三天",
  15: "主赛事第四天",
  16: "主赛事第五天",
  17: "决赛日",
};

let matchesData = {
  timestamp: 0,
  matches: [],
};

async function getMatches() {
  if (dayjs.tz().valueOf() - 1000 * 60 * 5 > matchesData.timestamp * 1000) {
    const { data } = await Axios.get(url);
    matchesData = data.result;
  }
  return matchesData;
}

async function getTodayMatches() {
  const today = dayjs.tz().date();
  if (isMatchDay(0)) {
    const { matches } = await getMatches();
    const time = dayjs.tz().set("hour", 7).valueOf();
    const todayMatches = matches.filter(
      (match) =>
        match.matchTime > time && match.matchTime < time + 24 * 60 * 60 * 1000
    );
    if (!todayMatches.length) {
      return "今天没有比赛 - - ||";
    }
    todayMatches.sort((a, b) => a.matchTime - b.matchTime);
    let message = "TI10 " + timeMap[today] + "赛程：\n";
    todayMatches.forEach((match) => {
      if (match.matchStatus === 3) {
        message += `${match.awayName} ${match.awayScore}:${match.homeScore} ${match.homeName}\n`;
      } else if (match.matchStatus === 2) {
        message += `${match.awayName} ${match.awayScore}:${match.homeScore} ${match.homeName} (进行中)\n`;
      } else {
        message += `${dayjs.tz(match.matchTime).format("HH:mm")} ${
          match.awayName
        } VS ${match.homeName} BO${match.box} \n`;
      }
    });
    return message;
  } else {
    return "今天没有比赛 - - ||";
  }
}

async function getYesterdayMatches() {
  const yesterday = dayjs.tz().date() - 1;
  if (isMatchDay(-1)) {
    const { matches } = await getMatches();
    const time = dayjs.tz().set("hour", 7).valueOf();
    const yesterdayMatches = matches.filter(
      (match) =>
        match.matchTime > time - 24 * 60 * 60 * 1000 && match.matchTime < time
    );
    if (!yesterdayMatches.length) {
      return "昨天没有比赛 - - ||";
    }
    yesterdayMatches.sort((a, b) => a.matchTime - b.matchTime);
    let message = "TI10 " + timeMap[yesterday] + "战报：\n";
    yesterdayMatches.forEach((match) => {
      message += `${match.awayName} ${match.awayScore}:${match.homeScore} ${match.homeName}\n`;
    });
    return message;
  } else {
    return "昨天没有比赛 - - ||";
  }
}

async function getTomorrowMatches() {
  const tomorrow = dayjs.tz().date() + 1;
  if (isMatchDay(1)) {
    const { matches } = await getMatches();
    const time = dayjs.tz().set("hour", 7).valueOf();
    const tomorrowMatches = matches.filter(
      (match) =>
        match.matchTime > time + 24 * 60 * 60 * 1000 &&
        match.matchTime < time + 24 * 60 * 60 * 1000 * 2
    );
    if (!tomorrowMatches.length) {
      return "明天没有比赛 - - ||";
    }
    tomorrowMatches.sort((a, b) => a.matchTime - b.matchTime);
    let message = "TI10 " + timeMap[tomorrow] + "赛程：\n";
    tomorrowMatches.forEach((match) => {
      message += `${dayjs.tz(match.matchTime).format("HH:mm")} ${
        match.awayName
      } VS ${match.homeName} BO${match.box} \n`;
    });
    return message;
  } else {
    return "明天没有比赛 - - ||";
  }
}

function isMatchDay(fix) {
  const year = dayjs.tz().year();
  const mon = dayjs.tz().month() + 1;
  const day = dayjs.tz().date() + fix;
  return (
    year === 2021 &&
    mon === 10 &&
    ((day >= 7 && day <= 10) || (day >= 12 && day <= 17))
  );
}

module.exports = {
  getTodayMatches,
  getTomorrowMatches,
  getYesterdayMatches,
};
