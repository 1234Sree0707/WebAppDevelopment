document.addEventListener("DOMContentLoaded", async () => {
    try {
        const state = {
            type: "Length",
            action: "Conversion",
            fromVal: null,
            fromUnit: "",
            toVal: null,
            toUnit: "",
            operator: "+"
        };

        attachEventListeners(state);

        try {
            await loadUnits(state.type);
        } catch (err) {
            showErrorBanner("Failed to load units.");
        }

        setActiveTypeCard(0);
        setActiveActionButton(0);

        toggleOperators(false);

        try {
            await loadHistory();
        } catch (err) {
            showErrorBanner("Failed to load history.");
        }

    } catch (err) {
        if (err instanceof TypeError) {
            showErrorBanner("Server unavailable");
        } else {
            console.error("Unexpected error during initialisation:", err);
        }
    }
});
