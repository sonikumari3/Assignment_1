const userModel = require("../model/userModel.js");
const jwt = require("jsonwebtoken");


// Validations :-

let isValidData = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

let isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

let isValidName = /^[a-zA-Z ]*$/;

let isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

let isValidPhone = /^\d{10}$/;


// REGISTER USER API :-

const registerUser = async function (req, res) {
  try {
    let requestBody = req.body;
    let { name, email, phone, gender, password } = requestBody;

    // Validation Starts......

    if (!isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({ status: false, message: "No data provided" });
    }

    //  Name Validation :-

    if (!isValidData(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Name is required." });
    }

    if (!isValidName.test(name)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter a valid Name" });
    }

    // Email Validation :-

    if (!isValidData(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Email is required." });
    }

    if (!isValidEmail.test(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid a email " });
    }

    let duplicateEmail = await userModel.findOne({ email });
    if (duplicateEmail) {
      return res
        .status(400)
        .send({ status: false, msg: "Email already exist" });
    }

    // Phone Validation :-
    if (!isValidData(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "Phone is required." });
    }

    if (!isValidPhone.test(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid phone number" });
    }

    let duplicatePhone = await userModel.findOne({ phone });
    if (duplicatePhone) {
      return res
        .status(400)
        .send({ status: false, msg: "Phone number already exist" });
    }

    // Gender Validation :-

    if (!isValidData(gender)) {
      return res
        .status(400)
        .send({ status: false, message: "Gender is required." });
    }

    if (gender !== "Male" && gender !== "Female") {
      return res
        .status(400)
        .send({ status: false, message: "Gender should be Male, female" });
    }

    // Password Validation :-

    if (!isValidData(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Password is required." });
    }

    // Register User :-

    let registerData = await userModel.create(requestBody);
    res.status(201).send({
      status: true,
      message: "User data registered successfully",
      data: registerData,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

// LOGIN USER API :- 

const loginUser = async function (req, res) {
  try {
    const requestBody = req.body;
    const { email, password } = requestBody;

    if (!isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({ status: false, message: "No data provided" });
    }

    if (!isValidData(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Email is required." });
    }

    if (!isValidEmail.test(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid a email " });
    }

    if (!isValidData(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Password is required." });
    }

    const matchUser = await userModel.findOne({ email, password });
    if (!matchUser) {
      return res
        .status(404)
        .send({ status: false, message: " Email/Password is Not Matched" });
    }

    const token = jwt.sign(
      {
        userId: matchUser._id.toString(),
        iat: new Date().getTime() / 1000, //(iat)Issued At- the time at which the JWT was issued.
      },
      "my-secret-key",
      {
        expiresIn: "120000sec",
      }
    );

    res.setHeader("x-user-key", token);
    return res.status(200).send({
      status: true,
      message: "User Logged in successfully",
      data: token,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {registerUser,loginUser}
