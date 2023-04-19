class Operation{
    constructor(){
        this.operation = {
            create: "INSERT",
            index: "SELECT",
            edit: "UPDATE",
            delete: "DELETE",
          };
    }
    focus(){
        return this.operation;
    }
}
module.exports = Operation