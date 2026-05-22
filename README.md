# Dibraria — site

Catálogo ao vivo de camisas de futebol. Front-end estático + backend serverless no Netlify.

## Estrutura

```
index.html              ← front-end do catálogo
netlify.toml            ← config Netlify (redirects /api/* → functions)
package.json            ← dependências das functions (axios, cheerio)
netlify/
  functions/
    _shared.js          ← helpers compartilhados
    health.js           ← GET /api/health
    search.js           ← GET /api/search?store=&q=
    album.js            ← GET /api/album?store=&id=
    image.js            ← GET /api/image?url=
    category.js         ← GET /api/category?store=&id=&page=
    collection.js       ← GET /api/collection?store=&id=&page=
```

## Deploy no Netlify

1. Suba este repositório no GitHub
2. [app.netlify.com](https://app.netlify.com) → "Add new site" → "Import an existing project"
3. Conecte o GitHub e selecione este repositório
4. Build settings: deixe **tudo em branco**
5. Clique "Deploy site"
6. Anote a URL gerada (ex: `https://dibraria-br.netlify.app`)
7. No `index.html`, troque:
   ```js
   const API = 'https://dibraria-backend-production-0adf.up.railway.app';
   ```
   por:
   ```js
   const API = 'https://dibraria-br.netlify.app';
   ```
8. Faça commit e o Netlify faz o redeploy automático

## Domínio personalizado

Em Site settings → Domain management → Add custom domain → `dibraria.com.br`
