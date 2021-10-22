/*
 * @Description: 本地时间
 * @Author: Sunly
 * @Date: 2021-10-22 19:04:09
 */
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const isBetween = require("dayjs/plugin/isBetween");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.tz.setDefault("Asia/Shanghai");

module.exports = { dayjs };
