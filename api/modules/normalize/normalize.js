export function normalize(data, type = null){

    const dataType = type || detectType(data);

    switch(dataType){

        case "json":
            return jsonParser(data);

        case "csv":
            return csvParser(data);

        case "fixed":
            return fixedParser(data);

        case "array":
            return arrayParser(data);

        default:
            throw new Error("未対応形式");
    }
}