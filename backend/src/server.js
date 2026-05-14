import "dotenv/config";
import app from "./app.js";

const port = Number(process.env.PORT) || 4000;

// Test route
app.get("/", (req, res) => {
  res.send("API Server is running");
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
