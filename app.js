// IIFE = Immediataly invoked function expression - Allows data privacy creating a new scope 
// - MODULE PATTERN -
let budgetController = (function (){    

})();

// The Ui Controller
let UIControler = (function(){
    // Some code;
})();

// The global app controller
let controller = (function(budgetCtrl, UICtrl){
    let ctrlAddItem = function(){
        /*  
            1. Get the field input data
            2. Add the item to the budge controller
            3. Add the item to the UI
            4. Calculate the budget
            5. Display the budget on UI
        */
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
       if(event.keyCode === 13 || event.which === 13){ 
           // event.which = for older browsers whose doesn't handle event.keyCode
            ctrlAddItem();
       }
    });
})(budgetController, UIControler);