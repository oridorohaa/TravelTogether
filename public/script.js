window.onload = function () {
  const toggleSwitch = document.querySelector("input[type='checkbox']");
  const toggleIcon = document.getElementById("toggle-icon");

  let currentLocationBtn = document.getElementById("location-button");
  let currentAddressField = document.getElementById("current-location-field");
  let currentMapImg = document.getElementById("map-image");

  let postLocationBtn = document.getElementById("post-location-button");
  let postAddressField = document.getElementById("post-location-field");

  let dailyContentContainer = document.getElementById("content-container");
  let timelineMapImg = document.getElementById("timeline-map");
  let postTime = document.getElementById("post-time");

  let quoteText = document.getElementById("quote-text");
  let apiQoutes = [];

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

  let logOutBtn = document.getElementsByClassName("logout");

  let deleteBtnDiv = document.getElementById("delete-button-div");

  let dividers = document.querySelectorAll(".day-divider-container");
  // let tripDividers = document.querySelectorAll(".trip-divider-container");

  colors = [
    "#5FA59B",
    "#C3A4D1",
    "#F3E7B1",
    "#DF9881",
    "#CB5A55",
    "#E6E8C4",
    "#FF7A4E",
    "#58949C",
  ];

  function setTripDivs(trips) {
    offset = 25;
    i = 0;
    trips.map((trip) => {
      //find the div that matches the trip fromDate and toDate
      // div contains 'location' class -- the thing in common

      let tripDivs = document.querySelectorAll(`.id-${trip._id}`);

      let s = tripDivs[0];
      let f = tripDivs[1];
      // console.log(s, f);
      if (s && f) {
        let sPos = s.getBoundingClientRect();
        let fPos = f.getBoundingClientRect();
        sPosScroll = sPos.top + window.scrollY;
        fPosScroll = fPos.top + window.scrollY;

        sPosLeft = sPos.right + window.scrollX - offset;
        fPosLeft = fPos.right + window.scrollX - offset;
        color = colors[i % colors.length];
        i++;
        offset += 45;

        let tripLocation = document.createElement("tripLocation-text");
        tripLocation.className = "tripLocation-text";
        tripLocation.innerHTML = `${trip.location}`;
        tripLocation.style.fontWeight = "bold";
        tripLocation.style.letterSpacing = "3px";
        tripLocation.style.writingMode = "vertical-rl";
        tripLocation.style.backgroundColor = "#00000000";
        tripLocation.style.fontSize = "30px";
        tripLocation.style.position = "absolute";
        tripLocation.style.top = sPosScroll + 200;
        tripLocation.style.color = color;
        tripLocation.style.left = sPosLeft - 27;
        tripLocation.style.height = 200;
        tripLocation.style.fontFamily = "Oswald";

        let tripLine = document.createElement("tripLine");
        tripLine.className = "tripLine";
        tripLine.style.width = "4px";
        tripLine.style.height = `${fPos.top - sPos.top}px`;
        tripLine.style.backgroundColor = color;
        tripLine.style.top = sPosScroll;
        tripLine.style.left = sPosLeft;
        tripLine.style.position = "absolute";

        let tripDot = document.createElement("tripDot");
        let tripDotBottom = document.createElement("tripDotB");

        tripDot.className = "tripDot";
        tripDot.style.borderRadius = "50px";
        tripDot.style.backgroundColor = color;
        tripDot.style.position = "absolute";
        tripDot.style.height = "15px";
        tripDot.style.width = "15px";
        tripDot.style.left = sPosLeft - 6;
        tripDot.style.top = sPosScroll - 7;

        tripDotBottom.className = "tripDotB";
        tripDotBottom.style.borderRadius = "50px";
        tripDotBottom.style.backgroundColor = color;
        tripDotBottom.style.position = "absolute";
        tripDotBottom.style.height = "15px";
        tripDotBottom.style.width = "15px";
        tripDotBottom.style.left = fPosLeft - 6;
        tripDotBottom.style.top = fPosScroll - 7;

        document.body.appendChild(tripLocation);
        document.body.appendChild(tripDot);
        document.body.appendChild(tripDotBottom);
        document.body.appendChild(tripLine);
      }
    });
  }
  if (trips) {
    setTripDivs(trips);
  }
  // TEST CASE ---->
  // console.log("TRIP dividers:", tripDividers);
  // let s = dividers[0];
  // let f = dividers[1];

  // console.log(s, "Start Divider");

  // let sPos = s.getBoundingClientRect();
  // let fPos = f.getBoundingClientRect();

  // sPosScroll = sPos.top + window.scrollY;
  // fPosScroll = fPos.top + window.scrollY;

  // // the size of the new div will be (fPos - sPos)px

  // let tripLine = document.createElement("tripLine");
  // tripLine.className = "tripLine";
  // tripLine.style.width = "4px";
  // tripLine.style.height = `${fPos.top - sPos.top}px`;
  // tripLine.style.backgroundColor = "black";
  // tripLine.style.top = sPosScroll + 46;
  // tripLine.style.position = "absolute";

  // let tripDot = document.createElement("tripDotT");
  // let tripDotBottom = document.createElement("tripDotB");

  // tripDot.className = "tripDot";
  // tripDot.style.borderRadius = "50px";
  // tripDot.style.backgroundColor = "black";
  // tripDot.style.position = "absolute";
  // tripDot.style.height = "15px";
  // tripDot.style.width = "15px";
  // tripDot.style.top = sPosScroll + 46;

  // tripDotBottom.className = "tripDotB";
  // tripDotBottom.style.borderRadius = "50px";
  // tripDotBottom.style.backgroundColor = "black";
  // tripDotBottom.style.position = "absolute";
  // tripDotBottom.style.height = "15px";
  // tripDotBottom.style.width = "15px";
  // tripDotBottom.style.top = fPosScroll + 36;

  // document.body.appendChild(tripDot);
  // document.body.appendChild(tripDotBottom);
  // document.body.appendChild(tripLine);
  // console.log("TRIPLINE----->", tripLine);
  // console.log("TRIPDOT----->", tripDot);

  // console.log(s, f, "start and finish");
  // console.log(sPosScroll, "sPos with SCROLL");
  // console.log(fPosScroll, "fPos with SCROLL");

  //Light / Dark Modes
  //DRY CODE --- putting two functions into one using turnary
  function toggleDarkLightMode(isDark) {
    nav.style.backgroundColor = isDark
      ? "rgb(0 0 0 / 50%)"
      : "rgb(255 255 255 /50%)";

    console.log(toggleIcon.children, "toggle children");
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

  console.log("Hello World");
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
    console.log("Map SRC Working");
  }

  let latitude;
  let longitude;
  function success(pos) {
    var crd = pos.coords;
    latitude = crd.latitude;
    longitude = crd.longitude;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    if (currentMapImg) updateCurrentMap(latitude, longitude);
  }

  let l = navigator.geolocation.getCurrentPosition(success);
  console.log(latitude, "latitude");
  console.log(longitude, "longitude");

  let autocomplete;

  // Post Location Map to Timeline
  let autocompletePost;

  // Show New Quote
  function newQuote() {
    const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
    quoteText.textContent = quote.text;

    // Check quote length to determine the css style
    if (quote.text.length > 70) quoteText.classList.add("long-quote");
    else quoteText.classList.remove("long-quote");
  }

  // Quote API
  async function getQuotes() {
    const apiURL = "https://type.fit/api/quotes";
    try {
      let response = await fetch(apiURL);
      apiQuotes = await response.json();
      console.log(apiQuotes[4]);
      newQuote();
    } catch (error) {
      console.log("whoops cant get api:", error);
    }
  }

  // Theme Changes
  toggleSwitch?.addEventListener("change", switchTheme);
  // Check Local Storage for Theme

  const currentTheme = localStorage.getItem("theme");
  // always check if it exists first before you try to retreave it
  if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (currentTheme === "dark" && toggleSwitch) {
      toggleSwitch.checked = true;
      toggleDarkLightMode(true);
    }
  }

  // Toggle Nav Bar
  function toggleNav() {
    // Toggle: Menu Bars Open/Closed
    menuBars.classList.toggle("change");
    //   Toggle: Menu Active
    overlay.classList.toggle("overlay-active");
    if (overlay.classList.contains("overlay-active")) {
      //   Animate In - Overlay
      //    substitute remove()/add()  with replace()
      overlay.classList.replace("overlay-slide-left", "overlay-slide-right");
      // Animate In -Nav Items
      // navAmination("out", "in");
    } else {
      //Animate Out - Overlay

      overlay.classList.replace("overlay-slide-right", "overlay-slide-left");
      // Animate Out -Nav Items
      // navAmination("in", "out");
    }
  }

  // function scrollToElement(pageElement) {
  //     var positionX = 0,
  //         positionY = 0;

  //     while(pageElement != null){
  //         positionX += pageElement.offsetLeft;
  //         positionY += pageElement.offsetTop;
  //         pageElement = pageElement.offsetParent;
  //         window.scrollTo(positionX, positionY);
  //     }
  // }

  function scrollToElement(pageElement) {
    positionX = 0;
    positionY = 0;

    console.log("SCROLL TO FUNCTION");

    // while (pageElement !== null) {
    positionX += pageElement.offsetLeft;
    positionY += pageElement.offsetTop - 100;
    pageElement = pageElement.offsetParent;
    window.scrollTo(positionX, positionY);
    // }
  }

  let timeDividerElements = document.querySelectorAll(".divider-time");
  let pageElement;
  timeDividerElements.forEach((el) => {
    if (el.innerHTML === "Yesterday") {
      pageElement = el;
    }
  });
  console.log(pageElement, "PAGE ELEMENT");

  // On Load
  // getQuotes();

  // ------------------------------Event Listners----------------------
  menuBars?.addEventListener("click", toggleNav);

  // Update current location
  // currentLocationBtn.addEventListener("click", () => {
  //   let l = autocomplete.getPlace();
  //   if (!l) {
  //     //show error somehow
  //     alert("Please choose a location.");
  //   } else {
  //     console.log(l);
  //     latitude = l.geometry.location.lat();
  //     longitude = l.geometry.location.lng();
  //     updateCurrentMap(latitude, longitude);
  //   }
  // });
  // Post Location Map to Timeline
  postLocationBtn.addEventListener("click", () => {
    let l = autocompletePost.getPlace();
    if (!l) {
      alert("Please choose a location");
    } else {
      latitude = l.geometry.location.lat();
      longitude = l.geometry.location.lng();
      // updateTimelineNewMap(latitude, longitude);
    }
    fetch("/postToTimeline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude,
        longitude,
        date: postTime.valueAsNumber,
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

  // Add Post Description Button
  let isEditing = false;
  descriptionButtonClicked = function (id) {
    console.log(id);
    console.log("button working");
    postDescriptionInput = document.getElementById(
      `post-description-input-${id}`
    );

    postDescriptionContainer = document.getElementById(
      `postdescription-text-${id}`
    );
    let postDescInputDiv = document.getElementById(`post-desc-input-div-${id}`);
    let postDescTextDiv = document.getElementById(`post-desc-div-${id}`);

    let description = postDescriptionInput?.value;
    if (isEditing) {
      // console.log(postDescriptionContainer?.value, "postDescContainer. VALUE");
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
      console.log("added description");
      // postDescriptionInput.classList.add("hidden");
    } else {
      isEditing = true;
      console.log(description, "DESCRIPTION");
      if (postDescriptionContainer) {
        postDescriptionInput.value = postDescriptionContainer.textContent;
      } else {
        postDescriptionInput.value = "";
      }
      postDescInputDiv?.classList.remove("hidden");
      postDescTextDiv?.classList.add("hidden");
      // description = postDescriptionInput?.value;
      // fetch("/editDescrip", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     id,
      //     description,
      //   }),
      // })
      //   .then((e) => e.json())
      //   .then((x) => {
      //     if (x.status === "success") {
      //       // window.location.reload();
      //     }
      // });

      // clicked = false;
      console.log("edited description");
    }
  };

  // Click on Post Description

  // Add + Add Post button
  addPostCircleBtnContanier.addEventListener("click", () => {
    console.log("circle + button is working");
    addPostCircleBtnContanier.classList.add("hidden");
    console.log(addPostCircleBtnContanier, "circle container");
    console.log(newLocationOrTripContainer, "container");
    newLocationOrTripContainer.classList.remove("hidden");
  });

  let goBackBtnDiv = document.getElementById("trip-goback-button-div");
  let goBackButton = document.getElementById("trip-goback-button");
  // Add new Location Button
  newLocationBtn.addEventListener("click", () => {
    newLocationOrTripContainer.classList.add("hidden");
    addPostInfoContainer.classList.remove("hidden");
    goBackBtnDiv.classList.remove("hidden");
  });

  // Add new Trip Buttton
  newTripBtn.addEventListener("click", () => {
    newLocationOrTripContainer.classList.add("hidden");
    console.log(newTripContainer, "new trip Container");
    newTripContainer.classList.remove("hidden");
    goBackBtnDiv.classList.remove("hidden");
  });

  // Go Back Button Event Listner

  goBackButton.addEventListener("click", () => {
    console.log("INSIDE GOBACK BUTTON");
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
    console.log(newTripFromDate.value, "from Date VALUE");
    console.log(newTripLocation.value, "new trip location VALUE");
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

  // deleteBtnDiv.addEventListener("mouseover", () => {
  //   console.log("MOUSEOVER WORKING");
  //   let deleteBtnForm = document.getElementById("delete-button-form");
  //   deleteBtnForm.classList.remove("hidden");
  // });
  // autocomplete = new google.maps.places.Autocomplete(currentAddressField, {
  //   types: ["(cities)"],
  // });
  autocompletePost = new google.maps.places.Autocomplete(postAddressField, {
    types: ["(cities)"],
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
    console.log("resizing function");
    setTripDivs(trips);
  }

  window.onresize = function () {
    updateTripDivs();
  };
};

window.initMap = function () {
  console.log("google maps api ready");
};
// export { initMap };
