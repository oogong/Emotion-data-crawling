const fs = require('fs');

// JSON 파일 경로
const inputFilePath = '../result/emotion.json'; // 입력 파일 경로
const outputFilePath = '../result/emotion.csv'; // 출력 파일 경로

function jsonToCsv(jsonData) {
    const rows = [];

    for (const [code, titles] of Object.entries(jsonData)) {
        titles.forEach(title => {
            rows.push(`${code},${title}`);
        });
    }

    return rows.join('\n');
}

async function main() {
    try {
        const jsonData = fs.readFileSync(inputFilePath, 'utf-8');
        const data = JSON.parse(jsonData);

        const csvData = jsonToCsv(data);

        fs.writeFileSync(outputFilePath, csvData, 'utf-8');
        console.log(`CSV file successfully written to ${outputFilePath}`);
    } catch (error) {
        console.error('Error processing JSON file:', error);
    }
}

main();