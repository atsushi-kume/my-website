//===========================================================
// JSON → table要素生成
//===========================================================
export function createJsonTable(json) {

    // 配列化
    const data = Array.isArray(json)
        ? json
        : [json];

    // table生成
    const table = document.createElement("table");

    // データなし
    if (data.length === 0) {

        const tr = document.createElement("tr");
        const td = document.createElement("td");

        td.textContent = "データなし";

        tr.appendChild(td);
        table.appendChild(tr);

        return table;
    }

    //=======================================================
    // ヘッダ取得
    //=======================================================
    const headers = [
        ...new Set(
            data.flatMap(row => Object.keys(row))
        )
    ];

    //=======================================================
    // thead
    //=======================================================
    const thead = document.createElement("thead");

    const headerRow =
        document.createElement("tr");

    headers.forEach(header => {

        const th =
            document.createElement("th");

        th.textContent = header;

        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);

    table.appendChild(thead);

    //=======================================================
    // tbody
    //=======================================================
    const tbody =
        document.createElement("tbody");

    data.forEach(row => {

        const tr =
            document.createElement("tr");

        headers.forEach(header => {

            const td =
                document.createElement("td");

            const value = row[header];

            if (
                value === undefined ||
                value === null
            ) {

                td.textContent = "";

            } else if (
                typeof value === "object"
            ) {

                td.textContent =
                    JSON.stringify(value);

            } else {

                td.textContent = value;
            }

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    return table;
}