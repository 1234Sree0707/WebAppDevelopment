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

function attachEventListeners(state) {

    const fromInput =
        document.getElementById(
            "fromValue"
        );

    const toInput =
        document.getElementById(
            "toValue"
        );

    const fromSelect =
        document.querySelector(
            ".converter-box:first-child select"
        );

    const toSelect =
        document.querySelector(
            ".converter-box:last-child select"
        );

    /* ---------------- INPUT / SELECT EVENTS ---------------- */

    if (fromInput) {

        fromInput.addEventListener(
            "input",
            () => handleConversion(state)
        );

    }

    if (fromSelect) {

        fromSelect.addEventListener(
            "change",
            () => handleConversion(state)
        );

    }

    if (toSelect) {

        toSelect.addEventListener(
            "change",
            () => handleConversion(state)
        );

    }

    /* ---------------- UC-JS-15 TYPE CARD CLICK ---------------- */

    const typeSelector =
        document.querySelector(
            ".card-grid"
        );

    if (typeSelector) {

        typeSelector
            .querySelectorAll(
                ".type-card"
            )
            .forEach(card => {

                card.addEventListener(
                    "click",
                    async () => {

                        try {

                            /* Step 2 — Update state */

                            state.type =
                                card.dataset.type;

                            /* Step 3 — Highlight */

                            setActive(
                                typeSelector,
                                card,
                                ".type-card"
                            );

                            /* Step 4 — Reset inputs */

                            if (fromInput)
                                fromInput.value = "";

                            if (toInput)
                                toInput.value = "";

                            showResult(
                                0,
                                ""
                            );

                            /* Step 5 — Load units */

                            const units =
                                await getUnits(
                                    state.type
                                );

                            /* Step 6 — Populate dropdowns */

                            populateDropdown(
                                fromSelect,
                                units
                            );

                            populateDropdown(
                                toSelect,
                                units
                            );

                            /* Step 8 — Reset state units */

                            state.fromUnit = "";
                            state.toUnit = "";

                        }

                        catch (err) {

                            console.error(
                                "Failed to load units:",
                                err
                            );

                            showErrorBanner(
                                "Failed to load units"
                            );

                        }

                    }

                );

            });

    }

    /* ---------------- ACTION TABS ---------------- */

    const actionBar =
        document.querySelector(
            ".action-bar"
        );

    if (actionBar) {

        actionBar
            .querySelectorAll(
                ".tab-btn"
            )
            .forEach(btn => {

                btn.addEventListener(
                    "click",
                    () => {

                        state.action =
                            btn.innerText.trim();

                        setActive(
                            actionBar,
                            btn,
                            ".tab-btn"
                        );

                        toggleOperators(
                            state.action ===
                            "Arithmetic"
                        );

                    }

                );

            });

    }
    const actionSelector =
    document.querySelector(
        ".action-bar"
    );

if (actionSelector) {

    actionSelector
        .querySelectorAll(
            ".action-btn"
        )
        .forEach(btn => {

            btn.addEventListener(
                "click",
                () => {

                    state.action =
                        btn.dataset.action;

                    setActive(
                        actionSelector,
                        btn,
                        ".action-btn"
                    );

                    toggleOperators(
                        state.action ===
                        "Arithmetic"
                    );

                    showResult(
                        0,
                        ""
                    );

                }

            );

        });

}

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

        showResult(
    conversion.result,
    toUnit
);

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

    try {

        const records =
            await getHistory();

        renderHistory(
            records
        );

    }

    catch (err) {

        console.error(
            "Failed to load history:",
            err
        );

        renderHistory([]);

    }

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

import { getUnits }
    from "./api.js";

async function loadUnits(
    type
) {

    try {

        const units =
            await getUnits(type);

        const fromSelect =
            document.querySelector(
                ".converter-box:first-child select"
            );

        const toSelect =
            document.querySelector(
                ".converter-box:last-child select"
            );

        populateDropdown(
            fromSelect,
            units
        );

        populateDropdown(
            toSelect,
            units
        );

    }

    catch (err) {

        console.error(
            "Failed to load units:",
            err
        );

    }

}


function populateDropdown(
    selectEl,
    units
) {

 

    if (!selectEl) {

        console.warn(
            "populateDropdown: select element not found"
        );

        return;

    }

   

    selectEl.innerHTML = "";

 

    const defaultOption =
        document.createElement(
            "option"
        );

    defaultOption.value = "";

    defaultOption.textContent =
        "-- Select Unit --";

    defaultOption.disabled =
        true;

    defaultOption.selected =
        true;

    selectEl.appendChild(
        defaultOption
    );

 

    if (
        !units ||
        units.length === 0
    ) {

        return;

    }

 

    units.forEach(u => {

        const opt =
            document.createElement(
                "option"
            );

        opt.value =
            u.symbol;

        opt.textContent =
            `${u.label} (${u.symbol})`;

        selectEl.appendChild(
            opt );

    });

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

    const operatorRow =
        document.querySelector(
            "#operator-selector"
        );

    /* Exception Flow:
       element missing
    */

    if (!operatorRow) {

        console.warn(
            "Operator selector not found"
        );

        return;

    }

    /* Main Flow */

    operatorRow.style.display =
        show
            ? "flex"
            : "none";

}


function setActive(
    parentEl,
    clickedEl,
    childSelector
) {

    /* Exception Flow:
       parent element missing
    */

    if (!parentEl) {
        return;
    }

    /* Remove active from all siblings */

    parentEl
        .querySelectorAll(
            childSelector
        )
        .forEach(el => {
            el.classList.remove(
                "active"
            );
        });

    /* Add active to clicked */

    clickedEl
        .classList.add(
            "active"
        );

}
function renderHistory(records) {

   

    if (!records) {
        records = [];
    }

    const list =
        document.querySelector(
            "#history-list"
        );

    if (!list) {
        console.warn(
            "History list element not found"
        );
        return;
    }

   

    list.innerHTML = "";


    if (!records.length) {

        list.innerHTML =
            "<li>No history yet.</li>";

        return;

    }

   

    records.forEach(r => {

        const li =
            document.createElement(
                "li"
            );

        li.textContent =
            `${r.expression}  =  ${r.result}  (${new Date(
                r.timestamp
            ).toLocaleString()})`;

        list.appendChild(li);

    });

}

function showErrorBanner(
    message
) {

    alert(
        message
    );

}


function showResult(
    value,
    unitSymbol
) {

    const valueEl =
        document.querySelector(
            "#result-value"
        );

    const unitEl =
        document.querySelector(
            "#result-unit"
        );


    if (!valueEl || !unitEl) {
        console.warn(
            "Result elements not found"
        );
        return;
    }


    if (value === null ||
        value === undefined) {

        valueEl.textContent = "—";
        unitEl.textContent = "";

        return;
    }


    valueEl.textContent =
        value;

    unitEl.textContent =
        unitSymbol || "";


    valueEl
        .classList
        .add("highlight");

    setTimeout(
        () => {

            valueEl
                .classList
                .remove(
                    "highlight"
                );

        },
        1500
    );

}