//-----------------------------------------------------------
// Excel → SheetJS形式JSON に統一する共通変換ロジック
//-----------------------------------------------------------
function toSheetJSJson(matrix, headerRequired = false) {

    // headerRequired = false の場合
    // 1行目が実データ → 自動ヘッダ生成 col1, col2, col3...
    let headers = [];

    if (headerRequired) {
        headers = matrix[0];
        matrix = matrix.slice(1); // データ部のみ
    } else {
        const colCount = matrix[0].length;
        for (let i = 0; i < colCount; i++) {
            headers.push("col" + (i + 1));
        }
    }

    const result = matrix.map(row => {
        let obj = {};
        headers.forEach((h, i) => obj[h] = row[i] ?? null);
        return obj;
    });

    return result;
}

//-----------------------------------------------------------
// ローカルPCの Excel を読み込む
//-----------------------------------------------------------
document.getElementById("fileInput")
    .addEventListener("change", async e => {

        const file = e.target.files[0];
        const data = await file.arrayBuffer();

        // SheetJSでWorkbookを読み込む
        const wb = XLSX.read(data);
        const ws = wb.Sheets[wb.SheetNames[0]];

        // SheetJSのJSON形式を使う
        const json = XLSX.utils.sheet_to_json(ws, { defval: null });

        runCommonLogic(json);
    });


//-----------------------------------------------------------
// OneDrive（Graph API）からExcelを取得
//-----------------------------------------------------------
document.getElementById("loadGraphBtn")
    .addEventListener("click", async () => {

        const url = document.getElementById("onedriveUrl").value;
        const token = document.getElementById("accessToken").value;

        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();

        if (!data.values) {
            alert("Graph API の結果に values がありません。URL を確認してください。");
            return;
        }

        const matrix = data.values;

        // Graph API は 2次元配列なので共通変換に投げる
        const json = toSheetJSJson(matrix, false);

        runCommonLogic(json);
    });


//-----------------------------------------------------------
// 通常のロジック（ここをあなたの処理に置き換える）
//-----------------------------------------------------------
function runCommonLogic(json) {

    // 動作確認用。実際のロジックをここで記述
    document.getElementById("output").textContent =
        JSON.stringify(json, null, 2);

    // ここで後続処理を行う
    // 例）
    // json.forEach(row => {
    //     console.log("col1:", row.col1);
    // });
}
