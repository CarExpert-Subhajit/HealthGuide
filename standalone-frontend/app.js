class Chatbox {
    constructor() {
        // Selects the essential DOM elements for the chatbot
        this.args = {
            openButton: document.querySelector('.chatbox__button'), // Button to open the chatbox
            chatBox: document.querySelector('.chatbox__support'),  // Chatbox container
            sendButton: document.querySelector('.send__button')    // Button to send messages
        }

        this.state = false; // Keeps track of whether the chatbox is open or closed
        this.messages = []; // Stores chat messages
    }

    display() {
        const { chatBox, sendButton } = this.args;
    
        // Remove toggle functionality since the chatbox is always visible
        // openButton.addEventListener('click', () => this.toggleState(chatBox));
    
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));
    
        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }
    
    // display() {
    //     // Destructures the required elements from this.args
    //     const {openButton, chatBox, sendButton} = this.args;

    //     // Adds a click event to toggle the chatbox open/close
    //     openButton.addEventListener('click', () => this.toggleState(chatBox))

    //     // Adds a click event to send a message
    //     sendButton.addEventListener('click', () => this.onSendButton(chatBox))

    //     // Adds an event to detect "Enter" key for sending a message
    //     const node = chatBox.querySelector('input');
    //     node.addEventListener("keyup", ({key}) => {
    //         if (key === "Enter") {
    //             this.onSendButton(chatBox) // Sends the message on pressing Enter
    //         }
    //     })
    // }



    // toggleState(chatbox) {
    //     this.state = !this.state; // Toggles the state between open (true) and closed (false)

    //     // Shows or hides the chatbox based on the state
    //     if(this.state) {
    //         chatbox.classList.add('chatbox--active') // Adds a class to make chatbox visible
    //     } else {
    //         chatbox.classList.remove('chatbox--active') // Removes the class to hide chatbox
    //     }
    // }

    onSendButton(chatbox) {
        // Selects the input field and gets the user's message
        var textField = chatbox.querySelector('input');
        let text1 = textField.value;

        // Prevents empty messages from being sent
        if (text1 === "") {
            return;
        }

        // Adds the user's message to the messages array
        let msg1 = { name: "User", message: text1 };
        this.messages.push(msg1);

        // Sends the user's message to the server for a response
        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST', // HTTP POST method
            body: JSON.stringify({ message: text1 }), // Sends the message in JSON format
            mode: 'cors', // Allows cross-origin requests
            headers: {
              'Content-Type': 'application/json' // Specifies JSON content type
            },
        })
        .then(r => r.json()) // Parses the JSON response from the server
        .then(r => {
            // Adds the bot's response to the messages array
            let msg2 = { name: "Sam", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox); // Updates the chatbox with new messages
            textField.value = ''; // Clears the input field
        })
        .catch((error) => {
            console.error('Error:', error); // Logs any error to the console
            this.updateChatText(chatbox); // Updates the chatbox even if there's an error
            textField.value = ''; // Clears the input field
        });
    }

    updateChatText(chatbox) {
        // Generates the HTML for the messages in reverse order (most recent at the top)
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam") {
                // Formats bot messages
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            } else {
                // Formats user messages
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
            }
        });

        // Updates the chatbox with the generated HTML
        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

// Creates an instance of the Chatbox class and initializes it
const chatbox = new Chatbox();
chatbox.display();
