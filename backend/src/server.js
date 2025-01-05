const express = require("express");
const AWS = require("aws-sdk");
const app = express();
const port = 3000;

const ec2 = new AWS.EC2({ region: "us-east-1" });
const GUACAMOLE_SERVER = "http://<your-guacamole-server>:4822";

app.use(express.json());

// Start VM endpoint
app.post("/api/start-vm", async (req, res) => {
  try {
    const instanceId = "your-ec2-instance-id";
    await ec2.startInstances({ InstanceIds: [instanceId] }).promise();

    // Simulate Guacamole URL generation
    const guacamoleUrl = `${GUACAMOLE_SERVER}/#/client/<connection-id>`;
    res.json({ guacamoleUrl });
  } catch (error) {
    res.status(500).json({ error: "Failed to start VM" });
  }
});

// Stop VM endpoint
app.post("/api/stop-vm", async (req, res) => {
  try {
    const instanceId = "your-ec2-instance-id";
    await ec2.stopInstances({ InstanceIds: [instanceId] }).promise();
    res.json({ message: "VM stopped" });
  } catch (error) {
    res.status(500).json({ error: "Failed to stop VM" });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
