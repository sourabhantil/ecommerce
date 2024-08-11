// A mock function to mimic making an async request for data
const HOST = process.env.REACT_APP_API_HOST || "";
export function createOrder(order) {
  return new Promise(async (resolve) => {
    const response = await fetch(HOST+"/orders",{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(order)
    });
    const data = await response.json();
    resolve({data});
  }
  );
}

export function updateOrder(order) {
  return new Promise(async (resolve) => {
    const response = await fetch(HOST+"/orders/"+order.id,{
      method : "PATCH",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(order)
    });
    const data = await response.json();
    resolve({data});
  }
  );
}

export function fecthAllOrders({sort,pagination}) {
  let queryString = "";

  for(let key in sort){
    queryString += `${key}=${sort[key]}&`
  }
  for(let key in pagination){
    queryString += `${key}=${pagination[key]}&`
  }
  return new Promise(async (resolve) => {
    const response = await fetch(HOST+`/orders/?${queryString}`);
    const data = await response.json();
    const totalOrders = response.headers.get("X-Total-Count");
    resolve({data:{orders : data,totalOrders:+totalOrders}});
  }
  );
}