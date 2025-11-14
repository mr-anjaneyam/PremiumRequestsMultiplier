const express = require('express');
const http = require('http');
const readline = require('readline');

const app = express();
const port = 4000;

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const MAGENTA = "\x1b[35m";

 // Accept text bodies (treat request body as raw text/plain)
app.use(express.text({ type: '*/*' }));


app.post('/user-input', async (req, res) => {
    const content = typeof req.body === 'string' && req.body.trim().length ? req.body.trim() : '';

    // Notify user in the terminal that input is requested.
	console.log('-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*');
    console.log(`${MAGENTA}Input requested:${RESET}`, content || 'No context provided.');

    // Create a readline interface to capture user input.
    const readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readLine.question(`${YELLOW}Type your prompt and press Enter: ${RESET}`, (userInput) => {
        readLine.close();

        if (userInput.trim()) {
			console.log(`${GREEN}Prompt sent succesfully${RESET}`);
            return res.send(userInput.trim());
        } else if (content) {
            // If no input and body content exists, call local assistant.
            askLocalAssistantForInput(content)
                .then((suggestion) => {
                    res.send(suggestion.trim() || 'no response provided');
                })
                .catch((err) => {
                    console.error('Failed to get suggestion from local assistant:', err);
                    res.send('no response provided');
                });
        } else {
            res.send('no response provided');
        }
    });
});


app.listen(port, () => {
  console.log(`${CYAN}${BOLD}══════════════════════════════════════${RESET}`);
  console.log(`${MAGENTA}${BOLD} AI AGENT PREMIUM REQUESTS MULTIPLIER     ${RESET}`);
  console.log(`${CYAN}${BOLD}══════════════════════════════════════${RESET}`);
  console.log(`${GREEN}Server is running on: http://localhost:${port}${RESET}`);
  console.log(`${YELLOW}Let the AI Agent send its request, the server takes it in stride. Sample POST request below:${RESET}`);
  console.log(`${DIM}curl -X POST -H "Content-Type: text/plain" -d 'Confirm whether i can proceed; awaiting user input' http://localhost:${port}/user-input${RESET}`); // helper
  console.log(`${MAGENTA}Awaiting for request...${RESET}`);
});


