import 'dotenv/config';
import express from 'express';
import * as appModel from './application-model.mjs';

const PORT = process.env.PORT;
const app = express();

// Sets Content-Type to application/json for every HTTP method
app.use(express.json());

// CREATE (POST) controller ******************************************

// POST REQUESTS
// Request: INSERT COMMENT
// Response (Sucess): INSERT COMMENT
// Response (FAILURE): INSERT COMMENT

/*
app.post ('/{INSERT ENDPOINT}', (req,res) => { 
    // Create a new Exercise document if the request is valid
    appModel.{SOME FUNCTION}(
        FUNCTION PARAMETERS
        )
        .then({RETURN-OBJECT (remove curly braces)} => {
            res.status(201).json({RETURN-OBJECT});
        })
        // Catch will occur if a parameter is missing or one of the fields is invalid
        .catch(error => {
            res.status(400).json({ error: 'Invalid request' });
        });
    }
);
*/

// RETRIEVE (GET) controller ****************************************************

// GET REQUESTS
// Request: INSERT COMMENT
// Response (Sucess): INSERT COMMENT
// Response (FAILURE): INSERT COMMENT

/*
app.get('/{INSERT ENDPOINT}', (req,res) => { 
    // Create a new Exercise document if the request is valid
    appModel.{SOME FUNCTION}(
        FUNCTION PARAMETERS
        )
        .then({RETURN-OBJECT (remove curly braces)} => {
            res.status(200).send({RETURN-OBJECT});
        })
        // Catch will occur if a parameter is missing or one of the fields is invalid
        .catch(error => {
            res.status(400).send({ error: 'Unable to retrieve object' });
        });
    }
);
*/

// UPDATE (PUT) controller ************************************

// PUT REQUESTS
// Request: INSERT COMMENT
// Response (Sucess): INSERT COMMENT
// Response (FAILURE): INSERT COMMENT

/*
app.put('/{INSERT ENDPOINT}/:_id', (req,res) => { 
    // Create a new Exercise document if the request is valid
    appModel.{SOME FUNCTION}(
        FUNCTION PARAMETERS
        )
        .then({RETURN-OBJECT (remove curly braces)} => {
            res.status(200).json({_id: req.params._id, ...});
        })
        // Catch will occur if a parameter is missing or one of the fields is invalid
        .catch(error => {
            res.status(404).send({ error: 'Unable to update document' });
        });
    }
);
*/

// UPDATE (DELETE) controller ************************************

// DELETE REQUESTS
// Request: INSERT COMMENT
// Response (Sucess): INSERT COMMENT
// Response (FAILURE): INSERT COMMENT

/*
app.delete('/{INSERT ENDPOINT}/:_id', (req,res) => { 
    // Create a new Exercise document if the request is valid
    appModel.{SOME FUNCTION}(
        req.params._id
        )
        .then({RETURN-OBJECT (remove curly braces)} => {
            res.status(204).send();
        })
        // Catch will occur if a parameter is missing or one of the fields is invalid
        .catch(error => {
            res.status(404).send({ error: 'Specified Document Not Found' });
        });
    }
);
*/

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});