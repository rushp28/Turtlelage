//* ticket object
const TICKET = {
  date: {
    day: "",
    month: "",
    year: ""
  },
  hours: {
    peak: 0,
    normal: 0
  },
  guests: [
    {
      name: "sl-adult",
      count: 0,
      hourCharges: { normal: 4, peak: 6 }
    },
    {
      name: "sl-child",
      count: 0,
      hourCharges: { normal: 2, peak: 3 }
    },
    {
      name: "f-adult",
      count: 0,
      hourCharges: { normal: 10, peak: 13 }
    },
    {
      name: "f-child",
      count: 0,
      hourCharges: { normal: 5, peak: 8 }
    },
    {
      name: "infant",
      count: 0,
      hourCharges: { normal: 0, peak: 0 }
    }
  ],
  customerInfo: {
    fullname: "",
    mobileNumber: "",
    email: "",
    gender: null,
  }
};
localStorage.setItem('ticket', JSON.stringify(TICKET));

const DAYS_UL = document.querySelector(".days");
const CURRENT_DATE = new Date();

const SELECTED_DATE_TD = document.getElementById("selected-date");

let currentDay = CURRENT_DATE.getDate();
let displayedMonthIndex = CURRENT_DATE.getMonth();
let displayedYear = CURRENT_DATE.getFullYear();
let selectedDate = CURRENT_DATE;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//! updates summary table's selected date
const UpdateSelectedDate = (SELECTED_DATE_TD, selectedDate) => {
    SELECTED_DATE_TD.innerText = `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
}

//! adds the previous month's days
const AddPreviousMonthDays = (dayli, firstDayNameIndex, lastDayOfLastMonth) => {
    for (let index = firstDayNameIndex; index > 0; index--) {
        dayli += `<li class="inactive-previous-month">${lastDayOfLastMonth - index + 1}</li>`;
    }
    return dayli;
}

//! adds the current month's days
const AddCurrentMonthDays = (dayli, lastDay, currentMonthIndex, currentYear) => {
    for (let index = 1; index <= lastDay; index++) {
        const IS_PAST_DAY = (displayedMonthIndex === currentMonthIndex) && (displayedYear === currentYear) && (index < currentDay);
        const IS_ACTIVE_LI = IS_PAST_DAY ? "inactive-current-month" : "active";
        dayli += `<li class="${IS_ACTIVE_LI}">${index}</li>`;
    }
    return dayli;
}
//! adds the next month's days
const AddNextMonthDays = (dayli, remainingDays) => {
    if (remainingDays > 0) {
        for (let index = 1; index <= remainingDays; index++) {
            dayli += `<li class="inactive-next-month">${index}</li>`;
        }
    }
    return dayli;
}

//! renders the calendar
const RenderCalendar = () => {
    const FIRST_DAY_NAME_INDEX = new Date(displayedYear, displayedMonthIndex, 1).getDay();
    const LAST_DAY_OF_LAST_MONTH = new Date(displayedYear, displayedMonthIndex, 0).getDate();
    const SELECTED_DATE_TD = document.getElementById("selected-date");
    const MONTH_AND_YEAR_H3 = document.querySelector(".month-year");
    
    let dayli = "";
    
    dayli = AddPreviousMonthDays(dayli, FIRST_DAY_NAME_INDEX, LAST_DAY_OF_LAST_MONTH);
    
    const LAST_DAY = new Date(displayedYear, displayedMonthIndex + 1, 0).getDate();
    const CURRENT_MONTH_INDEX = CURRENT_DATE.getMonth();
    const CURRENT_YEAR = CURRENT_DATE.getFullYear();

    dayli = AddCurrentMonthDays(dayli, LAST_DAY, CURRENT_MONTH_INDEX, CURRENT_YEAR);

    const CALENDAR_LENGTH = 42;
    const REMAINING_DAYS = CALENDAR_LENGTH - (FIRST_DAY_NAME_INDEX + LAST_DAY);

    dayli = AddNextMonthDays(dayli, REMAINING_DAYS);
    
    UpdateSelectedDate(SELECTED_DATE_TD, selectedDate);
    DAYS_UL.innerHTML = dayli;
    MONTH_AND_YEAR_H3.innerText = `${MONTHS[displayedMonthIndex]} ${displayedYear}`
}

//! adds the calendar render to the previous and next buttons' click
const previousAndNextMonthIconsdiv = document.querySelectorAll(".calendar-head div");
previousAndNextMonthIconsdiv.forEach(icon => {
    icon.addEventListener("click", () => {
        if (icon.id === "previous-button") {
            if ((displayedMonthIndex === CURRENT_DATE.getMonth()) && (displayedYear === CURRENT_DATE.getFullYear())) {
                return;
            }
            else {
                DAYS_UL.classList.add("fade-out");
                displayedMonthIndex = (displayedMonthIndex - 1 + 12) % 12;

                if (displayedMonthIndex === 11) {
                    displayedYear -= 1;
                }
            }
        }
        else if (icon.id === "next-button") {
            DAYS_UL.classList.add("fade-out");
            displayedMonthIndex = (displayedMonthIndex + 1) % 12;

            if (displayedMonthIndex === 0) {
                displayedYear += 1;
            }
        }

        setTimeout(() => {
            RenderCalendar();

            DAYS_UL.classList.remove("fade-out");
            DAYS_UL.classList.add("fade-in");
        }, 300);
    });
});

//! adds date selection to the dates' click
DAYS_UL.addEventListener("click", function (event) {
    const clickedli = event.target;
  
    if (clickedli.matches("li.active") || clickedli.closest("li.active")) {
      const selectedli = clickedli.closest("li.active");
      const daysli = DAYS_UL.querySelectorAll("li");
  
      daysli.forEach(function (li){
        li.classList.remove("selected");
      })
  
      selectedli.classList.add("selected");
      
      selectedDate = new Date(parseInt(displayedYear), displayedMonthIndex, parseInt(selectedli.innerText));
      UpdateSelectedDate(SELECTED_DATE_TD, selectedDate);

    }
  
    if (clickedli.matches("li.inactive-previous-month") || clickedli.closest("li.inactive-previous-month") || clickedli.matches("li.inactive-next-month") || clickedli.closest("li.inactive-next-month")) {
    
      if (displayedMonthIndex === CURRENT_DATE.getMonth() && (clickedli.matches("li.inactive-previous-month") || clickedli.closest("li.inactive-previous-month"))) {
        return;
      }
  
      DAYS_UL.classList.add("fade-out");
  
      if (clickedli.matches("li.inactive-previous-month")) {
        displayedMonthIndex = (displayedMonthIndex - 1 + 12) % 12;
  
        if (displayedMonthIndex === 11) {
          displayedYear -= 1;
        }
      }
      else if (clickedli.matches("li.inactive-next-month")) {
          
        displayedMonthIndex = (displayedMonthIndex + 1) % 12;
  
        if (displayedMonthIndex === 0) {
          displayedYear += 1;
        }
      }
  
      setTimeout(() => {
        RenderCalendar();
  
        DAYS_UL.classList.remove("fade-out");
        DAYS_UL.classList.add("fade-in");
      }, 300);
    }
});

//! initial calendar render
RenderCalendar();

const CONFIRM_BUTTON_SPAN = document.getElementById("confirm-button");

//! saves to local storage
const SaveToLocalStorage = () => {
    //! date
    TICKET.date.day = selectedDate.getDate();
    TICKET.date.month = MONTHS[selectedDate.getMonth()];
    TICKET.date.year = selectedDate.getFullYear();
    

    //! guests count
    guestTypeContainerdiv.forEach((guestTypeContainer) => {
        let guestType = guestTypeContainer.id;
        const countspan = guestTypeContainer.querySelector(".count");
        TICKET.guests.forEach((guest) => {
        if (guest.name === guestType) {
            guest.count = parseInt(countspan.innerText);
        }
        });
    });

    //! peak and normal hours
    const peakAndNormalHourCount = CalPeakAndNormalHours(selectedTimeSlots);
    TICKET.hours.peak = peakAndNormalHourCount[0];
    TICKET.hours.normal = peakAndNormalHourCount[1];
    localStorage.setItem('ticket', JSON.stringify(TICKET));
    
    //! summary table
    localStorage.setItem('summary_table', document.querySelector(".summary-table-section").innerHTML);
}

//! go to details page
const GoToDetailsPage = () => {
    window.location.href = "details.html";
}

//! adds the save function to confirm button
const AddConfirmButtonClickEvent = () => {
    CONFIRM_BUTTON_SPAN.addEventListener("click", SaveToLocalStorage);  
    CONFIRM_BUTTON_SPAN.addEventListener("click", GoToDetailsPage);  
}

//! removes the save function from confirm button
const RemoveConfirmButtonClickEvent = () => {
    CONFIRM_BUTTON_SPAN.removeEventListener("click", SaveToLocalStorage);
    CONFIRM_BUTTON_SPAN.removeEventListener("click", GoToDetailsPage);  
}

//! locks and unlocks confirm button
const LockAndUnlockConfirmButton = (CONFIRM_BUTTON_SPAN, TOTAL_PAYABLE) => {
    if (TOTAL_PAYABLE > 0) {
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

//!
//!

const guestTypeContainerdiv = document.querySelectorAll(".guest-type-container");

guestTypeContainerdiv.forEach((guestTypeContainer) => {
  const increaseCountButton = guestTypeContainer.querySelector(".increase-count-button");
  const decreaseCountButton = guestTypeContainer.querySelector(".decrease-count-button");
  const countspan = guestTypeContainer.querySelector(".count");
  countspan.innerText = 0;

  increaseCountButton.addEventListener("click", () => {
    UpdateGuestTotalCharges(guestTypeContainer, countspan, "increase");
    setTimeout(() => {
      UpdateTotalPayable();
    }, 300);
  });

  decreaseCountButton.addEventListener("click", () => {
    UpdateGuestTotalCharges(guestTypeContainer, countspan, "decrease");  
    setTimeout(() => {
      UpdateTotalPayable();
    }, 300);
  });
});

const timeSlotsSelect = document.getElementById("time-slots-select");
const selectedTimeSlotsdiv = document.querySelector(".selected-time-slots");
const timetd = document.getElementById("selected-time");
const durationtd = document.getElementById("selected-duration");
let selectedTimeSlots = [];

//* updates the count

function UpdateCount(countspan, calculationType) {
  let count = parseInt(countspan.innerText);

  if (calculationType === "increase") {
    count++;
  }
  else if (calculationType === "decrease" && count > 0) {
    count--;
  }
  return count;
}

//* calculates guest charge totals / free (infants)

function CalGuestChargeTotals(countspan, guestType) {
  if (guestType === "infant") {
    return "Free";
  }

  const guestCount = parseInt(countspan.innerText);
  const peakAndNormalHours = CalPeakAndNormalHours(selectedTimeSlots);
  const countUpdatedGuest = TICKET.guests.find(guest => guest.name === guestType);
  const guestChargeTotal = guestCount * ((countUpdatedGuest.hourCharges.peak * peakAndNormalHours[0]) + (countUpdatedGuest.hourCharges.normal * peakAndNormalHours[1]));
  
  return guestChargeTotal >= 0 ? `$ ${guestChargeTotal}` : null;
}

//* updates the guest total charges

function UpdateGuestTotalCharges(guestTypeContainer, countspan, calculationType) {
  let guestType = guestTypeContainer.id;
  let count = UpdateCount(countspan, calculationType);
  countspan.innerText = count.toString();

  const row = document.querySelector("." + guestType + "-row");
  row.classList.add("fade-out");

  setTimeout(() => {
    const guestChargeTotal = CalGuestChargeTotals(countspan, guestType);
    const guestNamespan = guestTypeContainer.querySelector(".guest-info span:first-child");

    row.innerHTML = `<th class="${guestType + "-count"}">${countspan.innerText} ${guestNamespan.innerText}</th><td id="${guestType + "-charge"}" class="charges">${guestChargeTotal}</td>`;
    row.classList.remove("fade-out");
    row.classList.add("fade-in");

    if (count === 0) {
      row.innerHTML = ``;
    }
  }, 300);
}

//! Updating the Summary Table initially

RenderSummaryTableUpdates();

//* checks if selected time slot is suitable

timeSlotsSelect.addEventListener("change", (event) => {
  const selectedHour = event.target.value;

  if (selectedHour !== "") {

    if (selectedTimeSlots.length === 0) {
      selectedTimeSlots.push(selectedHour);
    }
    else {
      const lastSelectedHour = selectedTimeSlots[selectedTimeSlots.length - 1];
      const lastSelectedOptionIndex = timeSlotsSelect.querySelector(`[value="${lastSelectedHour}"]`).index;
      const selectedOptionIndex = event.target.selectedIndex;

      if (selectedOptionIndex === lastSelectedOptionIndex + 1) {
        selectedTimeSlots.push(selectedHour);
      }
      else {
        //! ADD VALIDATION LOGIC
        timeSlotsSelect.value = "";
      }
    }
  }
  timeSlotsSelect.value = "";


  RenderSelectedSlots();
  RenderSummaryTableUpdates();
  setTimeout(() => {
    UpdateTotalPayable();
  }, 300);
});

//* updates the selected and removed slots

function RenderSelectedSlots() {
  selectedTimeSlotsdiv.classList.add("fade-out");

  setTimeout(() => {
    selectedTimeSlotsdiv.innerHTML = "";

    selectedTimeSlots.forEach((selectedTimeSlot, index) => {
      const selectedTimeSlotdiv = document.createElement("div");

      selectedTimeSlotdiv.textContent = selectedTimeSlot;
      selectedTimeSlotdiv.classList.add("selected-slot");

      if (index === 0 || index === selectedTimeSlots.length - 1) {
        selectedTimeSlotdiv.addEventListener("click", () => RemoveSlot(index));
      }

      selectedTimeSlotsdiv.appendChild(selectedTimeSlotdiv);
    });

    selectedTimeSlotsdiv.classList.remove("fade-out");
    selectedTimeSlotsdiv.classList.add("fade-in");
  }, 300);
}

//* removes times slot

function RemoveSlot(index) {
  selectedTimeSlots.splice(index, 1);

  RenderSelectedSlots();
  RenderSummaryTableUpdates();
  setTimeout(() => {
    UpdateTotalPayable();
  }, 300);
}

//* calculate the peak and normal hours

function CalPeakAndNormalHours(selectedHours) {
  const peakAndNormalHours = [0, 0];
  
  selectedHours.forEach(selectedHour => {
    const startHour = parseInt(selectedHour.slice(0, 2));

    peakAndNormalHours[startHour >= 10 && startHour <= 12 || startHour >= 3 && startHour <= 5 ? 0 : 1]++;
  });
  
  return peakAndNormalHours;
}

//* caluculates the total payable

function CalTotalPayable(chargestds) {
  let totalPayable = 0;

  if (chargestds) {
    chargestds.forEach((chargestd) => {

      if (chargestd.innerText !== "Free") {
        totalPayable += parseInt((chargestd.innerText).slice(1, chargestd.innerText.length));
      }
    });
  }
  return totalPayable;
}


function UpdateTotalPayable() {
  const chargestds = document.querySelectorAll(".charges");
  const totalPayableRow = document.querySelector(".total-payable");
  const totalPayable = CalTotalPayable(chargestds);
  totalPayableRow.innerText = "$ " + totalPayable;
  LockAndUnlockConfirmButton(CONFIRM_BUTTON_SPAN, totalPayable);
}

//* renders the updates to the summary table

function RenderSummaryTableUpdates() {
  let time = selectedTimeSlots.length > 1 ? `${selectedTimeSlots[0].slice(0, 8)} to ${selectedTimeSlots[selectedTimeSlots.length - 1].slice(12, 21)}` : selectedTimeSlots[0] || "Not Selected";
  
  const peakAndNormalHours = CalPeakAndNormalHours(selectedTimeSlots);
  const totalHours = peakAndNormalHours.reduce((total, hours) => total + hours, 0);

  [timetd, durationtd].forEach(td => td.classList.add("fade-out"));

  guestTypeContainerdiv.forEach((guestTypeContainer)=> {
    const countspan = guestTypeContainer.querySelector(".count");
    UpdateGuestTotalCharges(guestTypeContainer, countspan, null);
  });
  
  setTimeout(() => {
    timetd.innerHTML = `<span>${time}</span>`;
    durationtd.innerHTML = `<span>${totalHours} hrs <span>( ${peakAndNormalHours[1]} Normal : ${peakAndNormalHours[0]} Peak )</span></span>`;

    [timetd, durationtd].forEach(td => {
      td.classList.remove("fade-out");
      td.classList.add("fade-in");
    });
  }, 300);
}