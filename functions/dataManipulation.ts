
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

  
function getAdditionTime(expiry : number, factor: string){
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
    toExpire = []
    expired = []
    maxTimeAr = []
    return {te, e}
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