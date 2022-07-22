window.onload = function () {
  // ALL TRIPS DELETE PAGE
  let deleteTripsCont = document.getElementById("delete-trips-container");

  let months = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jly",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };

  function allTripsToDelete(trips) {
    trips.map((trip) => {
      let form = document.createElement("form");
      deleteTripsCont.appendChild(form);
      form.id = `form-${trip._id}`;
      let curForm = document.getElementById(`form-${trip._id}`);

      let curtrip = document.createElement("button");
      curtrip.id = `trip-${trip._id}`;
      curtrip.classList.add("trips");
      let from = new Date(trip.fromDate);
      let fromM = from.getMonth();
      let fromMonth = months[fromM];
      let to = new Date(trip.toDate);
      let toM = to.getMonth();
      let toMonth = months[toM];

      curtrip.innerHTML = `${
        trip.location
      } (${fromMonth} ${from.getDate()}, ${from.getFullYear()} - ${toMonth} ${to.getDate()}, ${to.getFullYear()}
      )`;
      curtrip.style.fontWeight = "300";
      curtrip.style.letterSpacing = "2px";
      curtrip.style.color = "#fff";
      curtrip.style.fontSize = "17px";
      curtrip.style.background = "none";
      curtrip.style.fontFamily = "Inter";
      curtrip.style.padding = "10px";
      curtrip.style.boxShadow = "none";
      // curtrip.style.justifyContent = "left";
      curtrip.style.textTransform = "none";
      curtrip.style.textAlign = "left";

      curForm.appendChild(curtrip);
    });
  }
  allTripsToDelete(trips);

  // deleting a trip

  let ques = document.getElementById("delete-ques-h2");
  let yesnoBtns = document.getElementById("yes-no-btns-container");
  let yesBtn = document.getElementById("yes-btn");
  let noBtn = document.getElementById("no-btn");
  let curTripToDelete = document.getElementById("cur-trip-to-delete");
  let curTripName = document.getElementById("cur-trip-name");
  let currentlyEditing;
  let curTextContent;

  document.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("hello");
    console.log(e.target, "E.TARGET");
    let id;
    if (e.target.classList.contains("trips")) {
      let target = e.target.id.split("-");
      id = target[target.length - 1];
      currentlyEditing = id;
      curTextContent = e.target.textContent;
      console.log(currentlyEditing, "TESTING currently editing");
    }
    ques.classList.remove("hidden");
    yesBtn.classList.remove("hidden");
    noBtn.classList.remove("hidden");
    curTripToDelete.innerHTML = "selected trip:";
    curTripName.innerHTML = `${curTextContent}`;
    window.scrollTo(0, 0);
  });

  noBtn.addEventListener("click", () => {
    console.log("no button working");
    // ques.classList.add("hidden");
    // yesBtn.classList.add("hidden");
    // yesnoBtns.classList.add("hidden");
    // noBtn.classList.add("hidden");
    // curTripName.classList.add("hidden");
    // curTripToDelete.classList.add("hidden");
    window.location.reload();
  });

  function deleteCurrentTrip(id) {
    fetch(`/deleteTrip/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then((e) => e.json())
      // this is sent from the server res.json()
      .then((x) => {
        if (x.status === "success") {
          console.log("WORKING");
          window.location.reload();
        }
      });
  }

  yesBtn.addEventListener("click", () => {
    deleteCurrentTrip(currentlyEditing);
  });

  //end window.onload
};
