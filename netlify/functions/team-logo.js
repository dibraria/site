const axios = require('axios');

// IDs dos times/seleções no Sofascore
const TEAM_IDS = {
  // Seleções
  'brasil':    4,
  'brazil':    4,
  'argentina': 6,
  'portugal':  788,
  'espanha':   9,
  'spain':     9,
  'alemanha':  11,
  'germany':   11,
  'franca':    2960,
  'france':    2960,
  'italia':    10,
  'italy':     10,
  'belgica':   1065,
  'belgium':   1065,
  'holanda':   1,
  'netherlands': 1,
  'mexico':    174,
  'japao':     785,
  'japan':     785,
  'escocia':   22,
  'scotland':  22,
  'senegal':   2782,
  'croatia':   23,
  'croacia':   23,
  'england':   3,
  'inglaterra': 3,
  'uruguay':   7,
  'colombia':  1187,
  'estados-unidos': 155,
  'usa':       155,
};

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=2592000',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const slug = (event.queryStringParameters?.slug || '').toLowerCase().trim();
  const id   = TEAM_IDS[slug];

  if (!id) {
    return { statusCode: 404, headers: corsHeaders, body: 'Team not found' };
  }

  try {
    const response = await axios.get(
      `https://api.sofascore.app/api/v1/team/${id}/image`,
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
    console.error('team-logo error:', err.message);
    return { statusCode: 502, headers: corsHeaders, body: 'Failed to fetch logo' };
  }
};
