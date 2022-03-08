'use strict';
let customerData = [];
let tellerData = [];
let resultData = [];
let searchArray = [];
const tableMaxLength  = 10;
let page = 0;
let maxPages = 0;
let resultLength = 0;
let searchBox = null;
let searchArrayLength = 0;
let appointmentMax = 0;
const openTime = 7; // MILITARY TIME OPEN TIME 7:00 AM
const closingTime = (4) + 12; // MILITARY TIME CLOSING TIME 5:00 PM, LEAVE AN HOUR FOR ONE LAST MEETING
let updateTime = new Date(Date.now());
window.addEventListener('DOMContentLoaded', function(){
    const table = document.getElementById('tableHeader');

    // ADD CLICK FUNCTIONS TO THE NAVIGATION
    let navButtons = document.querySelectorAll('#nav-box > button');
    for(let i = 0;i < navButtons.length;i++){
        navButtons[i].addEventListener('click', function(e) {
            navButtons = document.querySelectorAll('#nav-box > button');
            const btnArray = Array.prototype.slice.call(navButtons);
            const bIndex = btnArray.indexOf(e.currentTarget);
            if(bIndex === 0 && page > 0){
                page--;
            }else if(bIndex === 1 && page < maxPages - 1){
                page++;
            }
            let start = page * tableMaxLength;
            let end = start + tableMaxLength > searchArrayLength ? searchArrayLength : start + tableMaxLength;
            clearTable();
            for(let x = start; x < end;x++){
                createRow(searchArray[x]);
            }
            setNav();
        });
    }

    //ADD INPUT FUNCTIONS FOR THE SEARCH BOX
    searchBox = document.getElementById('searchBox');
    if(searchBox !== null){
        searchBox.addEventListener('keyup', searchBoxInput , false);
        searchBox.addEventListener('input', searchBoxInput , false);
        searchBox.addEventListener('paste', searchBoxInput , false);
    }

    // RETRIEVE JSON DATA FOR CUSTOMER DATA AND TELLER DATA
    fetch('./files/CustomerData.json')
        .then(result => result.json())
        .then(data => { customerData = data.Customer})
        .finally(function(){
            fetch('./files/TellerData.json')
                .then(result => result.json())
                .then(data => tellerData = data.Teller)
                .finally(function(){

                    // THE AMOUNT OF TIME BETWEEN APPOINTMENTS
                    let maxSeparation = 0;

                    // SORT THE CUSTOMER AND TELLER DATA BY SPECIALTY
                    customerData.sort(function(a,b){
                        let aVal = Number(a.type);
                        let bVal = Number(b.type);
                        maxSeparation = Number(a.duration) > maxSeparation ? Number(a.duration) + 5 : maxSeparation;
                        if(aVal > bVal){
                            return -1;
                        }else if(aVal < bVal){
                            return 1;
                        }
                        return 0;
                    });

                    tellerData.sort(function(a,b){
                        let aVal = Number(a.SpecialtyType);
                        let bVal = Number(b.SpecialtyType);
                        if(aVal < bVal){
                            return -1;
                        }else if(aVal > bVal){
                            return 1;
                        }
                        return 0;
                    });

                    // RETRIEVE THE LENGTH OF THE TWO ARRAYS FOR LOOPING
                    const customerDataLength = customerData.length;
                    const tellerDataLength = tellerData.length;
                    appointmentMax = Math.ceil(customerDataLength / tellerDataLength);
                    let count = 0;
                    let repeat = 0;
                    let time = new Date((Date.now() + (repeat * (maxSeparation * 1000 * 60))));
                    for(let i = 0; i < appointmentMax;i++){
                        let valid = false;
                        let loop = 0;
                        while(loop < tellerDataLength && !valid){
                            let inLoop = 0;
                            updateTime = new Date(Date.now());
                            if(tellerData[loop].SpecialtyType){
                                if(customerData[i].type){
                                    while(inLoop < appointmentMax && count < customerDataLength){
                                        // SET THE OPEN TIME to 7:00 AM AND CLOSING TIME TO 5:00 PM TO MAKE IT SEEM MORE REALISTIC
                                        if(updateTime.getHours() > closingTime || updateTime.getHours() < openTime){
                                            updateTime.setHours(openTime);
                                            updateTime.setMinutes(0);
                                            updateTime.setDate(updateTime.getDate() + 1);
                                        }

                                        // MULTIPLIER
                                        const multiplier = customerData[count].type === tellerData[loop].SpecialtyType;
                                        const duration = multiplier ? Number(tellerData[loop].Multiplier) * Number(customerData[count].duration) : customerData[count].duration;

                                        // CREATE THE DATE DEPENDING ON THE NUMBER OF APPOINTMENTS THE TELLER CURRENTLY HAS

                                        //BEGIN DATE
                                        time = new Date((updateTime + (loop * (maxSeparation * 1000 * 60))));
                                        let meridian = time.getHours() / 12 >= 1 ? 'PM' : 'AM';
                                        let hours = time.getHours() > 12 ? time.getHours() - 12 : time.getHours();
                                        const formatDate = (time.getMonth() + 1) + '/' + time.getDate() + '/' + time.getFullYear() + ' ' + hours + ':' + String(time.getMinutes()).padStart(2, "0") + ':' + meridian;

                                        //END DATE
                                        time = new Date(time.getTime() + (Number(customerData[count].duration) * 1000 * 60));
                                        meridian = time.getHours() / 12 >= 1 ? 'PM' : 'AM';
                                        hours = time.getHours() > 12 ? time.getHours() - 12 : time.getHours();
                                        const formatAddedTime = (time.getMonth() + 1) + '/' + time.getDate() + '/' + time.getFullYear() + ' ' + hours + ':' + String(time.getMinutes()).padStart(2, "0") + ':' + meridian;
                                        const resObj = {
                                            tellerId:tellerData[loop].ID,
                                            customerId: customerData[count].Id,
                                            timeFrame: formatDate + ' - ' + formatAddedTime,
                                            duration: duration + ' min',
                                            tellerType: tellerData[loop].SpecialtyType,
                                            customerType: customerData[count].type,
                                            multiplier:multiplier ? 'Yes' : 'No'
                                        };
                                        resultData.push(resObj);
                                        searchArray.push(resObj);

                                        //CREATE THE DOM OBJECT ROW, THE HIGHER THE TABLES MAXIMUM LENGTH THE SLOWER THE PERFORMANCE
                                        if(loop === 0 && inLoop < tableMaxLength){
                                            createRow(resObj);
                                        }
                                        updateTime = new Date(updateTime.getTime() + (maxSeparation * 1000 * 60));
                                        inLoop++;
                                        count++;
                                    }
                                }else{
                                    valid = false;
                                    alert('Error at id "'+ customerData[loop].Id +'" in file "CustomerData.json". type was not found.');
                                }
                            }else{
                                valid = false;
                                alert('Error at id "'+ tellerData[loop].ID +'" in file "TellerData.json". SpecialtyType was not found.');
                            }
                            loop++;
                        }
                    }

                    // SET THE MAXIMUM NUMBER OF PAGES TO CYCLE THROUGH THE TABLE AND THE NEWLY UPDATED LENGTHS OF EACH
                    resultLength = resultData.length;
                    searchArrayLength = searchArray.length;
                    maxPages = Math.ceil(resultLength / tableMaxLength);

                    // SET NAVIGATION BOX
                    setNav();
                })
        });

    // RECREATES THE TABLE BASED ON THE VALUE IN THE SEARCH BOX
    function searchBoxInput(){
        searchBox = document.getElementById('searchBox');
        const searchBoxVal = searchBox.value.trim().toLowerCase();
        page = 0;
        let count = 0;
        clearTable();
        searchArray = [];
        for(let i = 0;i < resultLength;i++){
            if((resultData[i].tellerId.toLowerCase().indexOf(searchBoxVal) > -1 && (searchBoxVal.length > 1 || Number(searchBoxVal) > 4)) || (resultData[i].customerId.toLowerCase().indexOf(searchBoxVal) > -1  && (searchBoxVal.length > 1 || Number(searchBoxVal) > 4)) || (resultData[i].timeFrame.toLowerCase().indexOf(searchBoxVal) > -1 && (searchBoxVal.length > 1 || Number(searchBoxVal) > 4)) || (resultData[i].duration.toLowerCase().indexOf(searchBoxVal) > -1) || resultData[i].tellerType.toLowerCase().indexOf(searchBoxVal) > -1 || resultData[i].customerType.toLowerCase().indexOf(searchBoxVal) > -1 || resultData[i].multiplier.toLowerCase().indexOf(searchBoxVal) > -1){
                searchArray.push(resultData[i]);
                if(count < tableMaxLength){
                    createRow(resultData[i]);
                }
                count++;
            }
        }
        searchArrayLength = searchArray.length;
        maxPages = Math.ceil(searchArrayLength / tableMaxLength);
        setNav();
    }

    // RECREATES THE NAVIGATION DOCK AT THE BOTTOM OF THE TABLE
    function setNav(){
        // SET NAV VARIABLE
        const nav = document.querySelector('#nav-box > span');
        if(nav !== null){
            //REMOVE CHILD NODES IF FOUND
            let loop = 0;
            let navLength = nav.childNodes.length;
            while(loop < navLength){
                nav.removeChild(nav.childNodes[0]);
                loop++;
            }

            //CREATE A TEXTBOX THAT WILL BE ADDED TO THE NAVIGATION
            const maxPageText = maxPages === 0 ? 1 : maxPages;
            const textBox = document.createElement('span');
            const textBoxNode = document.createTextNode(Number(page + 1).toString() + ' / ' + maxPageText);
            textBox.appendChild(textBoxNode);
            nav.appendChild(textBox);
        }
    }

    // CLEARS THE TABLE
    function clearTable(){
        // REMOVE ROWS FROM THE TABLE IF FOUND
        let loop = 0;
        const rowLength = table.childNodes.length;
        while(loop < rowLength){
            table.removeChild(table.childNodes[0]);
            loop++;
        }
    }

    // CREATES A ROW IN THE TABLE FOR THE OBJECT THAT WAS PASSED
    function createRow(resObj){
        const resultObjLength = Object.keys(resObj).length;
        const row = document.createElement('tr');
        for(let x = 0;x < resultObjLength;x++){
            const cell = document.createElement('td');
            const span = document.createElement('span');
            let valString = '';

            switch(x){
                case 0:
                    valString = resObj.tellerId;
                    break;
                case 1:
                    valString = resObj.customerId;
                    break;
                case 2:
                    valString = resObj.timeFrame;
                    break;
                case 3:
                    valString = resObj.duration;
                    break;
                case 4:
                    valString = resObj.tellerType;
                    break;
                case 5:
                    valString = resObj.customerType;
                    break;
                case 6:
                        valString = resObj.multiplier;
                    break;
                default:
                    valString = 'null'
                    break;
            }

            const text = document.createTextNode(valString)
            span.appendChild(text);
            cell.appendChild(span);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
});