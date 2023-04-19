exports.validator = (req, res, next) => {
    var rest;
    const title = "SalonFinder";
    req.check('fullname', "Enter Full Name").notEmpty();
    req.check('email', "Enter Email").notEmpty();
    req.check('contactNumber', "Enter Contact Number").notEmpty();
    req.check('password', "Please enter a password in between 6 to 20 digits & uppercase, lowercase, digits & special characters").isLength({
        min : 6,
        max : 20
    }).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/, "i");

    const error = req.validationErrors();

    if(error) {
        // const firstError = error.map(error => error.msg)[0];
        
        let temp = [];
        let errorData = [];
        error.forEach(a => {
            if(!temp.includes(a.param)){
                errorData.push(a);
                temp.push(a.param)
            }
        });
        req.session.errorData = errorData;
        req.session.bodyData = req.body
        return res.redirect("register");
        // res.status(400).json({ error: firstError});
    }
    next();
}