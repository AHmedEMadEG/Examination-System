export class User{
    constructor(fn,ln,email,password){
        this.firstName = fn;
        this.lastName = ln;
        this.email = email;
        this.password = password;
        this.lastScore = null;
    }
}