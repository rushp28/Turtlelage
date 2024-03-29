import { CheckMinimumLength } from "./common.js";
import { SeeAlert } from "./common.js";
import { HideAlert } from "./common.js";
import { flagListArray } from "./countryCodes.js";

const TICKET = JSON.parse(localStorage.getItem('ticket'));

const FULLNAME_INPUT = document.getElementById("fullname-input");
const FULLNAME_ALERT_SPAN = document.getElementById("fullname-alert");
const MOBILE_NUMBER_INPUT = document.getElementById("mobile-number-input");
const MOBILE_NUMBER_ALERT_SPAN = document.getElementById("mobile-number-alert");
const EMAIL_INPUT = document.getElementById("email-input");
const EMAIL_ALERT_SPAN = document.getElementById("email-alert");
const EMAIL_CONFIRM_INPUT = document.getElementById("email-confirm-input");
const EMAIL_CONFIRM_ALERT_SPAN = document.getElementById("email-confirm-alert");
const GENDER_SELECT = document.getElementById("gender-select");
const CONFIRM_BUTTON_SPAN = document.getElementById("confirm-button");

let email = "";

const AddFullNameInputKeyUpEvent = () => {
    FULLNAME_INPUT.addEventListener("input", function (event) {
        const FULLNAME = (event.target.value).trim();

        if (!FULLNAME || !CheckMinimumLength(FULLNAME, 3)) {
            FULLNAME_ALERT_SPAN.textContent = "Please enter your Full Name";
            SeeAlert(FULLNAME_ALERT_SPAN, FULLNAME_INPUT);
        }
        else {
            HideAlert(FULLNAME_ALERT_SPAN, FULLNAME_INPUT);
        }
        LockAndUnlockConfirmButton();
    });
}

const AddMobileNumberInputKeyUpEvent = () => {
    MOBILE_NUMBER_INPUT.addEventListener("input", function (event) {
        const MOBILE_NUMBER = (event.target.value).trim();

        if (!CheckMinimumLength(MOBILE_NUMBER, 12)) {
            MOBILE_NUMBER_ALERT_SPAN.textContent = "Please enter a Valid Mobile Number";
            SeeAlert(MOBILE_NUMBER_ALERT_SPAN, MOBILE_NUMBER_INPUT);
        }
        else {
            HideAlert(MOBILE_NUMBER_ALERT_SPAN, MOBILE_NUMBER_INPUT);
        }
        LockAndUnlockConfirmButton();
    });
}

const AddEmailInputKeyUpEvent = () => {
    EMAIL_INPUT.addEventListener("input", function (event) {
        const EMAIL = (event.target.value).trim();

        if (!EMAIL || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(EMAIL) || !CheckMinimumLength(EMAIL, 3)) {
            EMAIL_ALERT_SPAN.textContent = "Please enter a Valid Email ID";
            SeeAlert(EMAIL_ALERT_SPAN, EMAIL_INPUT);
        }
        else {
            email = EMAIL;
            HideAlert(EMAIL_ALERT_SPAN, EMAIL_INPUT);
        }
        LockAndUnlockConfirmButton();
    });
}

const AddEmailConfirmInputKeyUpEvent = () => {
    EMAIL_CONFIRM_INPUT.addEventListener("input", function (event) {
        const EMAIL = (event.target.value).trim();

        if (!EMAIL || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(EMAIL) || !CheckMinimumLength(EMAIL, 3)) {
            EMAIL_CONFIRM_ALERT_SPAN.textContent = "Please enter a Valid Email ID";
            SeeAlert(EMAIL_CONFIRM_ALERT_SPAN, EMAIL_CONFIRM_INPUT);
        }
        else if (email !== EMAIL) {
            EMAIL_CONFIRM_ALERT_SPAN.textContent = "Email ID does not match";
            SeeAlert(EMAIL_CONFIRM_ALERT_SPAN, EMAIL_CONFIRM_INPUT);
        }
        else {
            HideAlert(EMAIL_CONFIRM_ALERT_SPAN, EMAIL_CONFIRM_INPUT);
        }
        LockAndUnlockConfirmButton();
    });
}

//! saves to local storage
const SaveToLocalStorage = () => {
    TICKET.customerInfo.fullname = FULLNAME_INPUT.value;
    TICKET.customerInfo.mobileNumber = MOBILE_NUMBER_INPUT.value;
    TICKET.customerInfo.email = EMAIL_INPUT.value;
    if (GENDER_SELECT.value) {
        TICKET.customerInfo.gender = GENDER_SELECT.value;
    }
    else {
        TICKET.customerInfo.gender = null;
    }
    localStorage.setItem('ticket', JSON.stringify(TICKET));
}

//! go to details page
const GoToPaymentPage = () => {
    window.location.href = "payment.html"
}

const AddConfirmButtonClickEvent = () => {
    CONFIRM_BUTTON_SPAN.addEventListener("click", SaveToLocalStorage);
    CONFIRM_BUTTON_SPAN.addEventListener("click", GoToPaymentPage);
}

const RemoveConfirmButtonClickEvent = () => {
    CONFIRM_BUTTON_SPAN.removeEventListener("click", SaveToLocalStorage);
    CONFIRM_BUTTON_SPAN.removeEventListener("click", GoToPaymentPage);
}

//! locks and unlocks confirm button
const LockAndUnlockConfirmButton = () => {
    const IS_FULLNAME_VALIDATED = FULLNAME_ALERT_SPAN.classList.contains("not-visible") && FULLNAME_INPUT.value ? true : false;
    const IS_MOBILE_NUMBER_VALIDATED = MOBILE_NUMBER_ALERT_SPAN.classList.contains("not-visible") && MOBILE_NUMBER_INPUT.value ? true : false;
    const IS_EMAIL_VALIDATED = EMAIL_ALERT_SPAN.classList.contains("not-visible") && EMAIL_INPUT.value ? true : false;
    const IS_EMAIL_CONFIRM_VALIDATED = EMAIL_CONFIRM_ALERT_SPAN.classList.contains("not-visible") && EMAIL_CONFIRM_INPUT.value ? true : false;
    if (IS_FULLNAME_VALIDATED && IS_MOBILE_NUMBER_VALIDATED && IS_EMAIL_VALIDATED && IS_EMAIL_CONFIRM_VALIDATED) {
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

flagListHTML();

const selectFlagText = document.getElementById("select-flag-text");
const flagOptions = document.querySelectorAll('.flag-options');
const flagListContainer = document.getElementById("flag-list");
const flagArrow = document.querySelector('.js-flag-arrow');
const mobilenumber = document.getElementById("mobile-number-input");

function flagListHTML(){
    let flagListHTML = ""; 

    const countryCodes = Object.keys(flagListArray);

    countryCodes.forEach(countryCode => {
        const country = flagListArray[countryCode].country;
        const mobileCode = flagListArray[countryCode].mobileCode;
        const ISO2 = flagListArray[countryCode].ISO2;

        flagListHTML += `
            <li class="flag-options">
                <img src="svgs/${ISO2}.svg" alt="${ISO2}">
                <p>${country}</p>
                <span>+${mobileCode}</span>
            </li>
        `;
    });

    document.getElementById("flag-list")
        .innerHTML = flagListHTML;
}
    
flagOptions.forEach(function (option) {
    option.addEventListener('click', () => {
        console.log('yes');
        const flagName = option.querySelector('p').textContent;
        const countryCode = Object.keys(flagListArray).find(code => flagListArray[code].country === flagName);

        if (countryCode) {
            const mobileCode = flagListArray[countryCode].mobileCode;
            const maxMobileLength = mobileCode.length === 4 ? 14 : 13;

            document.getElementById("mobile-number-input").value = "+" + flagListArray[countryCode].mobileCode;
            mobilenumber.maxLength = maxMobileLength;
        }

        selectFlagText.innerHTML = flagName;
        flagListContainer.classList.toggle("hide-flag-list");
        flagArrow.classList.toggle("rotate-arrow");
    });
});

mobilenumber.addEventListener('input', function(event) {
    const mobilenumberValue = mobilenumber.value.trim();
    
    if (mobilenumberValue.length > mobilenumber.maxLength) {
        mobilenumber.value = mobilenumberValue.slice(0, mobilenumber.maxLength);
    }
});

const flagSelectField = document.getElementById("flagSelectField");

flagSelectField.addEventListener('click', () => {
    flagListContainer.classList.toggle("hide-flag-list");
    flagArrow.classList.toggle("rotate-arrow");
});

AddFullNameInputKeyUpEvent();
AddMobileNumberInputKeyUpEvent();
AddEmailInputKeyUpEvent();
AddEmailConfirmInputKeyUpEvent();
AddConfirmButtonClickEvent();
LockAndUnlockConfirmButton();

//! summary table
document.querySelector(".summary-table-section").innerHTML += localStorage.getItem('summary_table');