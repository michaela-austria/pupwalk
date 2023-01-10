# 🦮 Pupwalk: Dog Walk Tracker

A web application for dog owners where they can log their pet's activities while they're on a walk. They can track the route their dog takes, their activities, and how long they stayed at certain locations. The user can have an option to use a map for either the Richmond Park or their current location.

## Tech Stack

`HTML 5`, `SASS`, `JavaScript`, `Leaflet API`, `Geolocation API`, `localStorage API`, and `Git`

⚡️ This project was mainly built with `ES6 Classes` and `Vanilla JavaScript (VanillaJS)`. `SweetAlert` was integrated for alert popup messages pretty.

## Features

- A map where user clicks to add a new route/activity.
- Form to input the dog's time-in, time-out, activities, and any owner's notes. Timespent and Log Date is automatically computed.
- Display all activities in a list and on a map.
- Storing route/activity data in browser using local storage API

## App Screens

![App Screen](./appscreens.png)

## Flowchart

![Flowchart](./flowchart.png)

## Lessons Learned

This was the first project where I use `ES6 Classes` to structure my code. It does make the project architecure much cleaner and I was able to separate the application logic and the data.
![Proj Architecture](./projarchitecture.png)

I also learned easy it was to get the current user location and integrate it to a map. In this few lines of code using `Geolocation API`, we can already get the user's current location.

```code
 navigator.geolocation.getCurrentPosition(success_function,error_function)
```

The `success_function` is where we can access the user's current location and use their coordinates to integrate to any map API.

> 💡 In this application, I used the code above for the user's to get their current coordinates, and integrate LeafletAPI. Meanwhile for a specific location such as the Richmond Park, I hardcoded its coordinates to the API.

I hit a roadblock while doing this project when I wanted to add a functionality where the user can have their own location as an option on the map. My initial code was the coordinates of Richmond Park were hardcoded to the LeafletAPI. I was planning to have another function, get the user's current location, and integrate their coordinates to the LeafletAPI code. It looks doable, however, I found out that once the map or the LeafletAPI was initialized, it's impossible for it to be re-initialized.

**SO HERE'S WHAT I DID**

- I created a a new function to _remove_ the element container of the map where the LeafletAPI was initialized,
- re-created that container element setting the same classnames and id _programmatically_.
- Afterwards, Geolocation was used to get the current location of the user,
- and pass the coordinates to a function where the Leaflet API will be initialized.

```
_loadMap(position) {
    const { latitude, longitude } = position.coords;

    const coords = [latitude, longitude];
    this.#map = L.map("map").setView(coords, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      maxZoom: this.#mapZoomLevel,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
    }).addTo(this.#map);
  }

_removeAndCreateMap() {
    mapContainer.remove();

    mapContainer = document.createElement("div");
    mapContainer.setAttribute("id", "map");
    mapContainer.setAttribute("class", "map-container");
    container.insertAdjacentElement("beforeend", mapContainer);
  }

  _loadCurrentLoc() {
    this._removeAndCreateMap();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        alert("Having trouble getting your location");
      });
    }
  }
```

> 💡 In the final output of this project, I decided to let the user choose which location they want to load on the map upfront. Therefore, the _removeAndCreateMap()_ is NO longer needed since the alert function will be prompted everytime the app is initialized. If the user decided to change location after the map was already loaded, the app/browser will reload, then the app will be initialized again, which will then trigger the alert function...

I was able to integrate a simple and easy way to have store data using `localStorageAPI`. This API is advisable to use for small amounts of data.

```
  //STORING THE OBJECT TO localStorageAPI
  _setLocalStorage() {
    localStorage.setItem("activity", JSON.stringify(this.#activityEntries));
  }


  //GETTING THE DATA FROM localStorageAPI AND PUT IT INTO USE IN THE APPLICATION
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("activity"));

    if (!data) return;

    this.#activityEntries = data;
    this.#activityEntries.forEach((activityData) => this._renderActivity(activityData));
  }
```

> ⚠️ I am encountering a problem, even though the data is being persistent in the application. I found out that once the user picked a differnt location, the map will still load the location based on the coordinates of the data stored... The user will have to reset their data in order for them to use the other map... _If you have a good solution or idea on this, feel free to reach out to me :)_

## Run Locally

Install dependencies (this will install `sass` and `live-server`)

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## License

> Read license [here](LICENSE.txt)
