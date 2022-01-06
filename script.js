
var exchangeToggle = 'Stock'; 
var AlertToggle = 'On'; 
var stockSymbol = ''; 
var stockPrice = ''; 

// Selectors
const stockToggleButton = document.querySelector('.exchangeToggle-Stock');
const cryptoToggleButton = document.querySelector('.exchangeToggle-Crypto');
const exchangeInput = document.querySelector(".exchange-input"); 
const addExchangeButton = document.querySelector(".addExchange-button");
const exchangeList = document.querySelector(".exchange-list");  
const updateButton = document.querySelector(".update-button");  

// Event Listeners 
document.addEventListener('DOMContentLoaded', getExchanges);
stockToggleButton.addEventListener('click',switchExchangeToggle); 
cryptoToggleButton.addEventListener('click',switchExchangeToggle); 
addExchangeButton.addEventListener("click", addExchange); 
exchangeList.addEventListener('click', getSaveIndexOfChossen);
updateButton.addEventListener('click', updatePrices);

// Function 
function updatePrices(e) {
    console.log('2'); 
    let exchanges; 
    if (localStorage.getItem('exchanges') === null) {
        exchanges = []; 
    } else {
        exchanges = JSON.parse(localStorage.getItem('exchanges'));
    }
    console.log('1'); 
    for (let i = 0; i < exchanges.length; i++) {
       
        var options = {
            method: 'GET',
            url: 'https://stock-data-yahoo-finance-alternative.p.rapidapi.com/v6/finance/quote',
            params: {symbols: `${exchanges[i].exchange}`},
            headers: {
              'x-rapidapi-host': 'stock-data-yahoo-finance-alternative.p.rapidapi.com',
              'x-rapidapi-key': '84416d6a9fmshb4d6084130fa5a7p165d98jsn840140a63a35'
            }
        };
        axios.request(options).then(function (response) {
            console.log('inside update'); 
            stockPrice = response.data["quoteResponse"]["result"][0]["regularMarketPrice"];
            console.log(stockPrice); 
            exchanges[i].exchangePrice = stockPrice;
            if (stockPrice > exchanges[i].amountOver) {
                exchanges[i].needle = 1; 
                console.log('1: ', exchanges[i].needle); 
            }
            else if (stockPrice < exchanges[i].amountUnder) {
                exchanges[i].needle = -1; 
                console.log('-1: ', exchanges[i].needle); 
            }
            else {
                exchanges[i].needle = 0;
                console.log('0: ', exchanges[i].needle); 
            }
            localStorage.setItem('exchanges',JSON.stringify(exchanges));
            // console.log(exchanges[i].exchange);
            // console.log('price updated');
            console.log('3'); 

        }).catch(function (error) {
            console.error(error);

            if (stockPrice > exchanges[i].amountOver) {
                exchanges[i].needle = 1; 
                console.log('err 1: ', exchanges[i].needle); 
            }
            else if (stockPrice < exchanges[i].amountUnder) {
                exchanges[i].needle = -1; 
                console.log('err -1: ', exchanges[i].needle); 
            }
            else {
                exchanges[i].needle = 0;
                console.log('err 0: ', exchanges[i].needle); 
            }
            localStorage.setItem('exchanges',JSON.stringify(exchanges));
        });
    }
    console.log('2'); 
    setTimeout(function(){
        window.location.reload(1);
     }, 3000);
}

function addExchange(e) {
    // Prevent form from submitting
    e.preventDefault();  
    
    if (exchangeInput.value === "" && stockSymbol === '' && stockPrice === '') {
        console.log('No exchange input');
    }
    else {
        let exchanges; 
        let duplicate = false; 
        if (localStorage.getItem('exchanges') === null) {
            exchanges = []; 
        } else {
            exchanges = JSON.parse(localStorage.getItem('exchanges'));
        }

        for (let i = 0; i < exchanges.length; i++) {
            if (exchanges[i].exchange === exchangeInput.value.toUpperCase()) {
                duplicate = true; 
            }
        }
        if (!duplicate) {
            console.log('test change'); 
            var options = {
                method: 'GET',
                url: 'https://stock-data-yahoo-finance-alternative.p.rapidapi.com/v6/finance/quote',
                params: {symbols: `${exchangeInput.value.toUpperCase()}`},
                headers: {
                  'x-rapidapi-host': 'stock-data-yahoo-finance-alternative.p.rapidapi.com',
                  'x-rapidapi-key': '84416d6a9fmshb4d6084130fa5a7p165d98jsn840140a63a35'
                }
            };
            axios.request(options).then(function (response) {

                stockSymbol = exchangeInput.value.toUpperCase(); 
                stockPrice = response.data["quoteResponse"]["result"][0]["regularMarketPrice"];

                // exchange button
                const exchangeLi = document.createElement("li");
                exchangeLi.classList.add("exchange-button"); 

                const exchangeAttribute = document.createElement("a");  
                exchangeAttribute.setAttribute('href', "exchangeEdit.html");
                exchangeAttribute.classList.add("exchange-attribute"); 
                exchangeLi.appendChild(exchangeAttribute); 


                // get exchange name
                const exchangeName = document.createElement('span'); 
                exchangeName.classList.add('exchange-text');
                exchangeName.innerText = stockSymbol.toUpperCase(); 
                exchangeAttribute.appendChild(exchangeName);
                
                // get exchange price
                const exchangePrice = document.createElement('span');
                exchangePrice.classList.add('exchange-price'); 
                exchangePrice.innerText = stockPrice.toLocaleString();
                exchangeAttribute.appendChild(exchangePrice);

                // save new exchange to local storage
                saveExchangeLocalStorage(stockSymbol, stockPrice);

                // append to list 
                exchangeList.appendChild(exchangeLi);

                // clear input value
                exchangeInput.value = '';

            }).catch(function (error) {
                console.error(error);
                exchangeInput.value = '';
            });
        }
        duplicate = false; 
    }
}

function deleteExchange(e) {
    const item = e.target;  
    console.log(item); 
    deleteExchangeLocalStorage(item);
    item.remove();  
}

function saveExchangeLocalStorage(exchange, price) {
    let exchanges; 
    if (localStorage.getItem('exchanges') === null) {
        exchanges = [];  
    } else {
        exchanges = JSON.parse(localStorage.getItem('exchanges')); 
    }
    let exchangeObj = {
        'exchange': exchange, 
        'exchangePrice': price,
        'exchangeType': exchangeToggle,
        'amountOver': 0, 
        'amountUnder':0, 
        'needle':0, 
    };
    exchanges.push(exchangeObj);
    localStorage.setItem('exchanges',JSON.stringify(exchanges)); 
}

function deleteExchangeLocalStorage(exchange) { 
    let exchanges; 
    if (localStorage.getItem('exchanges') === null) {
        exchanges = [];  
    } else {
        exchanges = JSON.parse(localStorage.getItem('exchanges')); 
    }
    const exchangeIndex = exchange.children[0].innerText;  
    for(let i = 0; i < exchanges.length; i++) {
        if (exchanges[i]['exchange'] === exchangeIndex) {
            exchanges.splice(i,1); 
        }
    }
    localStorage.setItem('exchanges',JSON.stringify(exchanges)); 
}

function switchExchangeToggle(e) {
    let exchangeType = e.target.innerText; 
    exchangeToggle = exchangeType;
}

function getExchanges() { 
    let exchanges; 
    if (localStorage.getItem('exchanges') === null) {
        exchanges = []; 
    } else {
        exchanges = JSON.parse(localStorage.getItem('exchanges'));
    }
    exchanges.forEach(exchange => {
        // console.log(exchange); 
        let color; 
        // exchange button
        if (exchange['needle'] === -1) {
            console.log("exchange-button-red"); 
            color = "exchange-button-red";
        }
        else if (exchange['needle'] === 1) {
            console.log("exchange-button-green"); 
            color = "exchange-button-green";
        }
        else {
            console.log("exchange-button"); 
            color = "exchange-button";
        }
        const exchangeLi = document.createElement("li");
        exchangeLi.classList.add(color); 

        const exchangeAttribute = document.createElement("a");  
        exchangeAttribute.setAttribute('href', "exchangeEdit.html");
        exchangeAttribute.classList.add("exchange-attribute"); 
        exchangeLi.appendChild(exchangeAttribute); 

        // get exchange name
        const exchangeName = document.createElement('span'); 
        exchangeName.classList.add('exchange-text');
        exchangeName.innerText = exchange['exchange'].toUpperCase(); 
        exchangeAttribute.appendChild(exchangeName);

        // get exchange price
        const exchangePrice = document.createElement('span');
        exchangePrice.classList.add('exchange-price'); 
        exchangePrice.innerText = exchange['exchangePrice'].toLocaleString();
        exchangeAttribute.appendChild(exchangePrice);

        // append to list 
        exchangeList.appendChild(exchangeLi);
    });
}

function getSaveIndexOfChossen(event) {
    console.log('click'); 
    let chosenIndex; 
    let exchanges; 
    if (localStorage.getItem('chosenIndex') === null && localStorage.getItem('exchanges') === null) {
        chossenIndex = ''; 
        exchanges = [];  
    } else {
        chosenIndex = JSON.parse(localStorage.getItem('chosenIndex')); 
        exchanges = JSON.parse(localStorage.getItem('exchanges')); 
    }
    const itemIndex = event.target.children[0].innerText;  
    for(let i = 0; i < exchanges.length; i++) {
        if (exchanges[i]['exchange'] === itemIndex) {
            chosenIndex = i; 
            localStorage.setItem('chosenIndex',i); 
        }
    }
    console.log(chosenIndex); 

}

