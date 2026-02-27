const emoji = document.querySelector(".emoji");
const timer = document.querySelector(".Timer");
const button =
  document.getElementById("submitButton") || document.querySelector(".button");

const applyThemeByHour = (hours) => {
  if (hours >= 4 && hours < 7) {
    document.body.style.backgroundImage = "url('background-dawn.jpg')";
    emoji.innerHTML = "🌅";
    return;
  }
  if (hours >= 7 && hours < 18) {
    document.body.style.backgroundImage = "url('background-morning.jpg')";
    emoji.innerHTML = "☀️";
    return;
  }
  document.body.style.backgroundImage = "url('background-night.jpg')";
  emoji.innerHTML = "🌙";
};

if (button) {
  button.addEventListener("click", async function () {
  const form = document.querySelector(".location");
  const formData = new FormData(form);
  const city = (formData.get("city") || "").toString().trim();
  const timeZone = (formData.get("timeZone") || "").toString().trim();
  if (!city && !timeZone) {
    console.error("City or timezone is required");
    return;
  }
  try {
    const response = await fetch(
      `/getTime?city=${encodeURIComponent(city)}&timeZone=${encodeURIComponent(timeZone)}`,
    );
    if (response.ok) {
      const data = await response.json();
      const timeElement = document.querySelector(".Timer");
      timeElement.textContent = data.time;
      checkVal();
    } else {
      const data = await response.json();
      console.error(data.error || "Error fetching time data");
    }
  } catch (error) {
    console.error("Error fetching time data", error);
  }
  });
}

const checkVal = () => {
  const timeArray = timer.textContent.split(":");
  const hours = parseInt(timeArray[0], 10);
  if (Number.isNaN(hours)) return;

  applyThemeByHour(hours);
};

const Counter = () => {
  setInterval(() => {
    const [hours, minutes, seconds] = timer.textContent.split(":").map(Number);
    if ([hours, minutes, seconds].some((value) => Number.isNaN(value))) {
      return;
    }
    const date = new Date();
    date.setHours(hours, minutes, seconds + 1);
    timer.textContent = date.toTimeString().slice(0, 8);
    checkVal();
  }, 1000);
};

Counter();
checkVal();
