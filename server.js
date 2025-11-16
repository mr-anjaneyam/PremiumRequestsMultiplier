const express = require('express');
const http = require('http');
const readline = require('readline');

const app = express();
const port = 4000;

// Terminal color codes for styling
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const MAGENTA = "\x1b[35m";
const BLUE = "\x1b[34m";
const WHITE = "\x1b[37m";

// Accept text bodies (treat request body as raw text/plain)
app.use(express.text({ type: '*/*' }));

app.post('/prompt', async (req, res) => {
    const content = typeof req.body === 'string' && req.body.trim().length ? req.body.trim() : '';

    // Notify user in the terminal that input is requested.
    console.log(`${MAGENTA}Input requested:${RESET}`, content || 'No context provided.');

    // Create a readline interface to capture user input.
    const readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readLine.question(`${YELLOW}Type your prompt and press Enter: ${RESET}`, (userInput) => {
        readLine.close();

        if (userInput.trim()) {
            console.log(`${GREEN}Prompt sent successfully${RESET}`);
            console.log(`${DIM}--------------------------------------------------${RESET}`);
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

// Function to display a loading animation
function showLoadingAnimation(message) {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;

    const interval = setInterval(() => {
        process.stdout.write(`\r${CYAN}${BOLD}${frames[i]} ${message}${RESET}`);
        i = (i + 1) % frames.length;
    }, 100);

    // Stop the animation after 3 seconds
    setTimeout(() => {
        clearInterval(interval);
        process.stdout.write('\r'); // Clear the line
    }, 3000);
}

app.listen(port, () => {
    // Display loading animation
    showLoadingAnimation('Starting server...');

    // Display server information after the animation
    setTimeout(() => {
        console.log(`${CYAN}${BOLD}═══════════════════════════════════════════════════════════════════════${RESET}`);
        console.log(`${BLUE}${BOLD}🌟 AI AGENT PREMIUM REQUESTS MULTIPLIER 🌟${RESET}`);
        console.log(`${CYAN}${BOLD}═══════════════════════════════════════════════════════════════════════${RESET}`);
        console.log(`${WHITE}${BOLD}Author:${RESET} ${MAGENTA}${BOLD}Sri Anjaneyam${RESET}`);
        console.log(`${GREEN}${BOLD}Server Status:${RESET} ${WHITE}Running at ${CYAN}http://localhost:${port}${RESET}`);
        console.log(`${YELLOW}${BOLD}Instructions:${RESET}`);
        console.log(`${DIM}Use the following sample POST request to interact with the server:${RESET}`);
        console.log(`${CYAN}curl -X POST -H "Content-Type: text/plain" -d 'How can i help you?' http://localhost:${port}/prompt${RESET}`);
        console.log(`${BLUE}${BOLD}═══════════════════════════════════════════════════════════════════════${RESET}`);
        console.log(`${MAGENTA}${BOLD}Awaiting requests...${RESET}`);
    }, 3100); // Wait for the animation to complete
});