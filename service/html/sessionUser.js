class SessionUser{
    constructor() {
        this.user= {
            id: undefined,
            roleId: undefined,
            roleName: undefined,
            fullName: undefined,
            email: undefined,
            contactNumber: undefined,
            profilePic: undefined,
            ethnicityId: undefined,
            permission:undefined,
            isEnabled:undefined,
            addressfield1:null,
            addressfield2:null,
            addressfield3:null,
            addressfield4:null,
            addressfield5:null,
            addressfield6:null,
            addressfield7:null,
            addressfield8:null,
        }
    }
    draw(data){
        this.user.id = data.id;
        this.user.roleId = data.id;
        this.user.roleName = data.roleName;
        this.user.fullName = data.fullName;
        this.user.email = data.email;
        this.user.contactNumber = data.contactNumber;
        this.user.profilePic = data.profilePic;
        this.user.ethnicityId = data.ethnicityId;
        this.user.permission = JSON.parse(data.permission);
        this.user.isEnabled = data.isEnabled;
        this.user.addressfield1 = data.addressfield1;
        this.user.addressfield2 = data.addressfield2;
        this.user.addressfield3 = data.addressfield3;
        this.user.addressfield4 = data.addressfield4;
        this.user.addressfield5 = data.addressfield5;
        this.user.addressfield6 = data.addressfield6;
        this.user.addressfield7 = data.addressfield7;
        this.user.addressfield8 = data.addressfield8;
        return this.user;
    }
    
}
module.exports = SessionUser