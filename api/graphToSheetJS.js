function graphToSheetJS(values) {
    const header = values[0];       // ["ID","NAME","DEPT"]
    const dataRows = values.slice(1);

    return dataRows.map(row => {
        let obj = {};
        header.forEach((key, i) => {
            obj[key] = row[i] !== undefined ? row[i] : null;
        });
        return obj;
    });
}
