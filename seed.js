const axios = require("axios")

const adminUser = {
  username: "admin",
  password: "Passw0rdo!",
  apiKey: 'somesupersecretkeyhere', 
}

axios.post(`http://localhost:8000/users`, adminUser)
  .then((response) => {
    console.log(response.data)
  })
  .then((error) => {
    console.log(error)
  })