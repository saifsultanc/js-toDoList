(function(){

    // get elements
    const itemForm = document.getElementById('itemForm');
    const itemInput = document.getElementById('itemInput');
    const itemList = document.querySelector('.item-list');
    const clearBtn = document.getElementById('clear-list');
    const feedback = document.querySelector('.feedback');

    // array to hold all items of the To Do List
    // if data alreadys stored in local storage load that, OR, empty
    let itemData = JSON.parse(localStorage.getItem('list')) || [];
    // also load in the itemComplete storage (which stores completed item data)
    let itemComplete = JSON.parse(localStorage.getItem('itemComplete')) || [];

    // if local storage did have items, need to insert the html
    // and corresponding event handling
    if (itemData.length > 0){
        itemData.forEach(function(value){
            // insert at the end position (before end) of the item list data
            itemList.insertAdjacentHTML('beforeend',`
                <div class = "item my-3">
                    <h5 class="item-name text-capitalize">${value}</h5>
                    <div class="item-icons">
                    <a href="#" class="complete-item mx-2 item-icon"><i class="far fa-check-circle"></i></a>
                    <a href="#" class="edit-item mx-2 item-icon"><i class="far fa-edit"></i></a>
                    <a href="#" class="delete-item item-icon"><i class="far fa-times-circle"></i></a>
                    </div>
                </div>`
            );

            // ensure event handling of the items
            handleItem(value);
        })

        // if some items were previously completed, load them accordingly
        if (itemComplete.length > 0){

            // loop on each of the completed items
            itemComplete.forEach(function(value){

                // check on the itemList items
                const items = itemList.querySelectorAll('.item');
                items.forEach(function(item){
                    if (item.querySelector('.item-name').textContent === value){
                            
                            // mark the previously completed, where found
                            item.querySelector('.item-name').classList.toggle('completed');
                            item.querySelector('.complete-item').classList.toggle('visibility');            
                        
                    }
                });            
            });
        }

        // display success message on displaying the history
        showFeedback('to do list history loaded', 'success');
    }

    // form submission
    itemForm.addEventListener('submit', function(event){
        event.preventDefault();

        // get the item input from the text box
        const textValue = itemInput.value;

        // for empty value, display error message
        if (textValue === ''){
            showFeedback('please enter valid value', 'danger');
        }
        else {
            // add item
            addItem(textValue);

            // clear the text form
            itemInput.value = '';

            // add to item array
            itemData.push(textValue);

            // local storage 
            localStorage.setItem('list', JSON.stringify(itemData));
            localStorage.setItem('itemComplete', JSON.stringify(itemComplete));
            // add event listeners to icons
            // NOTE : we are able to do this with "event propagation"
            // here via the call back function
            handleItem(textValue);
        }
    });

    // show feedback function
    function showFeedback(text,action){
        // feedback div needs to be enabled with the message passed
        feedback.classList.add('showItem', `alert-${action}`);
        feedback.innerHTML = `<p>${text}</p>`;

        // timeout is used to ensure the feedback message automatically erases after 3 seconds
        setTimeout(function(){
            feedback.classList.remove('showItem', `alert-${action}`);
        }, 3000);
    }

    // add item function
    function addItem(value){

        // create a new item div and add to the html
        const div = document.createElement('div');
        div.classList.add('item', 'my-3');
        div.innerHTML = `<h5 class="item-name text-capitalize">${value}</h5>
            <div class="item-icons">
            <a href="#" class="complete-item mx-2 item-icon"><i class="far fa-check-circle"></i></a>
            <a href="#" class="edit-item mx-2 item-icon"><i class="far fa-edit"></i></a>
            <a href="#" class="delete-item item-icon"><i class="far fa-times-circle"></i></a>
            </div>
        </div>`;
        itemList.appendChild(div);
    }

    // handle items function
    function handleItem(textValue){
        const items = itemList.querySelectorAll('.item');
        items.forEach(function(item){
            if (item.querySelector('.item-name').textContent === textValue){
                // complete event listener
                item.querySelector('.complete-item').addEventListener('click', function(){
                    item.querySelector('.item-name').classList.toggle('completed');
                    this.classList.toggle('visibility');
                    
                    // if item has just been completed, add it to the item complete
                    if (item.querySelector('.item-name').classList.contains('completed')) {
                        itemComplete.push(textValue);
                    }
                    // otherwise, an uncompleted marked item must be removed
                    else {
                        itemComplete = itemComplete.filter(function(item){
                            return item!== textValue;
                        });                    
                    }
                    localStorage.setItem('itemComplete', JSON.stringify(itemComplete));
                });

                // edit event listener
                item.querySelector('.edit-item').addEventListener('click', function(){
                    // save the updated value
                    itemInput.value = textValue;
                    // remove the previous value from itemList
                    itemList.removeChild(item);
                    // update itemData to have all the previous values except the current one we have edited
                    itemData = itemData.filter(function(item){
                        return item!== textValue;
                    });
                    localStorage.setItem('list', JSON.stringify(itemData));
                });

                // delete event listener
                item.querySelector('.delete-item').addEventListener('click', function(){

                    // remove the value to delete from itemList
                    itemList.removeChild(item);
                    // update itemData to have all the values except the one we need to delete 
                    itemData = itemData.filter(function(item){
                        return item!== textValue;
                    });
                    localStorage.setItem('list', JSON.stringify(itemData));

                    // update item complete to have all the values except the one we need to delete 
                    itemComplete = itemComplete.filter(function(item){
                        return item!== textValue;
                    });
                    localStorage.setItem('itemComplete', JSON.stringify(itemComplete));                    

                    showFeedback('item delete', 'success');
                });
            }
        });
    }

    // event listener from the clear button click
    clearBtn.addEventListener('click', function(){

        // empty out the itemData
        itemData = [];
        itemComplete = [];
        localStorage.removeItem('list');
        localStorage.removeItem('itemComplete');
        // get all items
        const items = itemList.querySelectorAll('.item');

        // for all items in the list, remove each
        if (items.length>0){
            items.forEach(function(item){
                itemList.removeChild(item);
            });
        }
    });
})();