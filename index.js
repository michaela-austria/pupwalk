"use strict";

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

// let map, mapEvent;

// // navigator.geolocation.getCurrentPosition(
// //   //success funciton
// //   function (position) {
// // const { latitude, longitude } = position.coords;
// const coords = [51.4412081, -0.2766986];
// map = L.map("map").setView(coords, 15);

// L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
//   maxZoom: 20,
//   attribution:
//     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
// }).addTo(map);

// // === WELCOME SIGN ===
// // L.marker(coords).addTo(map).bindPopup("Welcome to <strong>Richmond Park</strong>").openPopup();

// map.on("click", function (mapE) {
//   mapEvent = mapE;
//   form.classList.toggle("form--hidden");
//   form.classList.toggle("form--transition");
//   inputActivityDropdown.focus();
// });
// //   },
// //   //   error function
// //   () => {
// //     alert("Having trouble getting your location");
// //   }
// // );

// const changeFormActivity = function (selectedActivity) {
//   const inputArray = [inputCadence, inputPlayingActivity, inputBathroomActivity];

//   const unhideInput = function (input) {
//     if (input == "resting" || input == "activity") {
//       inputArray.forEach((i) => i.classList.add("hidden"));
//     }

//     inputArray.filter((i) => {
//       if (i !== input) {
//         i.classList.add("hidden");
//       } else {
//         return i.classList.remove("hidden");
//       }
//     });
//   };

//   if (selectedActivity == "running" || selectedActivity == "walking") {
//     unhideInput(inputCadence);
//   } else if (selectedActivity == "playing") {
//     unhideInput(inputPlayingActivity);
//   } else if (selectedActivity == "bathroom") {
//     unhideInput(inputBathroomActivity);
//   } else if (selectedActivity == "resting") {
//     unhideInput("resting");
//   } else if (selectedActivity == "activity") {
//     unhideInput("activity");
//     btnFormSave.classList.add("hidden");
//   }

//   selectedActivity == "activity" ? inputRemarks.classList.add("hidden") : inputRemarks.classList.remove("hidden");
// };

// inputActivityDropdown.addEventListener("change", function () {
//   const selectedIndex = inputActivityDropdown.selectedIndex;
//   const selectedActivity = allActivityOptions[selectedIndex].value;

//   changeFormActivity(selectedActivity);
//   btnFormSave.classList.remove("hidden");
// });

// form.addEventListener("submit", function (e) {
//   e.preventDefault();

//   allFormInput.forEach((i) => (i.value = ""));

//   const { lat, lng } = mapEvent.latlng;
//   L.marker([lat, lng])
//     .addTo(map)
//     .bindPopup(L.popup({ autoClose: false, closeOnClick: false, className: "new-activity" }))
//     .setPopupContent("New Activity")
//     .openPopup();

//   form.classList.add("form--hidden");
// });
console.log(test);
class App {
  #map;
  #mapEvent;

  constructor() {
    this._loadMap();
    inputActivityDropdown.addEventListener("change", this._toggleActivity);
    form.addEventListener("submit", this._newActivity.bind(this));
  }

  _loadMap() {
    const coords = [51.4412081, -0.2766986];
    this.#map = L.map("map").setView(coords, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
    }).addTo(this.#map);

    // === WELCOME SIGN ===
    // L.marker(coords).addTo(map).bindPopup("Welcome to <strong>Richmond Park</strong>").openPopup();

    this.#map.on("click", this._showForm.bind(this));
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
    console.log("newActivityCalled");
    e.preventDefault();

    allFormInput.forEach((i) => (i.value = ""));

    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(L.popup({ autoClose: false, closeOnClick: false, className: "new-activity" }))
      .setPopupContent("New Activity")
      .openPopup();

    form.classList.add("form--hidden");
    const toHide = [inputRemarks, ...inputArray, btnFormSave];
    toHide.forEach((i) => i.classList.add("hidden"));
  }
}

const app = new App();
