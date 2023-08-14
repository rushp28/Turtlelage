import { CheckMinimumLength } from "./common.js";
import { SeeAlert } from "./common.js";
import { HideAlert } from "./common.js";

const TICKET = JSON.parse(localStorage.getItem('ticket'));

const CARD_NUMBER_INPUT = document.getElementById("card-number-input");
const CARD_NUMBER_ALERT_SPAN = document.getElementById("card-number-alert");
const EXPIRY_DATE_INPUT = document.getElementById("expiry-date-input");
const EXPIRY_DATE_ALERT_SPAN = document.getElementById("expiry-date-alert");
const CVC_CVV_INPUT = document.getElementById("cvc-cvv-input");
const CVC_CVV_ALERT_SPAN = document.getElementById("cvc-cvv-alert");
const NAME_ON_CARD_INPUT = document.getElementById("name-on-card-input");
const NAME_ON_CARD_ALERT_SPAN = document.getElementById("name-on-card-alert");
const CONFIRM_BUTTON_SPAN = document.getElementById("confirm-button");

//! go to details page
const GoToConfirmationPage = () => {
    window.location.href = "confirmation.html";
    
    //! summary table
    localStorage.setItem('summary_table', document.querySelector(".summary-table-section").innerHTML);
}

const AddConfirmButtonClickEvent = () => {
    CONFIRM_BUTTON_SPAN.addEventListener("click", GoToConfirmationPage);
}

const RemoveConfirmButtonClickEvent = () => {
    CONFIRM_BUTTON_SPAN.removeEventListener("click", GoToConfirmationPage);
}

//! locks and unlocks confirm button
const LockAndUnlockConfirmButton = () => {
    const IS_CARD_NUMBER_VALIDATED = CARD_NUMBER_ALERT_SPAN.classList.contains("not-visible") && CARD_NUMBER_INPUT.value ? true : false;
    const IS_EXPIRY_DATE_VALIDATED = EXPIRY_DATE_ALERT_SPAN.classList.contains("not-visible") && EXPIRY_DATE_INPUT.value ? true : false;
    const IS_CVC_CVV_VALIDATED = CVC_CVV_ALERT_SPAN.classList.contains("not-visible") && CVC_CVV_INPUT.value ? true : false;
    const IS_NAME_ON_CARD_VALIDATED = NAME_ON_CARD_ALERT_SPAN.classList.contains("not-visible") && NAME_ON_CARD_INPUT.value ? true : false;
    if (IS_CARD_NUMBER_VALIDATED && IS_EXPIRY_DATE_VALIDATED && IS_CVC_CVV_VALIDATED && IS_NAME_ON_CARD_VALIDATED) {
        CONFIRM_BUTTON_SPAN.classList.remove("locked");
        CONFIRM_BUTTON_SPAN.classList.add("unlocked");
        AddConfirmButtonClickEvent();
    }
    else {
        CONFIRM_BUTTON_SPAN.classList.remove("unlocked");
        CONFIRM_BUTTON_SPAN.classList.add("locked");
        RemoveConfirmButtonClickEvent();
    }
}

const AddCardNumberInputInputEvent = () => {
    CARD_NUMBER_INPUT.addEventListener("input", (event) => {
        const CARD_NUMBER = event.target.value;
        if (!event.target.value) {
            console.log("y");
        } 
        else {
            const FORMATTED_CARD_NUMBER = event.target.value.replaceAll(" ", "");
    
            if (event.target.value.length > 14) {
                event.target.value = FORMATTED_CARD_NUMBER.replace(/(\d{4})(\d{4})(\d{4})(\d{0,4})/, "$1 $2 $3 $4");
            } else if (event.target.value.length > 9) {
                event.target.value = FORMATTED_CARD_NUMBER.replace(/(\d{4})(\d{4})(\d{0,4})/, "$1 $2 $3");
            } else if (event.target.value.length > 4) {
                event.target.value = FORMATTED_CARD_NUMBER.replace(/(\d{4})(\d{0,4})/, "$1 $2");
            }
        }

        if (!CARD_NUMBER || !CheckMinimumLength(CARD_NUMBER, 18)) {
            CARD_NUMBER_ALERT_SPAN.textContent = "Please enter your Card Number";
            SeeAlert(CARD_NUMBER_ALERT_SPAN, CARD_NUMBER_INPUT);
        }
        else {
            HideAlert(CARD_NUMBER_ALERT_SPAN, CARD_NUMBER_INPUT);
        }
        LockAndUnlockConfirmButton();
    });
}


const AddExpiryDateInputInputEvent = () => {
    EXPIRY_DATE_INPUT.addEventListener("input", (event) => {
        const EXPIRY_DATE = event.target.value;
        if (!event.target.value) {
            console.log("y");
        } else {
            const FORMATTED_EXPIRY_DATE = event.target.value.replace("/", "");
    
            if (event.target.value.length > 2) {
                event.target.value = FORMATTED_EXPIRY_DATE.replace(/^(\d{2})(\d{0,2})/, "$1/$2");
            }
        }

        if (!EXPIRY_DATE || !CheckMinimumLength(EXPIRY_DATE, 4)) {
            EXPIRY_DATE_ALERT_SPAN.textContent = "Please enter the Expiry Date";
            SeeAlert(EXPIRY_DATE_ALERT_SPAN, EXPIRY_DATE_INPUT);
        }
        else {
            HideAlert(EXPIRY_DATE_ALERT_SPAN, EXPIRY_DATE_INPUT);
        }
        LockAndUnlockConfirmButton();
    });
}

const AddCVCCVVInputInputEvent = () => {
    CVC_CVV_INPUT.addEventListener("input", (event) => {
        const CVC_CVV = event.target.value;

        if (!CVC_CVV || !CheckMinimumLength(CVC_CVV, 2)) {
            CVC_CVV_ALERT_SPAN.textContent = "Please enter the CVC / CVV";
            SeeAlert(CVC_CVV_ALERT_SPAN, CVC_CVV_INPUT);
        }
        else {
            HideAlert(CVC_CVV_ALERT_SPAN, CVC_CVV_INPUT);
        }
        LockAndUnlockConfirmButton();
    });
}

const AddNameOnCardInputInputEvent = () => {
    NAME_ON_CARD_INPUT.addEventListener("input", (event) => {
        const NAME_ON_CARD = event.target.value;

        if (!NAME_ON_CARD || !CheckMinimumLength(NAME_ON_CARD, 3)) {
            NAME_ON_CARD_ALERT_SPAN.textContent = "Please enter the Name on the Card";
            SeeAlert(NAME_ON_CARD_ALERT_SPAN, NAME_ON_CARD_INPUT);
        }
        else {
            HideAlert(NAME_ON_CARD_ALERT_SPAN, NAME_ON_CARD_INPUT);
        }
        LockAndUnlockConfirmButton();
    });
}

const AppendTotalPayable = () => {
    CONFIRM_BUTTON_SPAN.textContent += " " + TOTAL_PAYABLE_TD.textContent;
}

//! summary table
document.querySelector(".summary-table-section").innerHTML += localStorage.getItem('summary_table');
const FULLNAME_CELL = document.getElementById("fullname");
const MOBILE_NUMBER_CELL = document.getElementById("mobile-number");
const EMAIL_CELL = document.getElementById("email");
const GENDER_CELL = document.getElementById("gender");
FULLNAME_CELL.innerText = TICKET.customerInfo.fullname;
MOBILE_NUMBER_CELL.innerText = TICKET.customerInfo.mobileNumber;
EMAIL_CELL.innerText = TICKET.customerInfo.email;
GENDER_CELL.innerText = TICKET.customerInfo.gender;

const TOTAL_PAYABLE_TD = document.getElementById("total-payable-cell");

//! initialises the required functions
AddCardNumberInputInputEvent();
AddExpiryDateInputInputEvent();
AddCVCCVVInputInputEvent();
AddNameOnCardInputInputEvent();
AppendTotalPayable();