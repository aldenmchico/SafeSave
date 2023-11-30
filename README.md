
<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--



<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">SafeSave</h3>

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
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <!-- <li><a href="#contributing">Contributing</a></li> -->
    <!-- <li><a href="#license">License</a></li> -->
    <!-- <li><a href="#contact">Contact</a></li> -->
    <!-- <li><a href="#acknowledgments">Acknowledgments</a></li> -->
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

SafeSave is a fully secure password and personal information web application management system. SafeSave completely masks the data entered into the database by using modern AES 265 CBC data encryption to ensure that the user’s information is not compromised in the case that SafeSave’s database is exposed to bad actors. The web application supports different user accounts, each with access to their data and their data alone, along with two factor authentication to ensure the highest level of security for users on the SafeSave platform. Multiple microservices handle different functionality seen across the platform such as user log ins, data encryption, two factor authentication, etc. to isolate independent aspects of the web application system. Overall, SafeSave provides users with a totally encrypted solution to saving their passwords and personal notes that only the intended user can possibly access.​

[![Product Name Screen Shot][product-screenshot]](https://github.com/EugenSong/EugenSong/assets/75242911/b68cd924-93de-4372-a9d4-e17f6dd5da33)


<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With
* **React** frontend user interface
* **Javascript** primary programming language
* **MySQL** for database storage
* **ExpressJS** for backend server code


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

4. Import database schema into MySQL instance, `enhancedCookieSecurity.db`
5. Run all Microservices using `start` script
   ```sh
   ./start
   ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

#### Adding Login/Note Item
---
#### Editing Login/Note Item
---
#### Deleting Item
---
#### Favoriting Item
---
#### 2-Factor Authentication Setup
---
#### 2-Factor Authentication Login
---

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
    - [ ] Nested Feature


<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- MARKDOWN LINKS & IMAGES -->
[product-screenshot]: https://github.com/EugenSong/EugenSong/assets/75242911/b68cd924-93de-4372-a9d4-e17f6dd5da33
