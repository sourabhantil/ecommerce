// A mock function to mimic making an async request for data
const HOST = process.env.REACT_APP_API_HOST || "";
export function createUser(userData) {
  return new Promise(async (resolve) => {
    const response = await fetch(HOST+"/auth/signup",{
      method : "POST",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify(userData)
    });
    const data = await response.json();
    // on server it will only return some info of user (not password)
    // resolve({data:{id:data.id}});
    resolve({data});
  }
  );
}

export function loginUser(loginInfo) {
  return new Promise(async (resolve,reject) => {
    try{
    const response = await fetch(HOST+"/auth/login",{
      method:"POST",
      body : JSON.stringify(loginInfo),
      headers : {"Content-Type" : "application/json"},
    });
    if(response.ok){
      const data = await response.json();
      resolve({data});
    }
    else{
      const data = await response.text();
      reject(data);
    }
  }
  catch(err){
    reject(err);
  } 

}
  );
}
export function checkAuth() {
  return new Promise(async (resolve,reject) => {
    try{
    const response = await fetch(HOST+"/auth/check");
    if(response.ok){
      const data = await response.json();
      resolve({data});
    }
    else{
      const data = await response.text();
      reject(data);
    }
  }
  catch(err){
    reject(err);
  } 

}
  );
}

export function signOut() {
  return new Promise(async (resolve,reject) => {
    try{
      const response = await fetch(HOST+"/auth/logout");
      if(response.ok){
        const data = {logout:"success"};
        resolve(data);
      }
      else{
        const error = await response.text();
        reject(error);
      }
    }
    catch(err){
      reject(err);
    } 
  }
  );
}

// for sending reset pass mail
export function resetPasswordRequest(data) {
  return new Promise(async (resolve,reject) => {
    try{
    const response = await fetch(HOST+"/auth/reset-password-request",{
      method:"POST",
      headers: {"Content-Type" : "application/json"},
      body : JSON.stringify(data)
    });
    if(response.ok){
      const data = await response.json();
      resolve({data});
    }
    else{
      const data = await response.text();
      reject(data);
    }
  }
  catch(err){
    reject(err);
  } 

}
  );
}

// reset password
export function resetPassword(data) {
  return new Promise(async (resolve,reject) => {
    try{
    const response = await fetch(HOST+"/auth/reset-password",{
      method:"POST",
      headers: {"Content-Type" : "application/json"},
      body : JSON.stringify(data)
    });
    if(response.ok){
      const data = await response.json();
      resolve({data});
    }
    else{
      const data = await response.text();
      reject(data);
    }
  }
  catch(err){
    reject(err);
  } 
}
  );
}

