export const CheckMinimumLength = (string, minimumLength) => {
    return string.length > minimumLength;
}

export const SeeAlert = (ALERT_SPAN, INPUT) => {
    ALERT_SPAN.classList.remove("not-visible");
    ALERT_SPAN.classList.add("visible");
    INPUT.classList.remove("normal");
    INPUT.classList.add("null-alert");
}

export const HideAlert = (ALERT_SPAN, INPUT) => {
    ALERT_SPAN.classList.remove("visible");
    ALERT_SPAN.classList.add("not-visible");
    INPUT.classList.remove("null-alert");
    INPUT.classList.add("normal");
}