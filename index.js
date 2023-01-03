"use strict";

const dynamicYear = document.querySelector(".dynamicYear");
const currYear = new Date();
dynamicYear.textContent = currYear.getFullYear();

class Activity {
  id = (Date.now() + "").slice(5);

  constructor(coords, remarks, timein, timeout, activity) {
    this.coords = coords;
    this.timein = { timein: timein, timeInDesc: this._setTimeInTimeOutIn12Hrs(timein) };
    this.timeout = { timeout: timeout, timeOutInDesc: this._setTimeInTimeOutIn12Hrs(timeout) };
    this.remarks = remarks;
    this.timespent = this._timeSpent();
    this.activity = activity;
    this.date = this._setDate();
  }

  _timeSpent() {
    const [timeinHour, timeinMinutes] = this.timein.timein.split(":");
    const [timeoutHour, timeoutMinutes] = this.timeout.timeout.split(":");
    const startTime = new Date(0, 0, 0, timeinHour, timeinMinutes);
    const endTime = new Date(0, 0, 0, timeoutHour, timeoutMinutes);
    const diff = endTime.getTime() - startTime.getTime();
    const SEC = 1000,
      MIN = 60 * SEC,
      HRS = 60 * MIN;
    const forCadence = Math.abs(Math.floor((diff / HRS) * 60));

    return { hour: Math.abs(Math.floor(diff / HRS)), mins: Math.abs(Math.floor((diff % HRS) / MIN)), inMinutes: forCadence };
  }

  _setDate() {
    const date = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  _setTimeInTimeOutIn12Hrs(time) {
    const timeSplit = time.split(":");
    let hours, minutes, meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
      meridian = "PM";
      hours -= 12;
    } else if (hours < 12) {
      meridian = "AM";
      if (hours === 0) hours = 12;
    } else {
      meridian = "PM";
    }

    return `${hours}:${minutes} ${meridian}`;
  }
}

class WalkingRunning extends Activity {
  constructor(coords, remarks, timein, timeout, steps, timespent) {
    super(coords, remarks, timein, timeout, timespent);
    this.steps = steps;

    this.cadence = this.calcCadence();
  }

  calcCadence() {
    //steps/min
    let result = this.steps / this.timespent.inMinutes;
    return result;
  }
}

class Playing extends Activity {
  activity = "playing";
  constructor(coords, remarks, timein, timeout, playingActivity, activity) {
    super(coords, remarks, timein, timeout, activity);
    this.playingActivity = playingActivity;
  }
}

class Bathroom extends Activity {
  activity = "bathroom";
  constructor(coords, remarks, timein, timeout, bathroomActivity, activity) {
    super(coords, remarks, timein, timeout, activity);
    this.bathroomActivity = bathroomActivity;
  }
}

// === APPLICATION ARCHITECTURE ====

// ***** FOR TWO LOCATIONS *****
// const testBtn = document.querySelector(".btn__cl");
// const testBtn2 = document.querySelector(".btn__rp");
// const container = document.querySelector(".container");

// const removeAndCreateMap = function () {
//   map.remove();

//   const newMap = document.createElement("div");
//   newMap.setAttribute("id", "map");
//   newMap.setAttribute("class", "map-container");
//   container.insertAdjacentElement("beforeend", newMap);
// };

// const loadMap = function (latitute, longitude) {
//   //   const coords = [51.4412081, -0.2766986];
//   const coords = [latitute, longitude];

//   const map = L.map("map").setView(coords, 16);

//   L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   }).addTo(map);
// };

// loadMap(51.4412081, -0.2766986); //Richmond Park muna

// testBtn2.addEventListener("click", function () {
//   removeAndCreateMap();
//   loadMap(51.4412081, -0.2766986);
// });

// testBtn.addEventListener("click", function () {
//   //   map.remove();

//   //   const newMap = document.createElement("div");
//   //   newMap.setAttribute("id", "map");
//   //   newMap.setAttribute("class", "map-container");
//   //   container.insertAdjacentElement("beforeend", newMap);

//   removeAndCreateMap();

//   navigator.geolocation.getCurrentPosition(
//     // success function
//     function (position) {
//       //   console.log(position);
//       const { latitude, longitude } = position.coords;
//       console.log(latitude, longitude);
//       loadMap(latitude, longitude);
//     },
//     // error function
//     () => {
//       alert("Having trouble getting your location");
//     }
//   );
// });

const form = document.querySelector("form");
const inputActivityDropdown = document.querySelector(".form__input--dropdown");
const inputCadence = document.querySelector(".form__row--walkrun");
const inputPlayingActivity = document.querySelector(".form__row--play");
const inputBathroomActivity = document.querySelector(".form__row--bathroom");
const allActivityOptions = document.querySelectorAll(".select-option");
const inputRemarks = document.querySelector(".form__row--remarks");
const btnFormSave = document.querySelector(".form__btn");
const allFormInput = document.querySelectorAll(".form__input");
const inputArray = [inputCadence, inputPlayingActivity, inputBathroomActivity]; //for hidding stuff on activity dropdown
const trackerActivtiyContainer = document.querySelector(".tracker-list");

class App {
  #map;
  #mapEvent;
  #mapZoomLevel = 18;
  #activityEntries = [];

  constructor() {
    this._getLocalStorage();
    this._loadMap();
    inputActivityDropdown.addEventListener("change", this._toggleActivity);
    form.addEventListener("submit", this._newActivity.bind(this));
    trackerActivtiyContainer.addEventListener("click", this._moveToMarker.bind(this));
  }

  _loadMap() {
    const coords = [51.4412081, -0.2766986];
    this.#map = L.map("map").setView(coords, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      maxZoom: this.#mapZoomLevel,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
    }).addTo(this.#map);

    // === WELCOME SIGN ===
    // L.marker(coords).addTo(map).bindPopup("Welcome to <strong>Richmond Park</strong>").openPopup();

    this.#map.on("click", this._showForm.bind(this));

    this.#activityEntries.forEach((activtiyData) => this._renderActivityMarker(activtiyData));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.toggle("form--hidden");
    form.classList.toggle("form--transition");
    inputActivityDropdown.focus();
  }

  _toggleActivity() {
    const selectedIndex = inputActivityDropdown.selectedIndex;
    const selectedActivity = allActivityOptions[selectedIndex].value;

    const changeFormActivity = function (selectedActivity) {
      const unhideInput = function (input) {
        if (input == "resting" || input == "activity") {
          inputArray.forEach((i) => i.classList.add("hidden"));
        }

        inputArray.filter((i) => {
          if (i !== input) {
            i.classList.add("hidden");
          } else {
            return i.classList.remove("hidden");
          }
        });
      };

      if (selectedActivity == "running" || selectedActivity == "walking") {
        unhideInput(inputCadence);
      } else if (selectedActivity == "playing") {
        unhideInput(inputPlayingActivity);
      } else if (selectedActivity == "bathroom") {
        unhideInput(inputBathroomActivity);
      } else if (selectedActivity == "resting") {
        unhideInput("resting");
      } else if (selectedActivity == "activity") {
        unhideInput("activity");
      }

      selectedActivity == "activity" ? inputRemarks.classList.add("hidden") : inputRemarks.classList.remove("hidden");
    };

    changeFormActivity(selectedActivity);
    selectedActivity == "activity" ? btnFormSave.classList.add("hidden") : btnFormSave.classList.remove("hidden");
  }

  _newActivity(e) {
    e.preventDefault();

    const [inputTimeIn, inputTimeOut, inputActivity, inputSteps, inputPlaying, inputBathroom, inputRemarks] = allFormInput;

    if (+inputTimeIn.value.split(":")[0] > +inputTimeOut.value.split(":")[0]) return alert("time out is earlier than time in (HOUR)"); //checking by HOUR
    if (+inputTimeIn.value.split(":")[1] > +inputTimeOut.value.split(":")[1]) return alert("time out is earlier than time in (MINS)"); //checking by MINS

    if (inputTimeIn.value === inputTimeOut.value) return alert("make sure time in and time out are not the same");

    const timein = inputTimeIn.value;
    const timeout = inputTimeOut.value;
    const activity = inputActivity.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let activityEntry;

    let remarks;
    if (inputRemarks.value === "") {
      remarks = null;
    } else remarks = inputRemarks.value;

    if (activity === "walking") {
      if (inputSteps.value === "") return alert("Fill in Steps Field");
      const steps = +inputSteps.value;
      if (!(steps >= 0)) return alert("Input must be positive number");
      activityEntry = new WalkingRunning([lat, lng], remarks, timein, timeout, steps, activity);
    }

    if (activity === "running") {
      if (inputSteps.value === "") return alert("Fill in Steps Field");
      const steps = +inputSteps.value;
      if (!(steps >= 0)) return alert("Input must be positive number");
      activityEntry = new WalkingRunning([lat, lng], remarks, timein, timeout, steps, activity);
    }

    if (activity === "playing") {
      if (inputPlaying.value === "") return alert("Fill in Playing Field");
      const playingActivityValue = inputPlaying.value;
      activityEntry = new Playing([lat, lng], remarks, timein, timeout, playingActivityValue, activity);
    }

    if (activity === "bathroom") {
      if (inputBathroom.value === "") return alert("Fill in Bathroom Field");
      const bathroomActivityValue = inputBathroom.value;
      activityEntry = new Bathroom([lat, lng], remarks, timein, timeout, bathroomActivityValue, activity);
    }

    if (activity === "resting") {
      activityEntry = new Activity([lat, lng], remarks, timein, timeout, activity);
    }

    this.#activityEntries.push(activityEntry); //adding new object to the array
    this._renderActivityMarker(activityEntry); //adding the marker to the map
    allFormInput.forEach((i) => (i.value = "")); //clearing the input values
    this._renderActivity(activityEntry); //render to sidebar list
    this._setLocalStorage(); //save to local storage
  }

  _renderActivityMarker(activity) {
    var locationIcon = L.icon({
      iconUrl: "img/custom-icon.png",

      iconSize: [50, 65], // size of the icon
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      popupAnchor: [-4, -85], // point
    });

    L.marker(activity.coords, { icon: locationIcon })
      .addTo(this.#map)
      .bindPopup(L.popup({ autoClose: false, closeOnClick: false, className: `${activity.activity}--popup` }))
      .setPopupContent(
        `${activity.activity[0].toUpperCase() + activity.activity.slice(1, -1) + activity.activity.slice(-1)} for ${
          activity.timespent.hour > 0 ? `${activity.timespent.hour > 1 ? `${activity.timespent.hour}hrs` : `${activity.timespent.hour}hr`}` : ""
        } ${activity.timespent.mins > 0 ? `${activity.timespent.mins > 1 ? `${activity.timespent.mins}mins` : `${activity.timespent.mins}min`}` : ""}`
      )
      .openPopup();

    form.classList.add("form--hidden");
    const toHide = [inputRemarks, ...inputArray, btnFormSave];
    toHide.forEach((i) => i.classList.add("hidden"));
  }

  _renderActivity(activityEntry) {
    let html = `
      <div class="tracket-list__tracker tracker tracker--${activityEntry.activity}" data-id="${activityEntry.id}">

      <h2 class="tracker__header"> ${activityEntry.activity[0].toUpperCase() + activityEntry.activity.slice(1, -1) + activityEntry.activity.slice(-1)} for ${
      activityEntry.timespent.hour > 0 ? `${activityEntry.timespent.hour > 1 ? `${activityEntry.timespent.hour}hrs` : `${activityEntry.timespent.hour}hr`}` : ""
    } ${activityEntry.timespent.mins > 0 ? `${activityEntry.timespent.mins > 1 ? `${activityEntry.timespent.mins}mins` : `${activityEntry.timespent.mins}min`}` : ""}</h2>

        <div class="tracker__details">
          <span class="tracker__details--icon">🗓</span>
          <span class="tracker__details--value">${activityEntry.date}</span>
        </div>
        <div class="tracker__details">
          <span class="tracker__details--icon">⏳</span>
          <span class="tracker__details--value">${activityEntry.timein.timeInDesc}</span>
        </div>
        <div class="tracker__details">
          <span class="tracker__details--icon">⌛️</span>
          <span class="tracker__details--value">${activityEntry.timeout.timeOutInDesc}</span>
        </div>
        
        ${
          activityEntry.remarks === null
            ? ""
            : `
          <div class="tracker__details tracker__details--remarks">
            <span class="tracker__details--icon">✍🏻</span>
            <span class="tracker__details--value">${activityEntry.remarks}</span>
          </div>
        `
        }
    `;

    if (activityEntry.activity === "walking" || activityEntry.activity === "running") {
      html += `
            <div class="tracker__details tracker__details--steps">
              <span class="tracker__details--icon">🐾</span>
              <span class="tracker__details--value">${activityEntry.steps} steps</span>
            </div>
            <div class="tracker__details tracker__details--cadence">
              <span class="tracker__details--icon">⚡️</span>
              <span class="tracker__details--value">${activityEntry.cadence.toFixed(2)} spm</span>
            </div>
        </div>
      `;
    }

    if (activityEntry.activity === "playing") {
      html += `
            <div class="tracker__details tracker__details--playingActivity">
              <span class="tracker__details--icon">🦴</span>
              <span class="tracker__details--value">${activityEntry.playingActivity}</span>
            </div>
        </div>
      `;
    }

    if (activityEntry.activity === "bathroom") {
      html += `
            <div class="tracker__details tracker__details--bathroomActivity">
              <span class="tracker__details--icon">${activityEntry.bathroomActivity.slice(-2)}</span>
              <span class="tracker__details--value">${activityEntry.bathroomActivity[0].toUpperCase() + activityEntry.bathroomActivity.slice(1, -2)}</span>
            </div>
        </div>
      `;
    }

    form.insertAdjacentHTML("afterend", html);
  }

  _moveToMarker(e) {
    const activityListElement = e.target.closest(".tracket-list__tracker ");
    if (!activityListElement) return;

    const activityData = this.#activityEntries.find((entry) => entry.id === activityListElement.dataset.id);

    this.#map.setView(activityData.coords, this.#mapZoomLevel, { animate: true, duration: 1, easeLinearity: 0.5 });
  }

  _setLocalStorage() {
    localStorage.setItem("activity", JSON.stringify(this.#activityEntries));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("activity"));

    if (!data) return;

    this.#activityEntries = data;
    this.#activityEntries.forEach((activityData) => this._renderActivity(activityData));
  }

  reset() {
    localStorage.removeItem("activity");
    location.reload();
  }
}

const app = new App();
