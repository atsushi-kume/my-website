//===========================================================
// データ形式判定
//===========================================================
export function getFormat(data) {

    // null / undefined
    if (data == null) {
        return "unknown";
    }

    //=======================================================
    // 配列
    //=======================================================
    if (Array.isArray(data)) {

        // 空配列
        if (data.length === 0) {
            return "rows";
        }

        const first = data[0];

        // 2次元配列
        if (Array.isArray(first)) {
            return "rows";
        }

        // Object配列
        if (
            typeof first === "object" &&
            first !== null
        ) {
            return "records";
        }

        // 1次元配列
        return "array";
    }

    //=======================================================
    // Object
    //=======================================================
    if (
        typeof data === "object" &&
        data !== null
    ) {

        // Map
        if (data instanceof Map) {
            return "map";
        }

        // Set
        if (data instanceof Set) {
            return "set";
        }

        // Object
        return "object";
    }

    //=======================================================
    // 文字列
    //=======================================================
    if (typeof data === "string") {
        return "string";
    }

    return typeof data;

}