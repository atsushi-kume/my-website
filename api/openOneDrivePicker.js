<script src="https://js.live.net/v7.2/OneDrive.js"></script>

<script>
function openOneDrivePicker() {
    var odOptions = {
        clientId: "YOUR_CLIENT_ID",   // ← Azure ADで取得
        action: "query",
        multiSelect: false,
        advanced: {
            filter: "folder,.xlsx,.xls"
        },
        success: function(response) {
            const file = response.value[0];
            const fileId = file.id;

            // 取得した fileId を使って Graph API を自動実行
            loadExcelFromGraph(fileId);
        },
        cancel: function() {
            console.log("User canceled picker.");
        },
        error: function(e) {
            console.error(e);
        }
    };
    OneDrive.open(odOptions);
}

async function loadExcelFromGraph(fileId) {
    const token = document.getElementById("accessToken").value;

    const url = `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/workbook/worksheets/Sheet1/usedRange`;

    const res = await fetch(url, {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();

    if (!data.values) {
        alert("Excel のデータを取得できませんでした");
        return;
    }

    const matrix = data.values;
    const json = toSheetJSJson(matrix);
    runCommonLogic(json);
}
</script>