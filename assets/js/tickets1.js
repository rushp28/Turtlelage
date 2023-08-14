const daysul = document.querySelector(".days");
const monthAndYearh3 = document.querySelector(".month-year");
const previousAndNextMonthIconsdiv = document.querySelectorAll(".calendar-head div");

const currentDate = new Date();
let currentDay = CURRENT_DATE.getDate();
let displayedMonthIndex = CURRENT_DATE.getMonth();
let displayedYear = CURRENT_DATE.getFullYear();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//* renders the calendar

const RenderCalendar = () => {
    const firstDayNameIndex = new Date(displayedYear, displayedMonthIndex, 1).getDay();
    const lastDay = new Date(displayedYear, displayedMonthIndex + 1, 0).getDate();
    const lastDayOfLastMonth = new Date(displayedYear, displayedMonthIndex, 0).getDate();
    const selectedDatetd = document.querySelector(".selected-date");

    let dayli = "";

    for (let index = firstDayNameIndex; index > 0; index--) {
        dayli += `<li class="inactive-previous-month">${lastDayOfLastMonth - index + 1}</li>`;
    }

    const currentMonthIndex = CURRENT_DATE.getMonth();
    const currentYear = CURRENT_DATE.getFullYear();
    selectedDatetd.innerText = `${currentDay} ${MONTHS[currentMonthIndex]} ${currentYear}`;

    for (let index = 1; index <= lastDay; index++) {
        const isPastDay = (displayedMonthIndex === currentMonthIndex && displayedYear === currentYear && index < currentDay);
        const isActiveli = isPastDay ? "inactive-current-month" : "active";
        dayli += `<li class="${isActiveli}">${index}</li>`;
    }

    const totalDaysDisplayed = firstDayNameIndex + lastDay;
    const remainingDays = 42 - totalDaysDisplayed;

    if (remainingDays > 0) {
      for (let index = 1; index <= remainingDays; index++) {
        dayli += `<li class="inactive-next-month">${index}</li>`;
      }
    }

    DAYS_UL.innerHTML = dayli;
    monthAndYearh3.innerText = `${MONTHS[displayedMonthIndex]} ${displayedYear}`
}

//* inital calendar render

RenderCalendar();

//* renders the calendar when the previous and next month buttons are clicked

previousAndNextMonthIconsdiv.forEach(icon => {
  icon.addEventListener("click", () => {
    if (icon.id === "previous-button" && (displayedMonthIndex === CURRENT_DATE.getMonth() && displayedYear === CURRENT_DATE.getFullYear())) {
      return;
    }

    DAYS_UL.classList.add("fade-out");

    if (icon.id === "previous-button") {
      displayedMonthIndex = (displayedMonthIndex - 1 + 12) % 12;

      if (displayedMonthIndex === 11) {
        displayedYear -= 1;
      }
    }
    else if (icon.id === "next-button") {
        
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
  })
})

// Updating the Selected Date when a Day is Clicked

DAYS_UL.addEventListener("click", function (event) {
  const clickedli = event.target;

  if (clickedli.matches("li.active") || clickedli.closest("li.active")) {
    const selectedli = clickedli.closest("li.active");
    const daysli = DAYS_UL.querySelectorAll("li");

    daysli.forEach(function (li){
      li.classList.remove("selected");
    })

    selectedli.classList.add("selected");
    
    const selectedDay = selectedli.innerText;
    const selectedMonth = MONTHS[displayedMonthIndex];
    const selectedYear = displayedYear;

    localStorage.setItem("selected_day", selectedDay);
    localStorage.setItem("selected_month", selectedMonth);
    localStorage.setItem("selected_year", selectedYear);

    if (selectedDay && selectedMonth && selectedYear) {
      const selectedDatetd = document.querySelector(".selected-date");
      selectedDatetd.innerText = `${selectedDay} ${selectedMonth} ${selectedYear}`;
    }
    else {
      console.log("Values not found");
    }
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

// ticket object


localStorage.setItem('ticket', JSON.stringify(TICKET));

const countryCodes = {
  countryFlag: [],
  code: []
}

const timeSlotsSelect = document.getElementById("time-slots-select");
const selectedTimeSlotsdiv = document.querySelector(".selected-time-slots");
const timetd = document.querySelector(".time");
const durationtd = document.querySelector(".duration");
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


//* saves to local storage

const confirmButtonspan = document.getElementById("confirm-button");

CONFIRM_BUTTON_SPAN.addEventListener("click", () => {

  //* saves the guests count

  guestTypeContainerdiv.forEach((guestTypeContainer) => {
    let guestType = guestTypeContainer.id;
    const countspan = guestTypeContainer.querySelector(".count");
    TICKET.guests.forEach((guest) => {
      if (guest.name === guestType) {
        guest.count = parseInt(countspan.innerText);
      }
    });
  });

  //* saves the peak and normal hours

  const peakAndNormalHourCount = CalPeakAndNormalHours(selectedTimeSlots);
  TICKET.hours.peak = peakAndNormalHourCount[0];
  TICKET.hours.normal = peakAndNormalHourCount[1];
  localStorage.setItem('ticket', JSON.stringify(TICKET));
});