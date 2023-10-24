import 'dotenv/config';
import express from 'express';
import * as appModel from './application-model.mjs';

const PORT = process.env.PORT;
const app = express();
app.use(express.json());

const userRouter = express.Router();
const loginItemRouter = express.Router();
const notesRouter = express.Router();

app.use('/users', userRouter);
app.use('/login_items', loginItemRouter);
app.use('/notes', notesRouter);

// CREATE (POST) controller ******************************************

// POST REQUESTS
// Request: INSERT COMMENT
// Response (Sucess): INSERT COMMENT
// Response (FAILURE): INSERT COMMENT

// POST Users Table endpoint ****************************************************
userRouter.post('/', (req,res) => { 
    appModel.createUser(req.body.username, req.body.email, req.body.password, (err, result) => {
        if (err) throw err;
        if (result.length == 0) res.status(400).send({"error": "Could not create user"});
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(201).end();
        }
    })
});

// POST UserLoginItems Table endpoint ****************************************************
loginItemRouter.post('/', (req,res) => { 
    appModel.createUserLoginItem(req.body.website, req.body.username, req.body.password, 
        req.body.dateCreated, req.body.dateUpdated, req.body.dateAccessed, req.body.userID, (err, result) => {
        if (err) throw err;
        if (result.length == 0) res.status(400).send({"error": "Could not create user login item"});
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(201).end();
        }
    })
});

// POST UserNotes Table endpoint ****************************************************
notesRouter.post('/', (req,res) => { 
    appModel.createUserNote(req.body.title, req.body.text,
        req.body.dateCreated, req.body.dateUpdated, req.body.dateAccessed, req.body.userID, (err, result) => {
        if (err) throw err;
        if (result.length == 0) res.status(400).send({"error": "Could not create user login item"});
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(201).end();
        }
    })
});

// GET HTTP ENDPOINTS ****************************************************

// GET Users Table endpoints ****************************************************
userRouter.get('/', (req,res) => { 
    appModel.getAllUsers((err, result) => {
        if (err) throw err;
        if (result.length == 0) res.status(404).send({"error": "Could not retrieve user from specified username"});
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(result));
        }
    })
});

userRouter.get('/:username', (req,res) => { 
    appModel.getUserByUsername(req.params.username, (err, result) => {
        if (err) throw err;
        if (result.length == 0) res.status(404).send({"error": "Could not retrieve user from specified username"});
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(result));
        }
    })
});

// GET UserLoginItems Table endpoints ****************************************************
loginItemRouter.get('/', (req,res) => { 
    appModel.getAllLoginItems((err, result) => {
        if (err) throw err;
        if (result.length == 0) res.status(404).send({"error": "Could not retrieve user login items"});
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(result));
        }
    })
});

loginItemRouter.get('/users/:id', (req,res) => { 
    appModel.getSingleUserLoginItems(req.params.id, (err, result) => {
        if (err) throw err;
        if (result.length == 0) res.status(404).send({"error": "No user login items found for specified user ID"});
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(result));
        }
    })
});

loginItemRouter.get('/users/:id/website/:website', (req,res) => { 
    appModel.getUserLoginItemByWebsite(req.params.id, req.params.website, (err, result) => {
        if (err) throw err;
        if (result.length == 0) res.status(404).send({"error": "No user login items found for specified user ID with given website"});
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(result));
        }
    })
});

loginItemRouter.get('/users/:id/username/:username', (req,res) => { 
    appModel.getUserLoginItemByUsername(req.params.id, req.params.username, (err, result) => {
        if (err) throw err;
        if (result.length == 0) res.status(404).send({"error": "No user login items found for specified user ID with given username"});
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(result));
        }
    })
});

// GET UserNotes Table endpoints ****************************************************
notesRouter.get('/', (req,res) => { 
    appModel.getAllUserNotes((err, result) => {
        if (err) throw err;
        if (result.length == 0) res.status(404).send({"error": "Could not retrieve user notes"});
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(result));
        }
    })
});

notesRouter.get('/users/:id', (req,res) => { 
    appModel.getSingleUserNotes(req.params.id, (err, result) => {
        if (err) throw err;
        if (result.length == 0) res.status(404).send({"error": "No notes found for specified user ID"});
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(result));
        }
    })
});

notesRouter.get('/users/:id/title/:title', (req,res) => { 
    appModel.getUserNoteByTitle(req.params.id, req.params.title, (err, result) => {
        if (err) throw err;
        if (result.length == 0) res.status(404).send({"error": "No notes found for specified user ID with given title"});
        else {
            console.log(result);
            res.set('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(result));
        }
    })
});

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

/*
    LISTENER
*/
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});