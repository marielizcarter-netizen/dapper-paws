exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const data = JSON.parse(event.body);
  console.log('Received event:', data);

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };
};
