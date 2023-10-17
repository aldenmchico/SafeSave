import 'dotenv/config';
import express from 'express';
import * as searchDbModel from './search-database-model.mjs';

// Configure express server
const PORT = process.env.PORT;
const app = express();
app.use(express.json());

// GET /search
// Request: Request body is a JSON object with search parameters to be queried
// Response: Success - Response contains JSON object with saved login items that match query parameters
    // Status Code: 201
// Response: Failure - Request is invalid
    // Body: JSON object Error
    // Status Code: 400

app.get ('/search', (req, res) => { 
    searchDbModel.getSearchResults(
        )
        .then(searchResults => {
        })
        // Catch will occur if one of the fields is invalid
        .catch(error => {
            res.status(400).json(error);
        });
    }
);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});