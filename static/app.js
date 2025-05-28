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

        // Initialize the default message
        this.messages.push({ name: "Sam", message: "Hi. My name is Hanny. How can I help you?" });
        this.updateChatText(chatBox); // Update the chatbox to display the default message

        // Send button functionality
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        // Listen for "Enter" key to send the message
        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

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
                html += '<div class="messages__item messages__item--visitor new-message">' + item.message + '</div>';
            } else {
                // Formats user messages
                html += '<div class="messages__item messages__item--operator new-message">' + item.message + '</div>';
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
