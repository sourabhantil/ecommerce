// A mock function to mimic making an async request for data
const HOST = process.env.REACT_APP_API_HOST || "";
export function addToCart(item) {
  return new Promise(async (resolve) => {
    const response = await fetch(HOST+"/cart",{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(item)
    });
    const data = await response.json();
    resolve({data});
  }
  );
}

//update will contain update item
export function updateCart(update) {
  return new Promise(async (resolve) => {
    const response = await fetch(HOST+"/cart/"+update.id,{
      method : "PATCH",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(update)
    });
    const data = await response.json();
    resolve({data});
  }
  );
}

export function deleteItemFromCart(itemId) {
  return new Promise(async (resolve) => {
    const response = await fetch(HOST+"/cart/"+itemId,{
      method : "DELETE"
    });
    const data = await response.json();
    resolve({data});
  }
  );
}

export function fetchItemsById(){
  return new Promise(async(resolve)=>{
    const response = await fetch(HOST+"/cart");
    const data = await response.json();
    resolve({data});
  })
}

export function resetCart() {
  return new Promise(async (resolve) => {
    const response = await fetchItemsById();
    const data = response.data;
    for(const item of data){
      await deleteItemFromCart(item.id);
    }
    resolve({data : {status : "success"}});
  }
  );
}