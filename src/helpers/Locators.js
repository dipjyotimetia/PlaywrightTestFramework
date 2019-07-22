const loginPage = {
  login: "button[class*='TopBarDropDown__login--']",
  userName: "input[class*='Field__fieldInput--']",
  password: "input[class*='Field__fieldInput--'][type='password']",
  loginBtn: "button[class*='LoginDropDown__login--']",
};

const registrationPage = {
  joinNowBtn: "a[href='/join-now']",
  fname: "input[name='firstName']",
  lname: "input[name='surname']",
  dob: "input[name='DOB']",
  address: "input[name='address']",
  addressAutoComplete: "button[class*='AutoComplete']",
  mobile: "input[name='mobileNumber']",
  email: "input[name='email']",
  password: "input[name='password']",
};

module.exports = { loginPage, registrationPage };
