// Função de teste simples para verificar se o Netlify Functions está funcionando
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: JSON.stringify({
      message: 'API de teste funcionando!',
      timestamp: new Date().toISOString(),
      event: {
        httpMethod: event.httpMethod,
        path: event.path,
        queryStringParameters: event.queryStringParameters
      }
    })
  };
};
