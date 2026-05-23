const axios = require('axios');

// Mapa de slugs conhecidos → IDs do Sofascore
const LEAGUE_IDS = {
  'premier-league': 17,
  'premier':        17,
  'la-liga':        8,
  'laliga':         8,
  'bundesliga':     35,
  'serie-a':        23,
  'seriea':         23,
  'ligue-1':        34,
  'ligue1':         34,
  'brasileirao':    325,
  'brasileirao-serie-a': 325,
  'copa-do-mundo':  16,
  'world-cup':      16,
  'champions-league': 7,
  'ucl':            7,
  'europa-league':  679,
  'libertadores':   384,
};

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=2592000', // 30 dias
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const slug = (event.queryStringParameters?.slug || '').toLowerCase().trim();
  const id   = LEAGUE_IDS[slug];

  if (!id) {
    return { statusCode: 404, headers: corsHeaders, body: 'League not found' };
  }

  try {
    const response = await axios.get(
      `https://api.sofascore.app/api/v1/unique-tournament/${id}/image`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer':    'https://www.sofascore.com/',
          'Origin':     'https://www.sofascore.com',
        },
        responseType: 'arraybuffer',
        timeout: 8000,
      }
    );

    const ct = response.headers['content-type'] || 'image/png';
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': ct },
      body: Buffer.from(response.data).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error('league-logo error:', err.message);
    return { statusCode: 502, headers: corsHeaders, body: 'Failed to fetch logo' };
  }
};
