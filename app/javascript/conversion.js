import { getConversion }
    from "./api.js";



function applyConversion(
    value,
    convObj,
    fromUnit,
    toUnit
) {

    /* Exception Flow:
       Invalid number
    */

    if (
        typeof value !== "number" ||
        !Number.isFinite(value)
    ) {

        throw new Error(
            "Invalid number"
        );

    }

    /* Alternate Flow:
       Same unit
    */

    if (fromUnit === toUnit) {

        return parseFloat(
            value.toFixed(6)
        );

    }

    try {

        /* Main Flow:
           Factor conversion
        */

        if (
            convObj.factor !== null
        ) {

            return parseFloat(
                (
                    value *
                    convObj.factor
                ).toFixed(6)
            );

        }

        /* Formula conversion */

        else {

            const expr =
                convObj.formula
                    .replace(
                        "value",
                        value
                    );

            return parseFloat(
                eval(expr)
                    .toFixed(6)
            );

        }

    }

    catch (err) {

        /* Exception Flow:
           Bad formula
        */

        throw new Error(
            "Bad formula"
        );

    }

}

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

        const result =
            applyConversion(
                fromValue,
                conversion,
                fromUnit,
                toUnit
            );

        return {

            result,

            expression:
                `${fromValue} ${fromUnit} → ${toUnit}`

        };

    }

    catch (err) {

        console.error(
            "Conversion error:",
            err
        );

        throw err;

    }

}