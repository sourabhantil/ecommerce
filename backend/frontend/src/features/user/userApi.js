// A mock function to mimic making an async request for data
const HOST = process.env.REACT_APP_API_HOST || "";
export function fetchLoggedInUserOrders() {
  return new Promise(async (resolve) => {
    const response = await fetch(HOST+"/orders/own/");
    const data = await response.json();
    resolve({data});
  }
  );
}

export function fetchLoggedInUser() {
  return new Promise(async (resolve) => {
    const response = await fetch(HOST+"/users/own");
    const data = await response.json();
    resolve({data});
  }
  );
}

//clear loggedin user details on logout
export function clearLoggedInUser() {
  return new Promise(async (resolve) => {
    resolve({data:"success"});
  }
  );
}

export function updateUser(updateData) {
  return new Promise(async (resolve) => {
    const response = await fetch(HOST+"/users/",{
      method : "PATCH",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify(updateData)
    });
    const data = await response.json();
    // on server it will only return some info of user (not password)
    resolve({data});
  }
  );
}
