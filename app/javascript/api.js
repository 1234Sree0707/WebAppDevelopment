/*
API Layer
Handles communication with json-server
Use Case: UC-JS-04
Use Case: UC-JS-05
*/

const BASE_URL =
    "http://localhost:3000";

/*
Fetch Conversion Record
Returns:
{ from, to, factor, formula }
*/

export async function getConversion(
    from,
    to
) {
    try {

        /* Alternate Flow:
           Same unit selected
        */

        if (
            from.toLowerCase() ===
            to.toLowerCase()
        ) {
            return {
                from: from,
                to: to,
                factor: 1,
                formula:
                    "Same unit"
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

        const data =
            await res.json();

        /* Exception Flow */

        if (!data.length) {
            throw new Error(
                "Conversion not available for this pair"
            );
        }

        return data[0];

    }

    catch (err) {

        console.error(
            "getConversion error:",
            err
        );

        throw err;

    }
}

/*
Save Calculation Record to History
Use Case: UC-JS-05
POST /history
*/

export async function saveHistory(
    record
) {
    try {

        const res = await fetch(
            `${BASE_URL}/history`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        record
                    )
            }
        );

        if (!res.ok) {
            throw new Error(
                "Failed to save history"
            );
        }

        return await res.json();

    }

    catch (err) {

        console.error(
            "History save error:",
            err
        );

        /* Non-critical
           Do NOT block user */

    }
}


export async function getHistory() {
    try {

        const res = await fetch(
            `${BASE_URL}/history?_sort=timestamp&_order=desc`
        );

        if (!res.ok) {
            throw new Error(
                "Failed to load history"
            );
        }

        return await res.json();

    }

    catch (err) {

        console.error(
            "History load error:",
            err
        );

      

        return [];

    }
}
/*
Fetch Units by Type
GET /units?type=length
*/

export async function getUnits(
    type
) {

    try {

        const res = await fetch(
            `${BASE_URL}/units?type=${type}`
        );

        if (!res.ok) {

            throw new Error(
                "Failed to fetch units"
            );

        }

        return await res.json();

    }

    catch (err) {

        console.error(
            "getUnits error:",
            err
        );

        return [];

    }

}