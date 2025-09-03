module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Square Voice Agent</title>
    <script src="https://sandbox.web.squarecdn.com/v1/square.js"></script>
</head>
<body>
    <div id="form-container">
        <div id="card-container"></div>
        <button id="card-button" type="button">Pay $1.00</button>
        <div id="payment-status-container"></div>
        <div class="hint">Not connected. <a href="/api/square/oauth/connect">Connect a seller</a> first.</div>
    </div>

    <script>
        let MERCHANT_ID = null;
        
        async function initializeCard(payments) {
            const card = await payments.card();
            await card.attach('#card-container');
            return card;
        }

        async function createPayment(token) {
            const body = JSON.stringify({
                locationId: MERCHANT_ID,
                sourceId: token,
            });
            const paymentResponse = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });
            if (paymentResponse.ok) {
                return paymentResponse.json();
            }
            const errorDetail = await paymentResponse.text();
            throw new Error(errorDetail);
        }

        async function tokenize(paymentMethod) {
            const tokenResult = await paymentMethod.tokenize();
            if (tokenResult.status === 'OK') {
                return tokenResult.token;
            } else {
                let errorMessage = 'Tokenization failed';
                if (tokenResult.status === 'FAILURE') {
                    errorMessage = tokenResult.errors?.map(e => e.message).join('\\n') || errorMessage;
                }
                throw new Error(errorMessage);
            }
        }

        async function handlePaymentMethodSubmission(event, paymentMethod, card) {
            event.preventDefault();
            enablePaymentForm(false);
            try {
                const token = await tokenize(paymentMethod);
                const paymentResults = await createPayment(token);
                displayPaymentResults('SUCCESS');
                console.log('Payment Success', paymentResults);
            } catch (e) {
                displayPaymentResults('FAILURE');
                console.error(e.message);
            }
            enablePaymentForm(true);
        }

        function enablePaymentForm(enable) {
            const cardButton = document.getElementById('card-button');
            cardButton.disabled = !enable;
        }

        function displayPaymentResults(status) {
            const statusContainer = document.getElementById('payment-status-container');
            if (status === 'SUCCESS') {
                statusContainer.innerHTML = '<div id="success" class="success">Payment successful!</div>';
            } else {
                statusContainer.innerHTML = '<div id="failure" class="failure">Payment failed!</div>';
            }
        }

        (async function init(){
            if (!MERCHANT_ID) {
                document.querySelector('.hint').innerHTML = 'Not connected. <a href="/api/square/oauth/connect">Connect a seller</a> first.';
                return;
            }
            
            const payments = Square.payments('sandbox-sq0idb-EEpHXdJOuHwwWcRjpMVz0c', MERCHANT_ID);
            const card = await initializeCard(payments);
            const cardButton = document.getElementById('card-button');
            cardButton.addEventListener('click', async function(event) {
                await handlePaymentMethodSubmission(event, card);
            });
        })();
    </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
