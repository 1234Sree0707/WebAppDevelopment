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
export function compareValues(
    v1,
    u1,
    v2,
    u2,
    base1,
    base2
) {

    /* Exception Flow:
       Invalid numbers
    */

    if (
        isNaN(v1) ||
        isNaN(v2) ||
        isNaN(base1) ||
        isNaN(base2)
    ) {

        return
            "Invalid values — cannot compare";

    }

    /* Alternate Flow:
       Same units
    */

    if (u1 === u2) {

        if (v1 > v2) {

            return
                `${v1} ${u1} is GREATER than ${v2} ${u2}`;

        }

        if (v1 < v2) {

            return
                `${v1} ${u1} is LESS than ${v2} ${u2}`;

        }

        return
            `${v1} ${u1} is EQUAL to ${v2} ${u2}`;

    }

    /* Main Flow:
       Compare base values
    */

    if (base1 > base2) {

        return
            `${v1} ${u1} is GREATER than ${v2} ${u2}`;

    }

    if (base1 < base2) {

        return
            `${v1} ${u1} is LESS than ${v2} ${u2}`;

    }

    return
        `${v1} ${u1} is EQUAL to ${v2} ${u2}`;

}