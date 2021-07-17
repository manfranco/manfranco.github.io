// This is our index.js file

/*
Create an instance of the secure fields. Pass the public key as the first argument. 
As the second argument, we'll pass a list of custom fonts to be applied to the fields (this is optional).
*/
const fonts = [
    {
        src: 'https://fonts.googleapis.com/css?family=Source+Code+Pro',
    }
]

const style = {
    base: {
        color: '#fff',
        fontWeight: 600,
        fontFamily: 'Quicksand, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':focus': {
            color: '#424770',
        },

        '::placeholder': {
            color: '#9BACC8',
        },

        ':focus::placeholder': {
            color: '#CFD7DF',
        },
    },
    invalid: {
        color: '#FF0000',
        ':focus': {
            color: '#FA755A',
        },
        '::placeholder': {
            color: '#FFCCA5',
        },
    }
};

const formElements = new POS.Fields("3071dae2-a2aa-4af4-ad9b-3b2f632fafab", {
    fonts,
    style
})

/*
Create an object holding additional options that you can pass to the constructor for instantiating 
the credit card and card expiry fields.
There are lots of other options available that you can pass to the constructor, 
but to keep it simple we'll just show this one object in our example. 
*/
const placeholders = {
    cardNumber: '1234 1234 1234 1234',
    expDate: 'MM / YY'
}

// Instantiate the fields you want to show and mount them to the DOM.
const cardNumber = formElements.create('cardNumber', {
    placeholders
})
cardNumber.mount('#card-number')

const expiry = formElements.create('creditCardExpiry', {
    placeholders
})
expiry.mount('#exp-date')

/*
Create a token when the user submits the form, but not until we fetched the card holder's name 
so that we can pass it in an additional data object to the createToken call.
*/
document.getElementById('payment-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const additionalData = {
        holder_name: document.getElementById('cardholder-name').value // This field is mandatory
    }
    const result = await POS.createToken(cardNumber, {
        additionalData,
        environment: 'test' 
    })
    console.log(`The response is ${JSON.stringify(result)}`)
    createPayment();
})


function createPayment() {
    var request = new XMLHttpRequest();
    request.open('POST', 'https://api.paymentsos.com/payments');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('api-version', '1.3.0');
    request.setRequestHeader('x-payments-os-env', 'test');
    request.setRequestHeader('app-id', 'io.github.manfranco.sales-test');
    request.setRequestHeader('private-key', '5f291941-e67e-4f28-a745-1c402e0a0bc1');
    request.setRequestHeader('idempotency-key', 'cust-34532-trans-001356-p');
    const body = {
        'amount': 300,
        'currency': 'USD',
        'statement_soft_descriptor': 'Tablet'
    };
    request.send(JSON.stringify(body));
}