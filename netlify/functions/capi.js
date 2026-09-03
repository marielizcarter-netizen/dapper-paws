exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const data = JSON.parse(event.body);
  console.log('Token present:', !!process.env.REDDIT_CAPI_TOKEN, 'Length:', process.env.REDDIT_CAPI_TOKEN?.length);

  const response = await fetch(
    `https://ads-api.reddit.com/api/v3/pixels/${process.env.REDDIT_AD_ACCOUNT_ID}/conversion_events?test_id=t2_2m1qdv5mrr`,
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
            action_source: 'Website',
            type: {
              tracking_type: data.eventType
            },
            user: {
              ip_address: event.headers['x-forwarded-for'],
              user_agent: event.headers['user-agent']
            },
            metadata: {
              conversion_id: data.conversionId,
              currency: data.currency,
              value: data.value,
              item_count: data.itemCount
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
