const express = require("express");
const { spawn } = require("child_process");
const router = express.Router();

router.post("/run-script", (req, res) => {
  const script = spawn("node", ["./script_node.js"]);

  script.stdout.on("data", (data) => {
    console.log(`Salida: ${data}`);
  });

  script.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
  });

  script.on("close", (code) => {
    if (code === 0) {
      res.status(200).json({ message: "Script ejecutado con éxito." });
    } else {
      res.status(500).json({ message: "Error al ejecutar el script." });
    }
  });
});

module.exports = router;
