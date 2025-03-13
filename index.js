const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
// Enable CORS
app.use(cors());

//Enables JSON
app.use(express.json());

//Assigns scores to Blood Pressure categories
function BloodPressureScoreGiver(bloodPressure){

  if (bloodPressure === "normal") {
    return 0;
  } else if (category === "elevated") {
    return 15;

  } else if (bloodPressure === "stage 1") {
      return 30;

  } else if (bloodPressure === "stage 2") {
      return 75;

  } else if (bloodPressure === "crisis") {
      return 100;
  }
}

//(WORK IN PROGRESS) This is the API which takes the values, calculates them, and returns to the html site whether or not they're good. 
app.post('/final-calculation', (req, res) => {
  const {weight, feet, inches, age, bloodPressure, familyHistoryCheckboxes} = req.body;

  const bpScore = BloodPressureScoreGiver(bloodPressure);

  //I'm hoping that the final score gets calculated here -Kacper

});



// Wake-up endpoint
app.get('/ping', (req, res) => {
  res.json({ status: 'Server is awake' });
});

// Serve static files (for testing APIs)
app.use(express.static('static'));

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
