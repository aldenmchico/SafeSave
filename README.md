
<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--



<!-- PROJECT LOGO -->
<br />
<div align="center">

<h1 align="center"><a href="https://safesave.ddns.net">SafeSave</a></h1>

  <p align="center">
    a complete, secure data and notes management web application
    <br />
    <!-- <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a> -->
    <br />
    <br />
    · <a href="https://github.com/github_username/repo_name">View Demo</a>
    ·
  </p>

</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    
    <!-- <li><a href="#contributing">Contributing</a></li> -->
    <!-- <li><a href="#license">License</a></li> -->
    <!-- <li><a href="#contact">Contact</a></li> -->
    <!-- <li><a href="#acknowledgments">Acknowledgments</a></li> -->
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

SafeSave is a fully secure password and personal information web application management system. SafeSave completely masks the data entered into the database by using modern AES 256 CBC data encryption to ensure that the user’s information is not compromised in the case that SafeSave’s database is exposed to bad actors. The web application supports different user accounts, each with access to their data and their data alone, along with two factor authentication to ensure the highest level of security for users on the SafeSave platform. Multiple microservices handle different functionality seen across the platform such as user log ins, data encryption, two factor authentication, etc. to isolate independent aspects of the web application system. Overall, SafeSave provides users with a totally encrypted solution to saving their passwords and personal notes that only the intended user can possibly access.​

[![Product Name Screen Shot][product-screenshot]](https://github.com/EugenSong/EugenSong/assets/75242911/b68cd924-93de-4372-a9d4-e17f6dd5da33)


<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With
* **React** - frontend user interface
* **Javascript** - primary programming language
* **MySQL** - database storage
* **ExpressJS** - backend server code


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Feature 1: Relational database management system to securely store encrypted user credentials.
- [x] Feature 2: Backend API to manage user data and authentication.
- [x] Feature 3: Front-end website for users to interact with.
- [x] Feature 4: Security will be a primary focus, and we will implement industry-standard encryption techniques, two-factor authentication, and continuous security assessments.

- [ ] Stretch Goal 1: A Mobile app that allows users to manage their passwords and copy to the clipboard for use.
- [ ] Stretch Goal 2: A Browser Extension that will provide users with efficient access to their stored credentials.


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running complete both Prerequisites and Installation steps.

### Prerequisites

1. Before running the app locally, you will need to have an instance of an active MySQL server to drop the database schema into. 


### Installation

1. Clone the repo.
   ```sh
   git clone https://github.com/aldenmchico/SafeSave.git
   ```

2. Recursively install NPM packages throughout project using `npminstall` script.
   ```sh
   ./npminstall
   ```

3. Enter your SQL database config in `replacedbconfig.sh` for both `replacement1` and `replacement2`.
   ```sh
    host: '\''replaceMeWithHost'\'',
    user: '\''replaceMeWithUser'\'',
    password: '\''replaceMeWithPassword'\'',
    database: '\''replaceMeWithDatabase'\'',
   ```

4. Import database schema into MySQL instance by running `source empty_schema.db` within your MySQL terminal.
5. Run all Microservices using `start` script
   ```sh
   ./start
   ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## No log policy

SafeSave does not log any user credentials or decrypted information. Below is a sample of what is logged when a user logs in and fetches their notes. The local version on the main branch logs much more for diagnostic purposes.


```sh
xxx@xxx ~> cat /home/xxx/.forever/735V.log
Express application-controller server started listening on port 3001...
VALIDATION CHECK true
VALIDATION FOR HMAC CHECK PASSED
loginItemRouter/users/userID, userID is: 1
VALIDATION CHECK true
VALIDATION FOR HMAC CHECK PASSED
VALIDATION CHECK true
VALIDATION FOR HMAC CHECK PASSED
loginItemRouter/users/userID, userID is: 1
VALIDATION CHECK true
VALIDATION FOR HMAC CHECK PASSED
VALIDATION CHECK true
VALIDATION FOR HMAC CHECK PASSED
```

## Your data is safe with SafeSave
![ezgif-3-0376bd5763](https://github.com/aldenmchico/SafeSave/assets/97023911/6d35c01b-e9ac-426a-8f41-907ca308a4fc)




<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

#### Encrypting Note/Login Item
```js
POST /ciphertext
{
    userLoginWebsite:
    userLoginUsername:
    userLoginPassword:
    userHash:
    userSalt:
    noteCreatedDate:
    noteUpdatedDate:
    noteAccessedDate:
}
```
#### Decrypting Note/Login Item
```js
POST /decrypttext
{
    userNoteID
    userNoteTitle
    userNoteText
    userNoteCreated
    userNoteUpdated 
    userNoteAccessed
    userID
    userNoteIV
    userNoteTextIV 
    userHash
    userLoginItemID 
    userLoginItemWebsite 
    userLoginItemPassword
    userLoginItemDateCreated userLoginItemDateUpdated
    userLoginItemDateAccessed
    userLoginItemUsername
    websiteIV
    usernameIV
    passwordIV
    authTag
    favorited
}
```

#### Adding Note/Login Item 
```js
POST /login_items 
{
    website:
    username:
    password:
    userLoginItemDateCreated:
    userLoginItemDateUpdated:
    userLoginItemDateAccessed:
}

POST /notes
{
    title:
    content:
    userNoteDateCreated:
    userNoteDateUpdated:
}

```
---
#### Editing Login/Note Item
```js

PATCH /login_items 
{
    userLoginItemID:
    website:
    username:
    password:
    dateUpdated: 
    dateAccessed:
}

PATCH /notes
{
    noteID:
    title:
    text:
    dateUpdated:
    dateAccessed:
}
```
---
#### Deleting Note/Login Item
```js
DELETE /login_items/${_id}
DELETE /notes/${noteID}
```
---
#### Favoriting Note/Login Item
```js
POST /login_items/favorite
{
    loginItemID:
    favorite: 0
}

POST /notes/favorite
{
    noteID:
    favorite: 1
}

```
---
#### 2-Factor Authentication Login
```js
POST /api/verify-2fa-login-token
{
    token: 194263
}
```
---
There are more API endpoints that are not listed but are integral to the project's functionality. For more information, see all files with `-controller.mjs` extension in project.

<p align="right">(<a href="#readme-top">back to top</a>)</p>








<!-- MARKDOWN LINKS & IMAGES -->
[product-screenshot]: https://github.com/EugenSong/EugenSong/assets/75242911/b68cd924-93de-4372-a9d4-e17f6dd5da33
