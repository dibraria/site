const { axios, HEADERS } = require('./_shared');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  const { url } = event.queryStringParameters || {};

  if (!url)                       return { statusCode: 400, body: 'URL obrigatória' };
  if (!url.includes('yupoo.com')) return { statusCode: 403, body: 'Domínio não permitido' };

  try {
    const response = await axios.get(url, {
      headers: {
        ...HEADERS,
        Referer: 'https://www.yupoo.com/',
        Accept:  'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
      responseType: 'arraybuffer',
      timeout:      12000,
    });

    const ct = response.headers['content-type'] || 'image/jpeg';

    return {
      statusCode: 200,
      headers: {
        'Content-Type':  ct,
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      },
      body: Buffer.from(response.data).toString('base64'),
      isBase64Encoded: true,
    };

  } catch (e) {
    console.error('[IMAGE PROXY ERROR]', e.message);
    return { statusCode: 500, body: 'Erro ao carregar imagem' };
  }
};
