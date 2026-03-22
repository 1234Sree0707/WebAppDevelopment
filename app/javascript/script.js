import { performConversion }
    from "./conversion.js";

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try {

            const state = {
                type: "Length",
                action: "Conversion",
                operator: "+"
            };

            attachEventListeners(state);

            await loadUnits(state.type);

            setActiveTypeCard(0);
            setActiveActionButton(0);

            toggleOperators(false);

            await loadHistory();

        }

        catch (err) {

            if (err instanceof TypeError) {

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

function attachEventListeners(state) {

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
        () => handleConversion(state)
    );

    fromSelect.addEventListener(
        "change",
        () => handleConversion(state)
    );

    toSelect.addEventListener(
        "change",
        () => handleConversion(state)
    );

}

/* ---------------- CONVERSION HANDLER ---------------- */

async function handleConversion(state) {

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

        if (!fromValue) return;

        const result =
            await performConversion(
                Number(fromValue),
                fromUnit,
                toUnit
            );

        document.getElementById(
            "toValue"
        ).value = result;

    }

    catch (err) {

        showErrorBanner(
            err.message
        );

    }

}

/* ---------------- PLACEHOLDER FUNCTIONS ---------------- */

async function loadUnits(type) {
    console.log(
        "Loading units for:",
        type
    );
}

async function loadHistory() {
    console.log(
        "Loading history"
    );
}

function setActiveTypeCard(index) {
    console.log(
        "Active type:",
        index
    );
}

function setActiveActionButton(index) {
    console.log(
        "Active action:",
        index
    );
}

function toggleOperators(show) {
    console.log(
        "Toggle operators:",
        show
    );
}

function showErrorBanner(message) {
    alert(message);
}