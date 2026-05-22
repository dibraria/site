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

  const { store, id, page = '1' } = event.queryStringParameters || {};

  if (!store || !STORES[store]) return err(400, 'Loja inválida.');
  if (!id)                       return err(400, 'Parâmetro "id" é obrigatório.');

  try {
    const url = `https://${store}.x.yupoo.com/categories/${id}?uid=1&page=${page}`;
    console.log('[CATEGORY]', url);

    const { data } = await axios.get(url, {
      headers: { ...HEADERS, Referer: `https://${store}.x.yupoo.com/albums` },
      timeout: 15000,
    });

    const $      = cheerio.load(data);
    const albums = parseAlbums($, store);

    console.log(`[CATEGORY] ${albums.length} álbuns`);
    return ok({ results: albums, total: albums.length, categoryId: id, store });

  } catch (e) {
    console.error('[CATEGORY ERROR]', e.message);
    return err(500, 'Erro ao carregar categoria.', e.message);
  }
};
