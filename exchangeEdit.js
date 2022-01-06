

// selectors 
const newHighThreshInput = document.querySelector('.newHighThresh'); 
const newLowThreshInput = document.querySelector('.newLowThresh');
const saveChangesButton =  document.querySelector('.saveChanges'); 
const deleteExchangeButton = document.querySelector('.deleteExchange'); 

// event listeners
document.addEventListener('DOMContentLoaded', getChosenExchange);
saveChangesButton.addEventListener('click', saveChanges); 
deleteExchangeButton.addEventListener('click', deleteExchange); 

function getChosenExchange() {
    let index = localStorage.getItem('chosenIndex');
    let obj = JSON.parse(localStorage.getItem('exchanges'))[index];

    document.querySelector('.exchange-text').innerHTML = obj.exchange; 
    document.querySelector('.exchange-price').innerHTML = obj.exchangePrice;
    
    document.querySelector('.newHighThresh').setAttribute('placeholder', `$${obj.amountOver}`);
    document.querySelector('.newLowThresh').setAttribute('placeholder', `$${obj.amountUnder}`);
    
    document.querySelector('.newHighThresh').value = obj.amountOver;
    document.querySelector('.newLowThresh').value = obj.amountUnder;
}

function saveChanges(e) {
    e.preventDefault();

    console.log('save changes');
    
    let index = localStorage.getItem('chosenIndex');
    let exchanges = JSON.parse(localStorage.getItem('exchanges'));


    exchanges[index].amountOver = newHighThreshInput.value;
    exchanges[index].amountUnder = newLowThreshInput.value;

    localStorage.setItem('exchanges',JSON.stringify(exchanges));
    window.location.replace("popup.html");
}

function deleteExchange(e) { 
    e.preventDefault();

    console.log('delete');

    let index = localStorage.getItem('chosenIndex');
    let exchanges = JSON.parse(localStorage.getItem('exchanges'));
    exchanges.splice(index,1); 
    localStorage.setItem('exchanges',JSON.stringify(exchanges)); 
    window.location.replace("popup.html");
}