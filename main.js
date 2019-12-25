const { RTMClient } = require('@slack/client');
require('dotenv').config();
const token = process.env.SLACK_TOKEN_NEKO_CHAN;
const rtm = new RTMClient(token);
rtm.start();

rtm.on('ready', async () => {
  const conversationId = 'CDVRMQA8M';
  const message = postSlackCountDownMessage();
  await rtm.sendMessage(message, conversationId);
});

/**
 * 給料日までの日数を伝えるメッセージを返す
 */
function postSlackCountDownMessage() {
  const PAYDAY_DEFAULT = 25;
  const NOT_PAYDAY_WEEKNUMBER = [0,6]; // 土,日
  const now = new Date();
  const dateFormat = require('dateformat');
  let today = dateFormat(now, "japaneseMediumDate");
  let message = "今日は" + today + "……";
  
  // 次の給料日を調べる
  var next_paymentday = new Date(now.getFullYear(), now.getMonth(), PAYDAY_DEFAULT, 0, 0);
  var next_paymentweeknumber = next_paymentday.getDay();
  if (next_paymentday < now) {
    next_paymentday = new Date(now.getFullYear(), now.getMonth() + 1, PAYDAY_DEFAULT, 0, 0);
    next_paymentweeknumber = next_paymentday.getDay();
  }
  
  var e = NOT_PAYDAY_WEEKNUMBER.indexOf(next_paymentweeknumber);
  if (e != -1) {
    // 給料日が土日の場合は,手前の金曜日が給料日
    var weeknumber = NOT_PAYDAY_WEEKNUMBER[e]
    var reverse = weeknumber == 0 ? -2 : -1;
    next_paymentday = new Date(next_paymentday.getFullYear(), next_paymentday.getMonth(), next_paymentday.getDate() + reverse, 0, 0);
  }
  
  var moredays = next_paymentday.getDate() - now.getDate();
  
  next_paymentday = dateFormat(next_paymentday, "japaneseMediumDate");
  
  message += "次の給料日は" + next_paymentday + "です。";

  if (moredays == 0) {
    message += "今日は給料日！！！　さ、お金おろしにいこ？";
  } else if (moredays == 1) {
    message += "明日だぞ！！！！！！うおおおおおおおおおお！！！！！！！";
  } else if (moredays <= 3) {
    message += "あと" + moredays + "日 もうちょっと！！！";
  } else if (3 < moredays && moredays < 11) {
    message += "あと" + moredays + "日だね";
  } else if (11 <= moredays) {
    message += "あと" + moredays + "日も先だよ…… :neko:";
  }
 
  return message;
}
