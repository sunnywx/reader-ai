import axios from 'axios'
import * as cheerio from 'cheerio'
import {HttpsProxyAgent} from 'https-proxy-agent'
import {parse} from 'node:url'

const searchProvidersConfig={
  libgen: {
    endpoint: 'https://libgen.is/search.php'
  },
  google: {
    endpoint: ''
  }
}

export default async function searchOnlineBooksRoutes(fast, options) {
  fast.get('/search-online-books/:q', {
    schema: {
      params: {
        q: { type: "string", description: "Search word" },
      },
      query: {
        provider: {type: 'string', description: 'Book provider: google/libgen', default: 'libgen'}
      },
      tags: ["online-book"],
    },
  }, async (req, reply)=> {
    const { provider = 'libgen' } = req.query;
    const {q}=req.params
  
    if (!q) {
      reply.code(400).send({ error: 'Search word is required' });
      return;
    }
  
    try {
      // todo: combine search first 5 pages results, sort by year
      if(provider === 'libgen'){
        // const searchUrl = `https://libgen.is/search.php?req=${encodeURIComponent(q)}&phrase=1&view=simple&column=def&sort=year&sortmode=DESC&page=1`;
        // console.log("🚀 ~ searchOnlineBooksRoutes ~ searchUrl:", searchUrl)

        // console.log('http proxy: ', process.env.HTTP_PROXY)
        // use url.parse to parse proxy url defined in env
        let proxy=null
        if(process.env.HTTP_PROXY_URL){
          const {protocol, hostname, port}=parse(process.env.HTTP_PROXY_URL)
          proxy = new HttpsProxyAgent({
            protocol: protocol,
            host: hostname,
            port
          });
        }
      
        const response = await axios.get(searchProvidersConfig[provider].endpoint, {
          timeout: 5000, // ms
          params: {
            'req': encodeURIComponent(q),
            'phrase': 1,
            'view': 'simple',
            'column': 'def',
            'sort': 'year',
            'sortmode': 'DESC',
            'page': '1'
          },
          httpsAgent: proxy,
        });
        const $ = cheerio.load(response.data);
    
        const books = [];
        $('table.c > tbody > tr:not(:first-child)').each((i, element) => {
          const $tds = $(element).find('td');
          const book = {
            id: $tds.eq(0).text().trim(),
            authors: $tds.eq(1).text().trim(),
            title: $tds.eq(2).find('a').text().trim(),
            publisher: $tds.eq(3).text().trim(),
            year: $tds.eq(4).text().trim(),
            pages: $tds.eq(5).text().trim(),
            language: $tds.eq(6).text().trim(),
            size: $tds.eq(7).text().trim(),
            extension: $tds.eq(8).text().trim(),
            download_url: $tds.eq(9).find('a').attr('href')
          };
          books.push(book);
        });

        // get total count, can't get paginator due to client side render
        // const total=$('.paginator').eq(1).find('table > tbody > tr:first-of-type').children().length
    
        return {books}
        // reply.send({ books });
      }

      if(provider === 'google'){

      }

      return {books: []}
      
    } catch (error) {
      console.error('Error searching:', error);
      reply.code(500).send({ error: 'An error occurred: '+ error.message });
    }
  })
}