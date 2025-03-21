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
  } else if (bloodPressure === "elevated") {
    return 15;

  } else if (bloodPressure === "stage 1") {
      return 30;

  } else if (bloodPressure === "stage 2") {
      return 75;

  } else if (bloodPressure === "crisis") {
      return 100;
  }
  return 0;
}
function AgeScoreGiver(age){
  if(age<30){
    return 0;
  }else if(age<45){
    return 10;
  }else if(age<60){
    return 20;
  }else{
    return 30;
  }
}
function FamilyHistoryScoreGiver(familyHistoryCheckboxes) {
  let total = 0;
  if (familyHistoryCheckboxes.includes("diabetes")) {
    total += 10;
  }
  if (familyHistoryCheckboxes.includes("cancer")) {
    total += 10;
  }
  if (familyHistoryCheckboxes.includes("alzheimer")) {
    total += 10;
  }
  return total;
}
// Calculate BMI and return the score
function BMICalculator(weight, feet, inches) {
  const heightInMeters = HeightConverter(feet, inches);
  const weightInKg = WeightConverter(weight);
  const BMI = (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);
  const category = CategoryBMI(BMI);
  const score = BMIScoreGiver(category);
  return {BMI, category, score};
}

// Assign scores based on BMI category
function BMIScoreGiver(category) {
  if (category === "underweight" || category === "normal") {
    return 0;
  } else if (category === "overweight") {
    return 30;
  } else {
    return 75;
  }
}

// Determine BMI category
function CategoryBMI(BMI) {
  if (BMI <= 18.4) {
    return "underweight";
  } else if (BMI <= 24.9) { 
    return "normal";
  } else if (BMI <= 29.9) { 
    return "overweight";
  } else {
    return "obesity";
  }
}


// Convert weight from pounds to kilograms
function WeightConverter(weight) {
  return weight * 0.45359237;
}

// Convert height from feet and inches to meters
function HeightConverter(feet, inches) {
  const totalInches = feet * 12 + inches;
  const heightInMeters = totalInches * 0.0254;
  return heightInMeters;
}

function riskCategoryFinder(theFinalScore){
  if (theFinalScore <= 20){
    return "low risk";

  } else if (theFinalScore <= 50){
      return "moderate risk";

  } else if (theFinalScore <= 75){
    return "high risk";

  } else {
      return "uninsurable";
  }

}




//(WORK IN PROGRESS) This is the API which takes the values, calculates them, and returns to the html site whether or not they're good. 
app.post('/calculate-risk', (req, res) => {
  
  try {
    const {weight, feet, inches, age, bloodPressure, familyHistoryCheckboxes} = req.body;

  if (!weight || !feet || !inches || !age || !bloodPressure || !familyHistoryCheckboxes) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }

  // Calculate individual scores
  const bpScore = BloodPressureScoreGiver(bloodPressure);
  const ageScore = AgeScoreGiver(age);
  const familyHistoryScore = FamilyHistoryScoreGiver(familyHistoryCheckboxes);
  const { BMI, category, score: bmiScore } = BMICalculator(weight, feet, inches);

  // Calculate the final score
  const finalScore = bpScore + ageScore + familyHistoryScore + bmiScore;

  //Determine the final category
  const riskCategory = riskCategoryFinder(finalScore);

  // Return the result
  res.json({
    status: 'success',
    finalScore: finalScore,
    BMI: BMI,
    BMICategory: category,
    riskCategory: riskCategory,
    message: `Your calculated score is ${finalScore}.`
  });
} catch (error) {
  console.error(error);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


//Test Api- we can use it before we will enter to final api
app.post('/test-api', (req, res) => {
  try {
    const { weight, feet, inches, age, bloodPressure, familyHistoryCheckboxes } = req.body;

    // Validating required fields
    if (!weight || !feet || !age || !bloodPressure || !familyHistoryCheckboxes) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }  


    // Calculate individual scores
    const bpScore = BloodPressureScoreGiver(bloodPressure);
    const ageScore = AgeScoreGiver(age);
    const familyHistoryScore = FamilyHistoryScoreGiver(familyHistoryCheckboxes);
    const { BMI, category, score: bmiScore } = BMICalculator(weight, feet, inches);

    // Calculate the final score
    const finalScore = bpScore + ageScore + familyHistoryScore + bmiScore;

    // Return the result
    res.json({
      status: 'success',
      finalScore: finalScore,
      BMI: BMI,
      BMICategory: category,
      message: `Your calculated score is ${finalScore}.`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
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
