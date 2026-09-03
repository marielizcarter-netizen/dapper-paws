exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const data = JSON.parse(event.body);

  const response = await fetch(
    `https://ads-api.reddit.com/api/v3/pixels/${process.env.REDDIT_AD_ACCOUNT_ID}/conversion_events`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REDDIT_CAPI_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          events: [{
            event_at: Date.now(),
            action_source: 'SERVER',
            type: {
              tracking_type: data.eventType
            }
          }]
        }
      })
    }
  );

  const result = await response.json();
  console.log('Reddit CAPI response:', result);

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true, reddit: result })
  };
};
