const { google } = require('googleapis');

exports.handler = async function () {
  const sheetId = '10_EJkkKe5XeiLJ1Iq-MWIYZNNC3EEOz2NxcHnXtS0yE';
  const sheets = google.sheets({ version: 'v4' });

  const apiKey = process.env.GOOGLE_API_KEY;

  const ranges = ['鯖ルール!A2:C', '判例説明!A2:C'];

  const results = [];

  try {
    for (let range of ranges) {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: range,
        key: apiKey,
      });

      const values = res.data.values || [];

      values.forEach(row => {
        results.push({
          sheet: range.split('!')[0],
          管理ID: row[0] || '',
          タイトル: row[1] || '',
          内容: row[2] || '',
        });
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'データ取得に失敗しました。' }),
    };
  }
};
