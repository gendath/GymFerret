class appError extends Error{
    constructor(msg, code){
        super()
        this.message=msg;
        this.status=code;
    }
}
module.exports =appError   