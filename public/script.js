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
  let newTripBtn = document.getElementById("new-trip-button");
  let newTripContainer = document.getElementById("newtrip-container");
  let postTripBtn = document.getElementById("post-trip-button");

  let postDescriptionInput = document.getElementById("post-description-input");

  let addPostInfoContainer = document.getElementById("newpost-container");

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

        let tripLocation = document.createElement("tripLocation-text");
        tripLocation.id = i;
        tripLocation.className = "tripLocation-text";
        tripLocation.innerHTML = `${trip.location}`;
        tripLocation.style.fontWeight = "500";
        tripLocation.style.letterSpacing = "3px";
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
      }
    });
  }
  if (trips) {
    setTripDivs(trips);
  }
  //Light / Dark Modes
  //DRY CODE --- putting two functions into one using turnary
  function toggleDarkLightMode(isDark) {
    nav.style.backgroundColor = isDark
      ? "rgb(0 0 0 / 50%)"
      : "rgb(255 255 255 /50%)";

    // to target all elements of the same parent <div>
    toggleIcon.children[0].textContent = isDark ? "Dark Mode" : "Light Mode";
    //Dry Code
    isDark
      ? toggleIcon.children[1].classList.replace("fa-sun", "fa-moon")
      : toggleIcon.children[1].classList.replace("fa-moon", "fa-sun");
  }

  // Switch Theme Dynamically
  function switchTheme(event) {
    if (event.target.checked) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      toggleDarkLightMode(true);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      toggleDarkLightMode(false);
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

  // Update Current Location
  function updateCurrentMap(latitude, longitude) {
    currentMapImg.src = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=12&size=300x200&key=AIzaSyBKClGaUcZWanoyZGta_wrGZh8t-5q6pu8&style=element:geometry%7Ccolor:0xebe3cd&style=element:labels.text.fill%7Ccolor:0x523735&style=element:labels.text.stroke%7Ccolor:0xf5f1e6&style=feature:administrative%7Celement:geometry.stroke%7Ccolor:0xc9b2a6&style=feature:administrative.land_parcel%7Cvisibility:off&style=feature:administrative.land_parcel%7Celement:geometry.stroke%7Ccolor:0xdcd2be&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xae9e90&style=feature:administrative.neighborhood%7Cvisibility:off&style=feature:landscape.natural%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:poi%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:poi%7Celement:labels.text%7Cvisibility:off&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x93817c&style=feature:poi.park%7Celement:geometry.fill%7Ccolor:0xa5b076&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x447530&style=feature:road%7Celement:geometry%7Ccolor:0xf5f1e6&style=feature:road%7Celement:labels%7Cvisibility:off&style=feature:road.arterial%7Celement:geometry%7Ccolor:0xfdfcf8&style=feature:road.highway%7Celement:geometry%7Ccolor:0xf8c967&style=feature:road.highway%7Celement:geometry.stroke%7Ccolor:0xe9bc62&style=feature:road.highway.controlled_access%7Celement:geometry%7Ccolor:0xe98d58&style=feature:road.highway.controlled_access%7Celement:geometry.stroke%7Ccolor:0xdb8555&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x806b63&style=feature:transit.line%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:transit.line%7Celement:labels.text.fill%7Ccolor:0x8f7d77&style=feature:transit.line%7Celement:labels.text.stroke%7Ccolor:0xebe3cd&style=feature:transit.station%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:water%7Celement:geometry.fill%7Ccolor:0xb9d3c2&style=feature:water%7Celement:labels.text%7Cvisibility:off&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x92998d`;
  }

  let latitude;
  let longitude;
  function success(pos) {
    var crd = pos.coords;
    latitude = crd.latitude;
    longitude = crd.longitude;

    if (currentMapImg) updateCurrentMap(latitude, longitude);
  }

  let l = navigator.geolocation.getCurrentPosition(success);

  let autocomplete;

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

  menuBars.addEventListener("click", toggleNav);

  function scrollToElement(pageElement) {
    positionX = 0;
    positionY = 0;

    positionX += pageElement.offsetLeft;
    positionY += pageElement.offsetTop - 100;
    pageElement = pageElement.offsetParent;
    window.scrollTo(positionX, positionY);
  }

  let timeDividerElements = document.querySelectorAll(".divider-time");
  let pageElement;
  timeDividerElements.forEach((el) => {
    if (el.innerHTML === "Yesterday") {
      pageElement = el;
    }
  });

  // ------------------------------Event Listners----------------------

  postTime.defaultValue = "01-01-2023";

  postLocationBtn.addEventListener("click", () => {
    let l = autocompletePost.getPlace();
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
        date: postTime.valueAsNumber,
        description: l.name,
      }),
    })
      .then((e) => e.json())
      // this is sent from the server res.json()
      .then((x) => {
        if (x.status === "success") {
          window.location.reload();
        }
      });
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
  newLocationBtn.addEventListener("click", () => {
    newLocationOrTripContainer.classList.add("hidden");
    addPostInfoContainer.classList.remove("hidden");
    document.getElementById("post-location-field").focus();
    goBackBtnDiv.classList.remove("hidden");
  });

  // Add new Trip Buttton
  newTripBtn.addEventListener("click", () => {
    newLocationOrTripContainer.classList.add("hidden");
    newTripContainer.classList.remove("hidden");
    goBackBtnDiv.classList.remove("hidden");
    console.log(document.getElementById("new-trip-location"), "TESTING");
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

  let newTripFromDate = document.getElementById("new-trip-from-date");
  let newTripToDate = document.getElementById("new-trip-to-date");
  let newTripLocation = document.getElementById("new-trip-location");

  // Post Trip Button
  postTripBtn.addEventListener("click", () => {
    let fromDate = new Date(newTripFromDate.value);
    let toDate = new Date(newTripToDate.value);
    let location = newTripLocation.value;

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
  });

  // MEDIA trip/ map buttons
  document
    .getElementById("media-overlay-trip-btn")
    .addEventListener("click", (e) => {
      console.log("Media Button working ");
      document.getElementById("media-overlay-trip-btn").classList.add("hidden");
      document.getElementById("media-overlay-map-btn").classList.add("hidden");

      document
        .getElementById("media-trip-container")
        .classList.remove("hidden");
    });

  autocompletePost = new google.maps.places.Autocomplete(postAddressField, {
    types: [],
  });

  // autocompletePlace

  scrollToElement(pageElement);

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
};

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
