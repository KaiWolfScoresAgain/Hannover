// A huge percentage of this code is AI generated

document.addEventListener("DOMContentLoaded", () => {
    const monthSelect = document.getElementById("monthSelect");
    const calendar = document.getElementById("calendar");
    const journalModal = document.getElementById("journalModal");
    const journalDate = document.getElementById("journalDate");
    const journalText = document.getElementById("journalText");
    const colorPicker = document.getElementById("colorPicker");
    const saveEntry = document.getElementById("saveEntry");
    const closeModal = document.querySelector(".close");
    
    let selectedDate;

    // Populate days based on the selected month
    monthSelect.addEventListener("change", loadCalendarDays);

    function loadCalendarDays() {
        calendar.innerHTML = "";
        const month = parseInt(monthSelect.value);
        const year = new Date().getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const dayBox = document.createElement("div");
            dayBox.className = "day-box";
            dayBox.textContent = day;
            dayBox.addEventListener("click", () => openJournal(day, month));
            
            // Load color from local storage if available
            const savedColor = localStorage.getItem(`color-${year}-${month}-${day}`);
            if (savedColor) {
                dayBox.style.backgroundColor = savedColor;
            }

            calendar.appendChild(dayBox);
        }
    }

    function openJournal(day, month) {
        selectedDate = { day, month, year: new Date().getFullYear() };
        journalDate.textContent = `${monthSelect.options[month].text} ${day}`;
        
        // Load saved journal entry and color for the selected date
        journalText.value = localStorage.getItem(`journal-${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`) || "";
        colorPicker.value = localStorage.getItem(`color-${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`) || "#FFFFFF";

        journalModal.style.display = "block";
    }

    saveEntry.addEventListener("click", () => {
        // Save journal entry and color to local storage
        const { year, month, day } = selectedDate;
        localStorage.setItem(`journal-${year}-${month}-${day}`, journalText.value);
        localStorage.setItem(`color-${year}-${month}-${day}`, colorPicker.value);
        
        // Update color of the day box
        const dayBox = calendar.children[day - 1];
        dayBox.style.backgroundColor = colorPicker.value;

        journalModal.style.display = "none";
    });

    closeModal.addEventListener("click", () => {
        journalModal.style.display = "none";
    });

    window.onclick = function(event) {
        if (event.target == journalModal) {
            journalModal.style.display = "none";
        }
    };

    // Load the calendar for the initially selected month
    loadCalendarDays();
});


