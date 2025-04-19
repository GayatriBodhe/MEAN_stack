const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>File Append</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 50px; }
                form { max-width: 400px; }
                label { display: block; margin: 10px 0 5px; }
                input { width: 100%; padding: 8px; margin-bottom: 10px; }
                button { padding: 10px 20px; background-color: #4CAF50; color: white; border: none; cursor: pointer; }
                button:hover { background-color: #45a049; }
                p { color: green; }
                .error { color: red; }
            </style>
        </head>
        <body>
            <h2>Append File Contents</h2>
            <form action="/append" method="POST">
                <label for="sourceFile">Source File Name (e.g., source.txt):</label>
                <input type="text" id="sourceFile" name="sourceFile" required>
                <label for="targetFile">Target File Name (e.g., target.txt):</label>
                <input type="text" id="targetFile" name="targetFile" required>
                <button type="submit">Append Files</button>
            </form>
        </body>
        </html>
    `);
});

// Handle form submission
app.post('/append', async (req, res) => {
    const { sourceFile, targetFile } = req.body;

    try {
        // Resolve file paths to prevent path traversal
        const sourcePath = path.resolve(__dirname, sourceFile);
        const targetPath = path.resolve(__dirname, targetFile);

        // Read content from source file
        const content = await fs.readFile(sourcePath, 'utf8');

        // Append content to target file
        await fs.appendFile(targetPath, content);

        // Send success response
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Success</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 50px; }
                    p { color: green; }
                    a { color: blue; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <p>Content from ${sourceFile} has been successfully appended to ${targetFile}!</p>
                <a href="/">Go Back</a>
            </body>
            </html>
        `);
    } catch (error) {
        // Send error response
        res.status(500).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Error</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 50px; }
                    p { color: red; }
                    a { color: blue; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <p>Error: ${error.message}</p>
                <a href="/">Go Back</a>
            </body>
            </html>
        `);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});