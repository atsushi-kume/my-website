//===========================================================
// 2次元配列 → Object配列
//===========================================================
export function toRecords(data, headers) {
    const records = [];
    for (let i = 0; i < data.length; i++) {
        const row = {};
        for (let j = 0; j < headers.length; j++) {
            row[headers[j]] = data[i][j];
        }
        records.push(row);
    }
    return records;
}

//===========================================================
// Object配列 → 2次元配列
//===========================================================
export function toRows(records, headers) {
    const rows = [];
    for (const record of records) {
        const row = [];
        for (const header of headers) {
            row.push(record[header]);
        }
        rows.push(row);
    }
    return rows;
}