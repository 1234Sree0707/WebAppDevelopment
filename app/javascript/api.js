/*
API Layer
Handles communication with json-server
Use Case: UC-JS-04
*/

const BASE_URL = "http://localhost:3000";

/*
Fetch Conversion Record
Returns:
{ from, to, factor, formula }
*/

export async function getConversion(from, to) {
    try {

        /* Alternate Flow:
           Same unit selected
        */

        if (from.toLowerCase() === to.toLowerCase()) {
            return {
                from: from,
                to: to,
                factor: 1,
                formula: "Same unit"
            };
        }

        /* Main Flow */

        const res = await fetch(
            `${BASE_URL}/conversions?from=${from}&to=${to}`
        );

        if (!res.ok) {
            throw new Error(
                "Server error while fetching conversion"
            );
        }

        const data = await res.json();

        /* Exception Flow */

        if (!data.length) {
            throw new Error(
                "Conversion not available for this pair"
            );
        }

        return data[0];

    } catch (err) {

        console.error(
            "getConversion error:",
            err
        );

        throw err;
    }
}