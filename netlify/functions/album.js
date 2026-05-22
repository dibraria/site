const { axios, cheerio, STORES, HEADERS, ok, err } = require('./_shared');

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

  const { store, id } = event.queryStringParameters || {};

  if (!store || !STORES[store]) return err(400, 'Loja inválida.');
  if (!id)                       return err(400, 'Parâmetro "id" é obrigatório.');

  try {
    const url = `https://${store}.x.yupoo.com/albums/${id}?uid=1`;
    console.log('[ALBUM]', url);

    const { data } = await axios.get(url, {
      headers: { ...HEADERS, Referer: `https://${store}.x.yupoo.com/albums` },
      timeout: 15000,
    });

    const $ = cheerio.load(data);

    const title = (
      $('h1').first().text() ||
      $('[class*="album__title"],[class*="albumTitle"]').first().text() ||
      `Álbum ${id}`
    ).trim().replace(/\s*\d+\s*$/, '');

    const hashSeen = new Set();
    const photos   = [];

    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || '';
      if (!src.includes('photo.yupoo.com')) return;

      const hashMatch = src.match(/photo\.yupoo\.com\/[^/]+\/([a-f0-9]+)\//);
      if (!hashMatch) return;

      const hash = hashMatch[1];
      if (hashSeen.has(hash)) return;
      hashSeen.add(hash);

      photos.push(
        src
          .replace('/small.', '/medium.')
          .replace('/thumb.', '/medium.')
          .replace('/large.', '/medium.')
      );
    });

    console.log(`[ALBUM] ${photos.length} fotos`);
    return ok({ id, title, photos, total: photos.length, albumUrl: url });

  } catch (e) {
    console.error('[ALBUM ERROR]', e.message);
    return err(500, 'Erro ao carregar o álbum.', e.message);
  }
};
