exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  if (!BOT_TOKEN || !CHAT_ID) return { statusCode: 500, body: 'Not configured' };

  let payload;
  try { payload = JSON.parse(event.body); } catch { return { statusCode: 400, body: 'Bad JSON' }; }

  let text = (payload.title || 'New Form') + '\n------------------------\n';
  const data = payload.data || {};
  
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null || v === '') continue;
    text += k + ': ' + v + '\n';
  }

  try {
    const res = await fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: text })
    });
    const result = await res.json();
    return { statusCode: result.ok ? 200 : 502, body: JSON.stringify(result) };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
