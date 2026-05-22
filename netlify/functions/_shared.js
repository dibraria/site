const axios   = require('axios');
const cheerio = require('cheerio');

const STORES = { 'royal-sports': true, 'minkang': true };

const HEADERS = {
  'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection':      'keep-alive',
  'Cache-Control':   'no-cache',
};

function parseAlbums($, store) {
  const albums = [];
  const seen   = new Set();

  $('a[href*="/albums/"]').each((_, el) => {
    const href       = $(el).attr('href') || '';
    const albumMatch = href.match(/\/albums\/(\d+)/);
    if (!albumMatch) return;

    const albumId = albumMatch[1];
    if (seen.has(albumId)) return;

    const img = $(el).find('img');
    let coverSrc =
      img.filter('[src*="medium"]').first().attr('src') ||
      img.filter('[src*="small"]').first().attr('src')  ||
      img.first().attr('src')                           ||
      img.first().attr('data-src')                      || '';

    if (!coverSrc.includes('photo.yupoo.com')) return;
    coverSrc = coverSrc
      .replace('/small.', '/medium.')
      .replace('/thumb.', '/medium.');

    const title = (
      $(el).attr('title') ||
      $(el).find('[class*="title"],[class*="name"]').first().text() ||
      $(el).text().split('\n')[0] ||
      `Álbum ${albumId}`
    ).trim().replace(/\s*\d+\s*$/, '');

    const nums       = $(el).text().match(/\b(\d+)\b/g);
    const photoCount = nums ? Math.max(...nums.map(Number)) : null;

    seen.add(albumId);
    albums.push({
      id: albumId,
      title,
      cover:      coverSrc,
      photoCount,
      albumUrl:   `https://${store}.x.yupoo.com/albums/${albumId}?uid=1`,
      store,
    });
  });

  return albums;
}

function ok(body) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body),
  };
}

function err(statusCode, message, detail) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ error: message, detail }),
  };
}

module.exports = { axios, cheerio, STORES, HEADERS, parseAlbums, ok, err };
