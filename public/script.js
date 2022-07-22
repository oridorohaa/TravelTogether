window.onload = function () {
  let currentMapImg = document.getElementById("map-image");

  let postLocationBtn = document.getElementById("post-location-button");
  let postAddressField = document.getElementById("post-location-field");

  let timelineContainer = document.getElementById("timeline-container");
  let timelineMapImg = document.getElementById("timeline-map");
  let postTime = document.getElementById("post-time");

  let menuBars = document.getElementById("menu-bars");

  let addPostCircleBtnContanier = document.getElementById(
    "newpost-addbtn-container"
  );
  let newLocationOrTripContainer = document.getElementById(
    "location-trip-container"
  );
  let newLocationBtn = document.getElementById("new-location-button");
  // if()
  let newTripBtn = document.getElementById(`new-trip-button`);
  let newTripContainer = document.getElementById("newtrip-container");
  let postTripBtn = document.getElementById("post-trip-button");
  let mediaTripBtn = document.getElementById("media-trip-button");
  // console.log(postTripBtn);
  let postDescriptionInput = document.getElementById("post-description-input");

  let addPostInfoContainer = document.getElementById("newpost-container");
  let onlineStatus = document.getElementById("online-offline");
  let statusCircle = document.getElementById("status-circle");
  let lastSeen = document.getElementById("loc-status-h3");

  // update time ago function
  function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }
  // Updating the Online Status
  function updateStatus(updatedDate) {
    let currentTime = new Date().getTime();
    // remove the timezone thats used to store in the db
    let updated = new Date(user.updatedAt).getTime();
    let fiveMinDiff = 5 * 60 * 1000;
    console.log(updatedDate, "from the database raw");
    console.log(currentTime, "current");
    console.log(updated, "updated");
    console.log(currentTime - fiveMinDiff);
    if (updated >= currentTime - fiveMinDiff) {
      onlineStatus.innerHTML = "online";
      statusCircle.style.backgroundColor = "#50e3c2";
      lastSeen.innerHTML = "Current Location";
    } else {
      onlineStatus.innerHTML = "offline";
      statusCircle.style.backgroundColor = "orange";
      let seen = new Date(user.updatedAt);
      console.log(seen);
      let x = timeSince(seen);
      console.log(x);
      lastSeen.innerHTML = x + " ago";
    }
  }
  updateStatus(user.updatedAt);

  setTimeout(() => {
    if (window.location.hash)
      document
        .getElementById(window.location.hash.slice(1))
        .scrollIntoView({ behavior: "smooth" });
  }, 1);

  colors = [
    "#5FA59B",
    "#C2AAA3",
    "#A8A0B2",
    "#DF9881",
    "#DE8471",
    "#A3B79C",
    "#FE9F9F",
    "#58949C",
  ];
  let placedLines = [];
  let lasttripdotBottom = 0;

  // // ALL TRIPS DELETE PAGE
  let deleteTripsCont = document.getElementById("delete-trips-container");
  console.log(deleteTripsCont, "DELETE trips Cont");
  // function allTripsToDelete(trips) {
  //   trips.map((trip) => {
  //     console.log(trip, "cur trip inside delete all trips function");
  //     let curtrip = document.createElement("trip");
  //     console.log(curtrip, "curtrip CREATED");
  //     curtrip.id = `trip-${trip._id}`;
  //     curtrip.innerHTML = `${trip.location}`;
  //     curtrip.style.fontWeight = "300";
  //     curtrip.style.letterSpacing = "2px";
  //     curtrip.style.color = "#fff";
  //     curtrip.style.fontSize = "17px";
  //     curtrip.style.fontFamily = "Inter";

  //     // deleteTripsCont.appendChild(curtrip);
  //   });
  // }
  //POPULATING USER WITH ALL TRIPS
  function setTripDivs(trips) {
    offset = 45;
    i = 0;
    // tripLinesArr = [];

    let baselineOffset =
      timelineContainer.getBoundingClientRect().left - offset;
    trips.map((trip) => {
      //find the div that matches the trip fromDate and toDate
      // div contains 'location' class -- the thing in common

      let tripDivs = document.querySelectorAll(`.id-${trip._id}`);

      let start = tripDivs[0];
      let finish = tripDivs[1];
      sPosLeft = baselineOffset;

      if (start && finish) {
        //is to access after all the elements  laid out
        let sPos = start.getBoundingClientRect();
        let fPos = finish.getBoundingClientRect();
        sPosScroll = sPos.top + window.scrollY;
        fPosScroll = fPos.top + window.scrollY;

        color = colors[i % colors.length];
        i++;
        let curTripHeight = fPos.top - sPos.top;
        let curMid = sPosScroll + curTripHeight / 2;

        // console.log(trip._id, "TESTING trip id");
        let tripLocation = document.createElement("tripLocation-text");
        tripLocation.id = i;
        tripLocation.className = "tripLocation-text";
        tripLocation.innerHTML = `${trip.location}`;
        tripLocation.style.fontWeight = "500";
        tripLocation.style.writingMode = "vertical-rl";
        tripLocation.style.transform = "scale(-1)";
        tripLocation.style.backgroundColor = "#00000000";
        tripLocation.style.fontSize = "17px";
        tripLocation.style.position = "absolute";
        tripLocation.style.color = color;
        tripLocation.style.fontFamily = "Inter";
        tripLocation.style.whiteSpace = "nowrap";
        tripLocation.style.letterSpacing = "5";

        document.body.appendChild(tripLocation);
        tripLocation.style.top = curMid - tripLocation.offsetHeight / 2;

        let tripLine = document.createElement("tripLine");
        tripLine.className = "tripLine";
        tripLine.id = i;
        tripLine.style.width = "2.6px";
        tripLine.style.height = `${fPos.top - sPos.top}px`;
        tripLine.style.backgroundColor = color;
        tripLine.style.top = sPosScroll;
        tripLine.style.position = "absolute";

        document.body.appendChild(tripLine);

        let x1 = tripLine.offsetTop;
        let x2 = tripLine.offsetTop + tripLine.offsetHeight;
        if (trip.location === "Greece") {
        }
        if (placedLines.length) {
          //get the array of all levels / offsetLefts
          let overlappingLevelsArray = placedLines
            .filter((t) => {
              let y1 = t.offsetTop;
              let y2 = t.offsetTop + t.offsetHeight;

              return Math.max(x1, y1) < Math.min(x2, y2);
            })
            .map((t) => t.offsetLeft);

          // get the last level and add an offset to it
          sPosLeft =
            Math.min(...overlappingLevelsArray, baselineOffset + offset) -
            offset;
          tripLine.style.left = sPosLeft;
        } else {
          tripLine.style.left = sPosLeft;
        }

        placedLines.push(tripLine);

        tripLocation.style.left = sPosLeft - 30;

        let tripDot = document.createElement("tripDot");
        let tripDotBottom = document.createElement("tripDotB");

        tripDot.className = "tripDot";
        tripDot.style.borderRadius = "50%";
        tripDot.style.backgroundColor = color;
        tripDot.style.position = "absolute";
        tripDot.style.height = "14px";
        tripDot.style.width = "14px";
        tripDot.style.left = sPosLeft - 5;
        tripDot.style.top = sPosScroll - 7;

        tripDotBottom.className = "tripDotB";
        tripDotBottom.style.borderRadius = "50%";
        tripDotBottom.style.backgroundColor = color;
        tripDotBottom.style.position = "absolute";
        tripDotBottom.style.height = "14px";
        tripDotBottom.style.width = "14px";
        tripDotBottom.style.left = sPosLeft - 5;
        tripDotBottom.style.top = fPosScroll - 7;

        document.body.appendChild(tripDot);
        document.body.appendChild(tripDotBottom);
        if (tripDotBottom.offsetTop > lasttripdotBottom) {
          lasttripdotBottom = tripDotBottom.offsetTop;
        }
      }
    });
  }
  if (trips) {
    setTripDivs(trips);
    // allTripsToDelete(trips);
  }

  // setting the length of the timeline to equal the position of the last trip container
  // tripcontaner.offSetTop + tripcontainer.offSetHeight
  // or trip dot bottom.offTop  --- whichever one is greater
  let timeline = document.getElementById("timeline-container");
  let tripcontainers = document.getElementsByClassName("content-container");
  if (
    tripcontainers[tripcontainers.length - 1] === undefined &&
    lasttripdotBottom === 0
  ) {
    timeline.style.height = "100vh";
  } else {
    let lastcontainer = tripcontainers[tripcontainers.length - 1];
    if (!lastcontainer || lasttripdotBottom > lastcontainer.offsetTop) {
      timeline.style.height = lasttripdotBottom + 10;
    } else {
      timeline.style.height =
        lastcontainer?.offsetTop + lastcontainer?.offsetHeight;
      console.log(timeline.style.height);
    }
  }

  // Days Separators
  const days = [];

  let today = new Date();
  days.push(today);

  for (let j = 0; j < 50; j++) {
    today = new Date(today);
    today.setDate(today.getDate() - 1);
    today.setHours(0);
    days.push(today);
  }

  console.log(correctUser, "correctUser");
  // Update Current Location
  function updateCurrentMap(latitude, longitude) {
    currentMapImg.src = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=12&size=300x200&key=AIzaSyBKClGaUcZWanoyZGta_wrGZh8t-5q6pu8&style=element:geometry%7Ccolor:0xebe3cd&style=element:labels.text.fill%7Ccolor:0x523735&style=element:labels.text.stroke%7Ccolor:0xf5f1e6&style=feature:administrative%7Celement:geometry.stroke%7Ccolor:0xc9b2a6&style=feature:administrative.land_parcel%7Cvisibility:off&style=feature:administrative.land_parcel%7Celement:geometry.stroke%7Ccolor:0xdcd2be&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xae9e90&style=feature:administrative.neighborhood%7Cvisibility:off&style=feature:landscape.natural%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:poi%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:poi%7Celement:labels.text%7Cvisibility:off&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x93817c&style=feature:poi.park%7Celement:geometry.fill%7Ccolor:0xa5b076&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x447530&style=feature:road%7Celement:geometry%7Ccolor:0xf5f1e6&style=feature:road%7Celement:labels%7Cvisibility:off&style=feature:road.arterial%7Celement:geometry%7Ccolor:0xfdfcf8&style=feature:road.highway%7Celement:geometry%7Ccolor:0xf8c967&style=feature:road.highway%7Celement:geometry.stroke%7Ccolor:0xe9bc62&style=feature:road.highway.controlled_access%7Celement:geometry%7Ccolor:0xe98d58&style=feature:road.highway.controlled_access%7Celement:geometry.stroke%7Ccolor:0xdb8555&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x806b63&style=feature:transit.line%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:transit.line%7Celement:labels.text.fill%7Ccolor:0x8f7d77&style=feature:transit.line%7Celement:labels.text.stroke%7Ccolor:0xebe3cd&style=feature:transit.station%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:water%7Celement:geometry.fill%7Ccolor:0xb9d3c2&style=feature:water%7Celement:labels.text%7Cvisibility:off&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x92998d`;
  }

  let latitude;
  let longitude;
  let username = window.location.pathname.slice(1);
  console.log(username, "username TESTING");
  // update user database with current coordinates
  function updateDBCoordinates(latitude, longitude) {
    fetch("/updateUserLocation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude,
        longitude,
      }),
    })
      .then((e) => e.json())
      // this is sent from the server res.json()
      .then((x) => {
        if (x.status === "success") {
          console.log("user location updated");
        }
      });
  }
  let lastLat;
  let lastLon;
  async function getLastSavedUserCoords(username) {
    let r = await fetch("/getUserCoords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    });
    let x = await r.json();
    if (x.status === "success") {
      console.log(x, "testing X");
      lastLat = x.latitude;
      console.log(lastLat, "inside .then");
      lastLon = x.longitude;
      console.log("pulled latest coords from DB");
    }
  }

  async function success(pos) {
    var crd = pos.coords;
    latitude = crd.latitude;
    longitude = crd.longitude;
    console.log(latitude, "latitude");
    if (correctUser) {
      if (currentMapImg) updateCurrentMap(latitude, longitude);
      updateDBCoordinates(latitude, longitude);
    } else {
      // use the old coordinates that were saved to the database last time user logged in
      await getLastSavedUserCoords(username);
      console.log(lastLat, "LAST LAT from DB");
      console.log(lastLon, "LAST LON from DB");
      updateCurrentMap(lastLat, lastLon);
    }
  }
  let l = navigator.geolocation.getCurrentPosition(success);

  // Post Location Map to Timeline
  let autocompletePost;

  // Toggle Nav Bar
  function toggleNav() {
    menuBars.classList.toggle("change");
    overlay.classList.toggle("overlay-active");
    if (overlay.classList.contains("overlay-active")) {
      overlay.classList.replace("overlay-slide-left", "overlay-slide-right");
    } else {
      overlay.classList.replace("overlay-slide-right", "overlay-slide-left");
    }
  }

  menuBars.addEventListener("click", () => {
    toggleNav();
    if (
      !document
        .getElementById("media-trip-container")
        .classList.contains("hidden")
    ) {
      document.getElementById("media-trip-container").classList.add("hidden");
    }
    if (
      !document
        .getElementById("media-map-container")
        .classList.contains("hidden")
    ) {
      document.getElementById("media-map-container").classList.add("hidden");
    }
  });

  function scrollToElement(pageElement) {
    positionX = 0;
    positionY = 0;

    positionX += pageElement.offsetLeft;
    positionY += pageElement.offsetTop - 250;
    pageElement = pageElement.offsetParent;
    window.scroll(positionX, positionY);
  }

  let timeDividerElements = document.querySelectorAll(".divider-time");
  let pageElement;
  timeDividerElements.forEach((el) => {
    if (el.innerHTML === "Today") {
      pageElement = el;
    }
    if (el.innerHTML === "Today") {
      el.style.color = "#d60909";
      el.style.fontWeight = "500";
    }
  });
  console.log(pageElement, "page element");

  setTimeout(() => {
    scrollToElement(pageElement);
  }, 2);

  // ------------------------------Event Listners----------------------

  postTime.defaultValue = "01-01-2023";

  let mediaPostAddressField = document.getElementById(
    "media-post-location-field"
  );

  let mediaPostTime = document.getElementById("media-post-time");

  mediaPostTime.defaultValue = "01-01-2023";
  // autocompletePlace
  autocompletePost = new google.maps.places.Autocomplete(postAddressField, {
    types: [],
  });

  let mediaAutocompletePost = new google.maps.places.Autocomplete(
    mediaPostAddressField,
    {
      types: [],
    }
  );

  console.log(autocompletePost, "AutocompletePost");
  console.log(mediaAutocompletePost, "media AutoComplete");
  function postLocation(time) {
    // console.log(autocompletePost, "autoPost");
    // console.log(mediaAutocompletePost, "MediaautoPost");
    let l;

    if (!autocompletePost.getPlace()) {
      l = mediaAutocompletePost.getPlace();
    } else {
      l = autocompletePost.getPlace();
    }
    if (!l) {
      alert("Please choose a location");
    } else {
      latitude = l.geometry.location.lat();
      longitude = l.geometry.location.lng();
    }
    console.log(l);
    fetch("/postToTimeline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude,
        longitude,
        date: time.valueAsNumber,
        description: l.name,
      }),
    })
      .then((e) => e.json())
      // this is sent from the server res.json()
      .then((x) => {
        if (x.status === "success") {
          window.location.hash = "id-" + x.id;
          window.location.reload();
        }
      });
  }
  let mediaPostLocationBtn = document.getElementById("media-post-map-button");

  mediaPostLocationBtn.addEventListener("click", () => {
    postLocation(mediaPostTime);
  });

  postLocationBtn.addEventListener("click", () => {
    postLocation(postTime);
  });

  //Add event listner to post description container with specific id
  let currentlyEditing;

  document.addEventListener("click", (e) => {
    let id;
    if (
      e.target.classList.contains("postdescription-text") ||
      e.target.classList.contains("post-desc-div")
    ) {
      let target = e.target.id.split("-");
      id = target[target.length - 1];
      currentlyEditing = id;
    }

    postDescriptionInput = document.getElementById(
      `post-description-input-${id}`
    );

    postDescriptionContainer = document.getElementById(
      `postdescription-text-${id}`
    );
    let postDescInputDiv = document.getElementById(`post-desc-input-div-${id}`);
    let postDescTextDiv = document.getElementById(`post-desc-div-${id}`);

    if (postDescriptionContainer) {
      postDescriptionInput.value = postDescriptionContainer.textContent;
    } else if (postDescriptionInput) {
      postDescriptionInput.value = "";
    }
    postDescInputDiv?.classList.remove("hidden");
    postDescTextDiv?.classList.add("hidden");
    postDescriptionInput?.focus();
    postDescriptionInput?.addEventListener("blur", (e) => {
      if (currentlyEditing) saveDescriptionFromInput(currentlyEditing);
      currentlyEditing = "";
    });
  });

  function saveDescriptionFromInput(id) {
    // saves desc from input box for "id"
    postDescriptionInput = document.getElementById(
      `post-description-input-${id}`
    );

    postDescriptionContainer = document.getElementById(
      `postdescription-text-${id}`
    );
    let description = postDescriptionInput?.value;

    fetch("/postDescrip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        description,
      }),
    })
      .then((e) => e.json())
      // this is sent from the server res.json()
      .then((x) => {
        if (x.status === "success") {
          window.location.reload();
        }
      });
    // switches back to non editing mode
  }

  document.addEventListener("keypress", (e) => {
    if (e.keyCode === 13 && currentlyEditing) {
      saveDescriptionFromInput(currentlyEditing);
      currentlyEditing = "";
    }
  });

  // go back to the original add button
  newLocationOrTripContainer.addEventListener("blur", (e) => {
    newLocationOrTripContainer.classList.add("hidden");
    addPostCircleBtnContanier.classList.remove("hidden");
  });

  let goBackBtnDiv = document.getElementById("trip-goback-button-div");
  let goBackButton = document.getElementById("trip-goback-button");

  // Add new Location Button
  newLocationBtn?.addEventListener("click", () => {
    newLocationOrTripContainer.classList.add("hidden");
    addPostInfoContainer.classList.remove("hidden");
    document.getElementById("post-location-field").focus();
    goBackBtnDiv.classList.remove("hidden");
  });

  // Add new Trip Buttton
  newTripBtn?.addEventListener("click", () => {
    newLocationOrTripContainer.classList.add("hidden");
    newTripContainer.classList.remove("hidden");
    goBackBtnDiv.classList.remove("hidden");
    document.getElementById("new-trip-location").focus();
  });

  // Go Back Button Event Listner

  goBackButton.addEventListener("click", () => {
    if (newTripContainer.classList.contains("hidden")) {
      addPostInfoContainer.classList.add("hidden");
    } else if (addPostInfoContainer.classList.contains("hidden")) {
      newTripContainer.classList.add("hidden");
    }
    newLocationOrTripContainer.classList.remove("hidden");
    goBackBtnDiv.classList.add("hidden");
  });

  // go back to my trip button
  // const loggedInUsename = (name) =>
  //   document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";
  // // console.log(unescape(loggedInUsename("username")), "cookie value");
  // // console.log(curLoggedInUser, "testing cur logged in user ");
  // let curusername = loggedInUsename("username");
  // console.log(curusername);
  // let mytripBtn = document.getElementById("my-trip-button");
  // mytripBtn.addEventListener("click", () => {
  //   fetch(`/${curusername}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     // body: JSON.stringify({}),
  //   })
  //     .then((e) => e.json())
  //     .then((x) => {
  //       if (x.status === "success") {
  //       }
  //     });
  // });

  //DELETING a TRIP
  allTripsBtn = document.getElementById("all-trips-btn");
  allTripsBtn?.addEventListener("click", () => {
    let tripNames = trips.map((trip) => trip.location);
    console.log(tripNames);
    //render all the trip names and delete one by one option
  });

  let newTripFromDate = document.getElementById("new-trip-from-date");
  let newTripToDate = document.getElementById("new-trip-to-date");
  let newTripLocation = document.getElementById("new-trip-location");

  let mediaTripFrom = document.getElementById("media-new-trip-from-date");
  let mediaTripTo = document.getElementById("media-new-trip-to-date");
  let mediaTripLoc = document.getElementById("media-new-trip-location");

  // Post Trip Button
  function postTrip(from, to, loc) {
    let fromDate = new Date(from.value);
    let toDate = new Date(to.value);
    let location = loc.value;

    console.log(location, "location");

    fetch("/newTriptoTimeline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromDate,
        toDate,
        location,
      }),
    })
      .then((e) => e.json())
      .then((x) => {
        if (x.status === "success") {
          window.location.reload();
        }
      });
  }

  postTripBtn.addEventListener("click", () =>
    postTrip(newTripFromDate, newTripToDate, newTripLocation)
  );

  mediaTripBtn.addEventListener("click", () =>
    postTrip(mediaTripFrom, mediaTripTo, mediaTripLoc)
  );

  // MEDIA trip/ map buttons
  document
    .getElementById("media-overlay-trip-btn")
    .addEventListener("click", (e) => {
      console.log("Media Button working ");
      allTripsBtn.classList.add("hidden");
      document.getElementById("media-overlay-trip-btn").classList.add("hidden");
      document.getElementById("media-overlay-map-btn").classList.add("hidden");

      document
        .getElementById("media-trip-container")
        .classList.remove("hidden");

      if (
        !document
          .getElementById("media-map-container")
          .classList.contains("hidden")
      ) {
        console.log("remove");
        document.getElementById("media-map-container").classList.add("hidden");
      }
    });

  document
    .getElementById("media-overlay-map-btn")
    .addEventListener("click", (e) => {
      console.log("map button working");
      document.getElementById("media-overlay-trip-btn").classList.add("hidden");

      document.getElementById("media-map-container").classList.remove("hidden");

      if (
        !document
          .getElementById("media-trip-container")
          .classList.contains("hidden")
      ) {
        console.log("remove");
        document.getElementById("media-trip-container").classList.add("hidden");
      }
    });

  // scrollToElement(pageElement);

  // end window.onload
  function updateTripDivs() {
    let a = document.querySelectorAll("tripLine");
    let b = document.querySelectorAll("tripDot");
    let c = document.querySelectorAll("tripDotB");
    let d = document.querySelectorAll("tripLocation-text");
    a.forEach((x) => x.remove());
    b.forEach((x) => x.remove());
    c.forEach((x) => x.remove());
    d.forEach((x) => x.remove());
    setTripDivs(trips);
  }

  window.onresize = function () {
    updateTripDivs();
  };

  // scrollToElement(pageElement);
};
//end window onload

function updateTripTextOnScroll() {
  let top = window.scrollY;
  let bottom = window.scrollY + window.innerHeight;

  let a = Array.from(document.querySelectorAll("tripLine"));

  let inRangeTrips = a.filter((t) => {
    let tripTop = t.offsetTop;
    let tripBottom = t.offsetTop + t.offsetHeight;

    return (
      (tripTop >= top && tripTop <= bottom) ||
      (tripBottom >= top && tripBottom <= bottom)
    );
  });

  let b = Array.from(document.querySelectorAll("tripLocation-text"));

  b.forEach((b) => {
    //when only visible from the top
    if (b.offsetTop < window.scrollY) {
      let curId = b.id;
      if (inRangeTrips.filter((x) => x.id === curId).length) {
        let curTrip = inRangeTrips.find((t) => t.id === curId);
        if (
          b.offsetHeight <=
          curTrip.offsetHeight - (window.scrollY - curTrip.offsetTop)
        ) {
          b.style.top = window.scrollY;
        }
      }
      //when only visible from the bottom
    } else if (
      b.offsetTop >
      window.scrollY + window.innerHeight - b.offsetHeight
    ) {
      let curId = b.id;
      if (inRangeTrips.filter((x) => x.id === curId).length) {
        let curTrip = inRangeTrips.find((t) => t.id === curId);
        if (
          window.scrollY + window.innerHeight - curTrip.offsetTop >=
          b.offsetHeight
        ) {
          b.style.top = window.scrollY + window.innerHeight - b.offsetHeight;
        }
      }
    }
  });
}

window.onscroll = function () {
  updateTripTextOnScroll();
};

window.initMap = function () {
  console.log("google maps api ready");
};
