const app = require("../app");
const port = 3000;

app.listen(port, () => {
  console.log(`Server can be access in http://localhost:${port}`);
});
