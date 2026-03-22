import { getConversion } from "./api.js";

/*
Business Logic Layer
Handles calculation
*/

export async function performConversion(
    fromValue,
    fromUnit,
    toUnit
) {
    try {

        const conversion =
            await getConversion(
                fromUnit,
                toUnit
            );

        let result;

        /* Factor-based conversion */

        if (conversion.factor !== null) {

            result =
                fromValue *
                conversion.factor;

        }

        /* Formula-based conversion (Temperature) */

        else {

            const formula =
                conversion.formula.replace(
                    "value",
                    fromValue
                );

            result = eval(formula);

        }

        /* Round result */

        return Number(
            result.toFixed(4)
        );

    } catch (err) {

        console.error(
            "Conversion error:",
            err
        );

        throw err;
    }
}