// A mock function to mimic making an async request for data
const HOST = process.env.REACT_APP_API_HOST || "";
export function fecthProductById(id) {
  return new Promise(async (resolve) => {
    const response = await fetch(HOST+"/products/"+id);
    const data = await response.json();
    resolve({data});
  }
  );
}

export function fecthAllCategories() {
  return new Promise(async (resolve) => {
    const response = await fetch(HOST+"/categories");
    const data = await response.json();
    resolve({data});
  }
  );
}
export function fecthAllBrands() {
  return new Promise(async (resolve) => {
    const response = await fetch(HOST+"/brands");
    const data = await response.json();
    resolve({data});
  }
  );
}

export function fecthProductsByFilters({filter,sort,pagination,isAdmin}) {
  // filter = {"category" : ["laptop","smartphone"]}
  // sort = {_sort:"price",_order:"desc"}
  // pagination = {_page=1,_limit=10}
  // TODO : on server we will support multiple values
  // TODO: we can send userId from frontend and check on backend if user is admin or a user
  let queryString = "";
  for(let key in filter){
    const categoryValues = filter[key];
    if(categoryValues.length > 0){
      queryString += `${key}=${categoryValues}&`
    }
  }
  for(let key in sort){
    queryString += `${key}=${sort[key]}&`
  }
  for(let key in pagination){
    queryString += `${key}=${pagination[key]}&`
  }
  if(isAdmin){
    queryString += `isAdmin=true`
  }
  return new Promise(async (resolve) => {
    const response = await fetch(HOST+`/products/?${queryString}`);
    const totalItems = response.headers.get("X-Total-Count");
    const data = await response.json();
    resolve({data:{products : data,totalItems:+totalItems}});
  }
  );
}

export function createProduct(product) {
  return new Promise(async (resolve) => {
    const response = await fetch(HOST+"/products/",{
      method:"POST",
      headers:{
        "Content-Type": "application/json"
      },
      body : JSON.stringify(product)
    });
    const data = await response.json();
    resolve({data});
  }
  );
}

export function updateProduct(product){
  return new Promise(async (resolve)=>{
    const response = await fetch(HOST+"/products/"+product.id,{
      method : "PATCH",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(product)
    })
    const data = await response.json();
    resolve({data});
  })
}
