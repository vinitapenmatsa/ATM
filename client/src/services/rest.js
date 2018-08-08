const baseURL = 'http://localhost:8080/';

export function PostData(type, data){

   console.log("POST call , URL: " + baseURL + type + " Data : " + JSON.stringify(data));
   fetch( baseURL + type, {
           method: 'POST',
           body: JSON.stringify(data),
           headers: new Headers({
             "Content-Type": "application/json",
             "Access-Control-Allow-Origin":"*"
           })
        }).then(response => {
           console.log("***POST RESPONSE***", response);
           return response.json();
         });
 }
