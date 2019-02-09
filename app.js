// IIFE = Immediataly invoked function expression - Allows data privacy creating a new scope 
// - MODULE PATTERN -
let budgetController = (function (){    
    
    let Expense = function(id, description, value){
        this.id = id;
        this. description = description;
        this.value = value;
    };

    let Income = function(id, description, value){
            this.id = id;
            this. description = description;
            this.value = value;
        };

    // Ojbect where we'll put our data
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, des, val) {
            let newItem, ID;
            // ID = Last ID + 1;
            // Create new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else ID = 0;
        
            // Create new item based on 'inc' or 'exp' type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if(type === 'inc') {
                newItem = new Income(ID, des, val); 
            }

            // Push it into our data structure 
            data.allItems[type].push(newItem);

            // Return the new element;
            return newItem;
        },

        testing: function(){
            console.log(data);
        }
    };

})();

// The Ui Controller
let UIControler = (function(){

    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value, 
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value
            };
        },

        addListItem: function(obj, type){
            let html;
            // Create html string w/ placeholder text 
            if(type === 'inc'){
                html = '<div class="item clearfix" id="expense-0"><div class="item__description">Apartment rent</div><div class="right clearfix"><div class="item__value">- 900.00</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; 
            } else if(type === 'dec'){
                html = '<div class="item clearfix" id="expense-1"><div class="item__description">Grocery shopping</div><div class="right clearfix"><div class="item__value">- 435.28<div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data(received from obj)

            // Insert the html into the dom
        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    };
})();

// The global app controller
let controller = (function(budgetCtrl, UICtrl){

    let setupEventListeners = function(){

        let DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
           if(event.keyCode === 13 || event.which === 13){ 
               // event.which = for older browsers whose doesn't handle event.keyCode
                ctrlAddItem();
           }
        });
    }

    let ctrlAddItem = function(){ 
        let input, newItem;
        //    1. Get the field input data
        input = UICtrl.getInput();
           
        //    2. Add the item to the budge controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        /* 
            3. Add the item to the UI
            4. Calculate the budget
            5. Display the budget on UI
        */
    }

    return {
        init: function() {
            console.log('Application has started.');
            setupEventListeners();
        }
    }

})(budgetController, UIControler);

controller.init(); // Starting the application