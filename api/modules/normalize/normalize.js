import { detectType } from "./detectType.js";
import { jsonParser } from "./jsonParser.js";
import { csvParser } from "./csvParser.js";

export function normalize(data, options = {}) {

    const type =
        options.type ??
        detectType(data);

    switch(type){

        case "json":
            return jsonParser(data);

        case "csv":
            return csvParser(data);

    }
}