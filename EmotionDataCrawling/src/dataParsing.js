const fs = require('fs');
const csv = require('csv-parser');
const iconv = require('iconv-lite');

function extractStockDataToJson(filePath, outputJsonPath) {
    const results = [];

    fs.createReadStream(filePath)
        .pipe(iconv.decodeStream('euc-kr'))  // 인코딩을 euc-kr로 설정
        .pipe(csv())
        .on('data', (data) => {
            // CSV 파일의 컬럼 이름이 '단축코드'와 '한글 종목명'이라고 가정합니다.
            const code = data['단축코드'];
            const name = data['한글 종목명'];

            // 필요한 데이터만 추출하여 결과 배열에 추가
            if (code && name) {
                results.push({ Code: code, Name: name });
            }
        })
        .on('end', () => {
            // 모든 데이터가 처리된 후 결과를 JSON 파일로 저장
            fs.writeFile(outputJsonPath, JSON.stringify(results, null, 2), (err) => {
                if (err) {
                    console.error('Error writing JSON file:', err);
                } else {
                    console.log(`Data successfully written to ${outputJsonPath}`);
                }
            });
        })
        .on('error', (error) => {
            console.error('Error reading CSV file:', error);
        });
}

// 예시로 사용할 CSV 파일 경로와 출력할 JSON 파일 경로
const filePath = '../financeData.csv';
const outputJsonPath = '../result/name.json';

// 함수 호출
extractStockDataToJson(filePath, outputJsonPath);