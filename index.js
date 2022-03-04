const data = []
const countArray = []
const periodsArray = []
const periodsArrayCumulativeAmount = []
const ST= [
    {endTerm: '2999-12-31',
    startTerm: '2022-03-01',
    stPen: 12},

    {endTerm: '2022-02-28',
    startTerm: '2021-07-21',
    stPen: 9.25},

    {endTerm: '2021-07-20',
    startTerm: '2021-04-21',
    stPen: 8.5},

    {endTerm: '2021-04-20',
    startTerm: '2020-07-01',
    stPen: 7.75},

    {endTerm: '2020-06-30',
    startTerm: '2020-05-20',
    stPen: 8},

    {endTerm: '2020-05-19',
    startTerm: '2020-02-19',
    stPen: 8.75},

    {endTerm: '2020-02-18',
    startTerm: '2019-11-20',
    stPen: 9},

    {endTerm: '2019-11-19',
    startTerm: '2019-08-14',
    stPen: 9.5},

    {endTerm: '2019-08-13',
    startTerm: '2018-06-27',
    stPen: 10},

    {endTerm: '2018-06-26',
    startTerm: '2018-02-14',
    stPen: 10.5},

    {endTerm: '2018-02-13',
    startTerm: '2017-10-18',
    stPen: 11},

    {endTerm: '2017-10-17',
    startTerm: '2017-09-13',
    stPen: 11.5},

    {endTerm: '2017-09-12',
    startTerm: '2017-07-19',
    stPen: 12},

    {endTerm: '2017-07-18',
    startTerm: '2017-06-14',
    stPen: 13},

    {endTerm: '2017-06-13',
    startTerm: '2017-04-19',
    stPen: 14},

    {endTerm: '2017-04-18',
    startTerm: '2017-03-15',
    stPen: 15},

    {endTerm: '2017-03-14',
    startTerm: '2017-02-15',
    stPen: 16},

    {endTerm: '2017-02-14',
    startTerm: '2017-01-18',
    stPen: 17},

    {endTerm: '2017-01-17',
    startTerm: '2016-08-17',
    stPen: 18},

    {endTerm: '2016-08-16',
    startTerm: '2016-07-01',
    stPen: 20},

    {endTerm: '2016-06-30',
    startTerm: '2015-05-01',
    stPen: 22},

    {endTerm: '2016-04-30',
    startTerm: '2016-04-01',
    stPen: 24},

    {endTerm: '2016-03-31',
    startTerm: '1970-01-01',
    stPen: 25},
]

const opAddForm = document.querySelector('#op-add-form')
const opTerm = document.querySelector('#op-term')
const opSum = document.querySelector('#op-sum')
const opAdd = document.querySelector('#op-add')
const opDel= document.querySelector('#op-del')
const calcBtn = document.querySelector('#calc-btn')
const opTableBody = document.querySelector('#op-tabble-body')
const resultTableBody = document.querySelector('#result-table-body')
const spr = document.querySelector('#spr')
let convertedOpSum;
let opId = -1;
let periodsCounter = -1;
let spr1;
let spr2;

opAdd.addEventListener('click', event =>{
    event.preventDefault();
    if (isValidTerm(opTerm.value) == false || isValidSum(+opSum.value) == false){
        console.log('incorrect')
    } else {
        pushData(opTerm.value, +opSum.value)
        sortDataByTerm()
        countOpSaldo()
        createOpTableBody()
        createOpTableBodyResultRow()
        opAddForm.reset()
    } 
})

calcBtn.addEventListener('click', event =>{
    event.preventDefault()
    if(countArray.length > 0){
        countArray.length = 0
        periodsArray.length = 0
        periodsArrayCumulativeAmount.length = 0
        periodsCounter = -1}
    pushCountArray()
    calcOpAccruedAndPaidTotal()
    calcStartAndEndSaldo()
    getSt()
    pushPeriodsArray()
    calcPenSum()
    createResultTableBody()
    showSpr()
})

opDel.addEventListener('click', event =>{
    event.preventDefault()
    opDelete()

})

function sortDataByTerm(){
    data.sort((a, b) =>{
        let termA = new Date (a.opTerm)
        let termB = new Date (b.opTerm)
        return termA - termB;
    })
}

function convertOpSum(opSum){
    console.log(opSum)
}

function isValidTerm(opTerm){
   if (!!opTerm){
       return true
   } else {
       return false
   }
}

function isValidSum(opSum){
    if (!!opSum && typeof opSum === "number" && typeof opSum !== "string" && opSum != 0){
        return true
    } else {
        return false
    }
}

function createOpId(){
    return ++opId
}

function pushData(opTerm, opSum){
    data.push({
        opId: createOpId(), 
        opTerm: opTerm, 
        opTimeStamp: createOpTimeStamp(opTerm),
        opSum: opSum, 
        opSaldo: 0})
}

function createOpTimeStamp(opTerm){
    let parsedDate = Date.parse(opTerm)
    return parsedDate
}

function countOpSaldo(){
    let i = 0
    data.forEach(el =>{
        if(i == 0){
            el.opSaldo = el.opSum
            i++
        } else {
            el.opSaldo = data[i-1].opSaldo + el.opSum
            i++
        }
    })
}

function createOpTableBody(){
    opTableBody.innerHTML = ``
    data.forEach(el =>{
        opTableBody.innerHTML += `
        <tr>
        <td>${convertTimeStamp(el.opTerm, true)}</td>
        <td>${(el.opSum < 0) ? replaceDotWithComer((el.opSum - el.opSum - el.opSum).toFixed(2)) : ``}</td>
        <td>${(el.opSum > 0) ? replaceDotWithComer(el.opSum.toFixed(2)) : ``}</td>
        <td>${replaceDotWithComer(el.opSaldo.toFixed(2))}</td>
        <td><label> <input type="checkbox" id="${el.opId}"></label></td>
        </tr>`
    })
}

function createOpTableBodyResultRow(){
    let totalAccrued = 0;
    let totalPaid = 0;
    data.forEach(el =>{
        if(el.opSum < 0){
            totalAccrued = totalAccrued + el.opSum
        } else {
            totalPaid = totalPaid + el.opSum
        }
    })
    opTableBody.innerHTML += `
    <tr id="op-tabble-body-result-row">
        <td><b>Обороты</b></td>
        <td><b>${replaceDotWithComer((totalAccrued - totalAccrued - totalAccrued).toFixed(2))}</b></td>
        <td><b>${replaceDotWithComer((totalPaid).toFixed(2))}</b></td>
        <td><b>${replaceDotWithComer((data[data.length-1].opSaldo).toFixed(2))}</b></td>
        <td></td>
    </tr>`
}

function pushCountArray(){
    if(data.length>1){
        let startTerm = new Date(data[0].opTerm)
        let endTerm = new Date(data[data.length-1].opTerm)
        let duration = ((endTerm - startTerm)/1000/60/60/24) + 1
        console.log('DURATION ', duration)
        let i = 0;
        while(i < duration){
            countArray.push({
                date: 0, 
                opTimeStamp: 0,
                startSaldo: 0,
                opAccrued: 0, 
                opPaid: 0, 
                endSaldo: 0, 
                stPen: 0, 
                stPenDay:0,
                penSum: 0})
            i++   
        }
        countArray[0].date = data[0].opTerm
        countArray[0].opTimeStamp = createOpTimeStamp(countArray[0].date)
        let j = 1
        while(j < countArray.length){
            countArray[j].opTimeStamp = countArray[j-1].opTimeStamp + 86400000
            countArray[j].date = convertTimeStamp(countArray[j].opTimeStamp, false);
            j++
        }
        console.log(countArray)
    }
}

function convertTimeStamp(timeStamp, isForUser){
    let forConvertation = new Date(timeStamp)
    let currDate = forConvertation.getDate() + ''
    let currMonth = forConvertation.getMonth() + 1 + ''
    let currYear = forConvertation.getFullYear() + ''
    if (currDate.length != 2){
        currDate = '0' + currDate
    }
    if (currMonth.length != 2){
        currMonth = '0' + currMonth
    }
    if(isForUser == false){
        let result = currYear + '-' + currMonth + '-' + currDate
        return result
    } else {
        let result = currDate + '.' + currMonth + '.' + currYear
        return result
    }
    
}

function calcOpAccruedAndPaidTotal(){
    data.forEach(el =>{
        for(let i=0; i < countArray.length; i++){
            if(el.opTimeStamp == countArray[i].opTimeStamp){
                console.log("HERE !")
                if(el.opSum < 0){
                    countArray[i].opAccrued = countArray[i].opAccrued + el.opSum
                } else {
                    countArray[i].opPaid = countArray[i].opPaid + el.opSum
                }
            }
        }
    })
}

function calcStartAndEndSaldo(){
    countArray[0].endSaldo = countArray[0].startSaldo + countArray[0].opPaid + countArray[0].opAccrued
    for (let i = 1; i < countArray.length; i ++){
        countArray[i].startSaldo = countArray[i-1].endSaldo
        countArray[i].endSaldo = countArray[i].startSaldo + countArray[i].opAccrued + countArray[i].opPaid
    }
}

function getSt(){
    countArray.forEach(el =>{
        for (let i = 0; i < ST.length; i++){
            if(el.opTimeStamp >= Date.parse(ST[i].startTerm) && el.opTimeStamp <= Date.parse(ST[i].endTerm)){
                el.stPen = ST[i].stPen
                el.stPenDay = el.stPen / 360
                if(el.startSaldo < 0){
                    el.penSum = el.startSaldo * el.stPenDay/100
                }
            }
        }
    })

    let x = 0;
    countArray.forEach(el =>{
        x = x + el.penSum
    })
    console.log(x)
    spr1 = x
}

function pushPeriodsArray(){
    createPeriod();
    periodsArray[0].push({
        startSaldo: countArray[1].startSaldo,
        date: countArray[1].date,
        stPen: countArray[1].stPen,
    })

    for(let i = 2; i < countArray.length; i++){
        let objectToPush = {
            startSaldo: countArray[i].startSaldo,
            date: countArray[i].date,
            stPen: countArray[i].stPen
        }

        if(countArray[i].startSaldo == countArray[i-1].startSaldo && countArray[i].stPen == countArray[i-1].stPen){
            periodsArray[periodsCounter].push(objectToPush)
        } else {
            createPeriod()
            periodsArray[periodsCounter].push(objectToPush)
        }
    }   
}

function createPeriod(){
    periodsArray.push([])
    periodsCounter++
}

function calcPenSum(){
    let x = 0
    let debtPeriodNumber = -1

    for(let i = 0; i < periodsArray.length; i++){
        if(periodsArray[i][0].startSaldo < 0){
           debtPeriodNumber ++ 
           let startTerm = new Date(periodsArray[i][0].date)
           let endTerm = new Date(periodsArray[i][periodsArray[i].length-1].date)
           let duration = ((endTerm - startTerm)/1000/60/60/24) + 1
           periodsArray[i][0].duration = duration
           periodsArray[i][0].penSum = periodsArray[i][0].startSaldo * periodsArray[i][0].stPen / 100 / 360 * periodsArray[i][0].duration
           if (debtPeriodNumber == 0){
            periodsArrayCumulativeAmount.push(periodsArray[i][0].penSum)
           } else {
            let toPlus = periodsArray[i][0].penSum
            periodsArrayCumulativeAmount.push(0)
            periodsArrayCumulativeAmount[debtPeriodNumber] = periodsArrayCumulativeAmount[debtPeriodNumber-1] + toPlus
           }

           x = x + periodsArray[i][0].penSum
        }
}
console.log(x)
spr2 = x
}

function createResultTableBody(){
    let i = 0
    resultTableBody.innerHTML = ``
    periodsArray.forEach(el =>{
         if (el[0].startSaldo < 0){
            resultTableBody.innerHTML +=`
            <tr>
            <td>${i+1}</td>
            <td>${convertTimeStamp(el[0].date, true)}</td>
            <td>${convertTimeStamp(el[el.length-1].date, true)}</td>
            <td>${el[0].duration}</td>
            <td>${replaceDotWithComer((el[0].startSaldo - el[0].startSaldo - el[0].startSaldo).toFixed(2))}</td>
            <td>${replaceDotWithComer(el[0].stPen)}</td>
            <td>${replaceDotWithComer((el[0].penSum - el[0].penSum - el[0].penSum).toFixed(4))  }</td>
            <td>${replaceDotWithComer((periodsArrayCumulativeAmount[i] - periodsArrayCumulativeAmount[i] - periodsArrayCumulativeAmount[i]).toFixed(4))}</td>
            </tr>
            ` 
            i++
            }
        })
       
}

function loadSaving(unparsedJSON){
    const parsed = JSON.parse(unparsedJSON)
    data.length = 0
    parsed.forEach(el => {
        data.push(el)
    })
    console.log(data)
    sortDataByTerm()
    countOpSaldo()
    createOpTableBody()
    createOpTableBodyResultRow()
    if(countArray.length > 0){
        countArray.length = 0
        periodsArray.length = 0
        periodsArrayCumulativeAmount.length = 0
        periodsCounter = -1}
    pushCountArray()
    calcOpAccruedAndPaidTotal()
    calcStartAndEndSaldo()
    getSt()
    pushPeriodsArray()
    calcPenSum()
    createResultTableBody()
    showSpr()
}

function replaceDotWithComer(numberToChange){
    let x = numberToChange + ''
    let result = x.replace(".",",")
    return result
}

function opDelete(){
    let checkedCheckboxArray = [...document.querySelectorAll('input[type=checkbox]:checked')]
    checkedCheckboxArray.forEach(arrayElement =>{
        let elementToDelete = data.findIndex(item => item.opId === +arrayElement.id);
        data.splice([elementToDelete], 1)
    })
    sortDataByTerm()
    countOpSaldo()
    createOpTableBody()
    createOpTableBodyResultRow()
    opAddForm.reset()   
}

function showSpr(){
    spr.innerHTML = ``
    spr.innerHTML = `<br><br><br><br><br>СПРАВОЧНО (ДНИ): ${spr1}, 
    <br> СПРАВОЧНО (ПЕРИОДЫ): ${spr2}, `
}










