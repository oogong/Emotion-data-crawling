const axios = require('axios');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const fs = require('fs');

// JSON 파일 경로
const inputFilePath = '../result/name.json'; // 입력 파일 경로
const outputFilePath = '../result/emotion.json'; // 출력 파일 경로

async function fetchBoardTitles(code, startPage, endPage) {
    const titles = [];
    for (let page = startPage; page <= endPage; page++) {
        const url = `https://finance.naver.com/item/board.naver?code=${code}&page=${page}`;
        try {
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15'
                }
            });

            const decodedData = iconv.decode(response.data, 'euc-kr');
            const $ = cheerio.load(decodedData);

            $('a[title]').each((index, element) => {
                const title = $(element).attr('title');
                if (title) {
                    titles.push(title);
                }
            });
        } catch (error) {
            console.error(`Error fetching data for code ${code}, page ${page}:`, error);
        }
    }
    return titles;
}

async function main() {
    try {
        const jsonData = fs.readFileSync(inputFilePath, 'utf-8');
        const stockList = JSON.parse(jsonData);

        const allTitles = {};

        for (const stock of stockList) {
            const code = stock.Code;
            console.log(`Fetching titles for ${code}...`);
            const titles = await fetchBoardTitles(code, 1, 1);
            if (titles.length > 0) {
                allTitles[code] = titles;
            }
        }

        fs.writeFileSync(outputFilePath, JSON.stringify(allTitles, null, 2), 'utf-8');
        console.log(`Titles successfully written to ${outputFilePath}`);
    } catch (error) {
        console.error('Error processing JSON file:', error);
    }
}

main();