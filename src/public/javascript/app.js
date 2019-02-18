// IIFE = Immediataly invoked function expression - Allows data privacy creating a new scope 
// - MODULE PATTERN -

// ==================================================================================================================================================================

// BUDGET CONTROLLER

// ==================================================================================================================================================================
let budgetController = (function (){    
    
    let Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    let Income = function(id, description, value){
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        };

    let calculateTotal = function(type) {
        let sum = 0;

        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        
        data.totals[type] = sum;
    }

    // Ojbect where we'll put our data
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

        deleteItem: function(type, id){
            let ids, index;
            
            ids = data.allItems[type].map(function(current){  

                /*
                    Difference between map and forEach: 
                    - map returns an entire NEW array
                */
                return current.id; // Returning an array in which each element is the id
            });

            index = ids.indexOf(id); 

            if(index !== -1){ // If we have found the element( -1 is the value when we didn't found an element)
                // slice = create copy of an entire array or a part
                // splice = deleting elements of an array
                data.allItems[type].splice(index, 1); 
            }
        },

        calculateBudget: function(){
            // Calculate total income and expenses;
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget: Income - Expenses;
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income that we spent
            if(data.totals.income > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function(){
            data.allItems.exp.forEach(function(current){
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function(){
            let allPerc = data.allItems.exp.map(function(current){
                return current.getPercentage();
            });

            return allPerc;
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function(){
            console.log(data);
        }
    };

})();

// ==================================================================================================================================================================

// THE UI(USER INTERFACE) CONTROLLER

// ==================================================================================================================================================================
let UIControler = (function(){

    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    let formatNumber = function(num, type){
        let numSplit, integer, decimal;

        num = Math.abs(num);

        // Exactly 2 decimal points
        num = num.toFixed(2);

        // Commma separating the thousands
        numSplit = num.split('.');
        integer = numSplit[0];
        decimal = numSplit[1];

        if(integer.length > 3){
            integer = integer.substr(0, integer.length - 3) + ',' + integer.substr(integer.length - 3, 3);
        }

        // Add + or - before number
        
        return (type === 'exp' ? '-' :  '+') + ' ' + integer + '.' + decimal;
    };

    let nodeListForEach = function(list, callback){
        for(let i = 0; i < list.length; i++){
            callback(list[i], i);
        }
    };

    return {
        getInput: function(){
            return {
                type : document.querySelector(DOMstrings.inputType).value, 
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type){
            let html, newHtml, element;
            // Create html string w/ placeholder text 
            if(type === 'exp'){
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; 
            } else if(type === 'inc'){
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data(received from obj)
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the html into the dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID){
            // We gotta move to the parent so we can delete the child
            let el = document.getElementById(selectorID);

            el.parentNode.removeChild(el);
        },

        clearFields: function(){
            let fields, fieldsArr;

            // querySelectorAll returns a list
            fields = document.querySelectorAll(DOMstrings.inputDescription +', '+ DOMstrings.inputValue); 

            // So we convert it to an array
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current){
                current.value = "";
                current.description = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj){
            let type;

            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages){
            let fields;

            fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, function(current, index){

                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayDate: function(){
            let now, year, months;

            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

        },

        changedType: function(){
            let fields;

            fields = document.querySelectorAll( // This returns a node list, use the nodeListForEach function
                DOMstrings.inputType + ' , ' +
                DOMstrings.inputDescription + ' , ' + 
                DOMstrings.inputValue
            );

            nodeListForEach(fields, function(current){
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    };
})();

// ==================================================================================================================================================================

// THE GLOBAL APP CONTROLLER

// ==================================================================================================================================================================
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)
    };

    let updateBudget = function(){
        let budget;

        //    1. Calculate the budget
        budgetCtrl.calculateBudget();

        //    2. Return the Budget
        budget = budgetCtrl.getBudget();

        //    3. Display the budget on UI
        UICtrl.displayBudget(budget);
    };

    let updatePercentages = function(){
        let percentages;

        // 1. Calculate the percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);   
    };

    let ctrlAddItem = function(){ 
        let input, newItem;
        //    1. Get the field input data
        input = UICtrl.getInput();

        if(input.description !== '' && !isNaN(input.value) && input.value > 0){
            //    2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            
            //    3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            //   4. Clear the fields
            UICtrl.clearFields();

            //   5. Calculate and update budget
            updateBudget();

            //   6. Calculate and update percentages
            updatePercentages();
        }
    };

    let ctrlDeleteItem = function(event){
        let itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();

            // 4. Calculate and update percentages
            updatePercentages();
        }
    };

    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayDate();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

})(budgetController, UIControler);

controller.init(); // Starting the application