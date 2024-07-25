
type itemTypeOut = {
    id : number,
    name : string,
    expiry : number, 
    factor: string, //days, months, years
    quantity : number,
    price : number,
    createdAt : number
}

let toExpire : itemTypeOut[] = []
let expired : itemTypeOut[] = []

  
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
        const boughtAt = arr[i].createdAt
        const maxTime = boughtAt + getAdditionTime(arr[i].expiry, arr[i].factor)
        if(t >= maxTime){
            expired.push(arr[i])
        }
        else{
            toExpire.push(arr[i])
        }
    }
    bubbleSort()
    let te = [...toExpire]
    let e = [...expired]
    toExpire = []
    expired = []
    return {te, e}
}

function bubbleSort(){
    for(let i = 0; i<toExpire.length; i++){
        for(let j = 0; j<toExpire.length-i-1; j++){
            if(toExpire[j].createdAt > toExpire[j+1].createdAt ){
                let temp = toExpire[j]
                toExpire[j] = toExpire[j+1]
                toExpire[j+1] = temp
            }
        }
    }
}