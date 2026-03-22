import { performConversion }
    from "./conversion.js";

import {
    saveHistory,
    getHistory
} from "./api.js";
import { performArithmetic 

}from "./conversion.js";




/* ---------------- INITIALISATION ---------------- */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try {

            const state = {

                type: "Length",

                action: "Conversion",

                operator: "+"

            };

            attachEventListeners(
                state
            );

            await loadUnits(
                state.type
            );

            setActiveTypeCard(
                0
            );

            setActiveActionButton(
                1
            );

            toggleOperators(
                false
            );

            /* Load history on page load */

            await loadHistory();

        }

        catch (err) {

            if (
                err instanceof TypeError
            ) {

                showErrorBanner(
                    "Server unavailable"
                );

            }

            else {

                console.error(
                    "Unexpected error:",
                    err
                );

            }

        }

    }
);

/* ---------------- EVENT LISTENERS ---------------- */

function attachEventListeners(
    state
) {

    const fromInput =
        document.getElementById(
            "fromValue"
        );

    const fromSelect =
        document.querySelector(
            ".converter-box:first-child select"
        );

    const toSelect =
        document.querySelector(
            ".converter-box:last-child select"
        );

    fromInput.addEventListener(
        "input",
        () =>
            handleConversion(
                state
            )
    );

    fromSelect.addEventListener(
        "change",
        () =>
            handleConversion(
                state
            )
    );

    toSelect.addEventListener(
        "change",
        () =>
            handleConversion(
                state
            )
    );

}

/* ---------------- CONVERSION HANDLER ---------------- */

async function handleConversion(
    state
) {

    try {

        const fromValue =
            document.getElementById(
                "fromValue"
            ).value;

        const fromUnit =
            document.querySelector(
                ".converter-box:first-child select"
            ).value;

        const toUnit =
            document.querySelector(
                ".converter-box:last-child select"
            ).value;

        if (!fromValue)
            return;

        const conversion =
            await performConversion(
                Number(fromValue),
                fromUnit,
                toUnit
            );

        document.getElementById(
            "toValue"
        ).value =
            conversion.result;

        /* ---------------- SAVE HISTORY ---------------- */

        const record = {

            type:
                state.type,

            action:
                state.action,

            expression:
                conversion.expression,

            result:
                conversion.result,

            timestamp:
                new Date()
                    .toISOString()

        };

        /* Non-critical save */

        await saveHistory(
            record
        );

        /* Refresh history */

        await loadHistory();

    }

    catch (err) {

        showErrorBanner(
            err.message
        );

    }

}

/* ---------------- LOAD HISTORY ---------------- */

async function loadHistory() {

    const history =
        await getHistory();

    displayHistory(
        history
    );

}

/* ---------------- DISPLAY HISTORY ---------------- */

function displayHistory(
    history
) {

    let historyContainer =
        document.getElementById(
            "historyContainer"
        );

    /* Create container if missing */

    if (!historyContainer) {

        historyContainer =
            document.createElement(
                "div"
            );

        historyContainer.id =
            "historyContainer";

        historyContainer.style.marginTop =
            "30px";

        document
            .querySelector(
                ".main-content"
            )
            .appendChild(
                historyContainer
            );

    }

    historyContainer.innerHTML =
        "<h2>History</h2>";

    /* No records */

    if (!history.length) {

        historyContainer.innerHTML +=
            "<p>No history yet.</p>";

        return;

    }

    /* Render records */

    history.forEach(
        record => {

            const item =
                document.createElement(
                    "div"
                );

            item.style.padding =
                "10px";

            item.style.marginBottom =
                "8px";

            item.style.background =
                "#ffffff";

            item.style.borderRadius =
                "8px";

            item.style.boxShadow =
                "0 2px 6px rgba(0,0,0,0.1)";

            item.innerText =
                `${record.expression} = ${record.result}`;

            historyContainer.appendChild(
                item
            );

        }
    );

}

/* ---------------- PLACEHOLDER FUNCTIONS ---------------- */

async function loadUnits(
    type
) {

    console.log(
        "Loading units for:",
        type
    );

}

function setActiveTypeCard(
    index
) {

    console.log(
        "Active type:",
        index
    );

}

function setActiveActionButton(
    index
) {

    console.log(
        "Active action:",
        index
    );

}

function toggleOperators(
    show
) {

    console.log(
        "Toggle operators:",
        show
    );

}

function showErrorBanner(
    message
) {

    alert(
        message
    );

}