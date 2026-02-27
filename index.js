const express = require("express");
const path = require("path");

const app = express();

app.use(express.static("./public"));

app.get("/getTime", async (req, res) => {
  try {
    const city = req.query.city;
    const timeZone = req.query.timeZone;

    if (!city || !timeZone) {
      return res.status(400).json({ error: "city and timeZone is required" });
    }

    const response = await fetch(
      `https://time.now/developer/api/timezone/${timeZone}/${city}`,
    );

    if (!response.ok) {
      return res.status(400).json({ error: "internal server error" });
    }

    const json = await response.json();

    const time = json.datetime.slice(11, 19);

    return res.json({ time });
  } catch (error) {
    console.error(`Some thing went wrong: ${error}`);
    return res.status(500).json({ error: "failed to fetch time" });
  }
});

app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});

app.listen(5000, () => {
  console.log("Server is Up and Runing");
});
