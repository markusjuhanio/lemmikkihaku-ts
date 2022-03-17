/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import fs from 'fs';
import axios from 'axios';

console.log('Generating sitemap...');

const start = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

let content = `
<url> <loc>https://www.lemmikkihaku.fi/</loc> </url>
`;

const end = `
</urlset>
`;

const generate = async () => {
  try {
    const response = await axios.get('https://lemmikkihaku-api-v2.herokuapp.com/api/listings/activated');
    response.data.forEach((listing) => {
      content += `<url> <loc>https://www.lemmikkihaku.fi/ilmoitus/${listing.id}</loc> </url>
`;
    });
    fs.writeFileSync('./public/sitemap.xml', start + content + end);
    console.log('Sitemap generated succesfully');
  } catch (error) {
    console.log('Error generating sitemap:', error);
  }
};

await generate();
