const users = [];

class User {
    constructor(id, name, email, password, secret) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.secret = secret;
    }
}
export default { users, User };