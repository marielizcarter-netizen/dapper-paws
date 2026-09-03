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
      },
      body: JSON.stringify({
        data: {
          events: [{
            test_id: 't2_2m1qdv5mrr',
            event_at: Date.now(),
            action_source: 'SERVER',
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
