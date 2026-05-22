const { axios, cheerio, STORES, HEADERS, parseAlbums, ok, err } = require('./_shared');

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

  const { store, q } = event.queryStringParameters || {};

  if (!store || !STORES[store])
    return err(400, `Loja inválida. Use: ${Object.keys(STORES).join(' ou ')}`);
  if (!q)
    return err(400, 'Parâmetro "q" é obrigatório.');

  try {
    const url = `https://${store}.x.yupoo.com/search/album?uid=1&sort=unix&q=${encodeURIComponent(q)}`;
    console.log('[SEARCH]', url);

    const { data } = await axios.get(url, {
      headers: { ...HEADERS, Referer: `https://${store}.x.yupoo.com/albums` },
      timeout: 15000,
    });

    const $      = cheerio.load(data);
    const albums = parseAlbums($, store);

    console.log(`[SEARCH] ${albums.length} álbuns`);
    return ok({ results: albums, total: albums.length, query: q, store });

  } catch (e) {
    console.error('[SEARCH ERROR]', e.message);
    return err(500, 'Erro ao buscar no Yupoo.', e.message);
  }
};
