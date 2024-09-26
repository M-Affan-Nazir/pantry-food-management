
type itemTypeOut = {
    id : number,
    name : string,
    expiry : number, 
    factor: string, //days, months, years
    quantity : number,
    price : number,
    created_at : number
}

let toExpire : itemTypeOut[] = []
let expired : itemTypeOut[] = []
let maxTimeAr:number[] = []

  
export function getAdditionTime(expiry : number, factor: string){
    let time = 0;
    const secondsInDay = 86400
    const secondsInMonth = secondsInDay*30
    const secondsInYear = secondsInMonth*12

    if(factor == "days"){
        time += expiry * secondsInDay
    }
    else if(factor == "months"){
        time += expiry * secondsInMonth
    }
    else{
        time += expiry * secondsInYear
    }
    return time
}

export function seperateItems( arr : itemTypeOut[]){
    const t = Math.floor(Date.now() / 1000);
    for(let i = 0; i<arr.length; i++){
        const boughtAt = arr[i].created_at
        const maxTime = boughtAt + getAdditionTime(arr[i].expiry, arr[i].factor)
        if(t >= maxTime){
            expired.push(arr[i])
        }
        else{
            toExpire.push(arr[i])
            maxTimeAr.push(maxTime)
        }
    }

    bubbleSort()
    let te = [...toExpire]
    let e = [...expired]
    te = modify(te)
    toExpire = []
    expired = []
    maxTimeAr = []
    return {te, e}
}

function modify(items:itemTypeOut[]) : itemTypeOut[] {
    let updatedArray : itemTypeOut[] = items
    for(let i = 0; i<updatedArray.length;i++){
      let time_factor = "days"
      let time_left = Math.floor((getAdditionTime(updatedArray[i].expiry, updatedArray[i].factor) +  updatedArray[i].created_at -  Math.floor(Date.now() / 1000)) / 86400)
      console.warn(time_left)
      if(time_left <= 0){
        time_factor = "Today"
      }
      else{
        if (time_left > 30){
            time_left =  Math.floor(time_left / 30)
            time_factor = "month"
            if(time_factor == "month" && time_left > 12){
              time_left =  Math.floor(time_left / 12)
            time_factor = "year"
            }
        }
      }
      
      updatedArray = updatedArray.map((item) => {
      if (item.id === updatedArray[i].id) {
        // Return a new object with the updated expiry value
        return { ...item, expiry: time_left, factor:time_factor };
      }
      return item; // Return the original object for all other items
    });
  };
  console.warn(updatedArray)
  return updatedArray
}

function bubbleSort(){
    for(let i = 0; i<toExpire.length; i++){
        for(let j = 0; j<toExpire.length-i-1; j++){
            if(maxTimeAr[j] > maxTimeAr[j+1] ){
                
                let temp2 = maxTimeAr[j]
                maxTimeAr[j] = maxTimeAr[j+1]
                maxTimeAr[j+1] = temp2
                
                let temp = toExpire[j]
                toExpire[j] = toExpire[j+1]
                toExpire[j+1] = temp
            }
        }
    }
}