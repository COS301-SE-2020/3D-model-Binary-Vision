
function checkIdNumber(idNumber) {
    var re1 = /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))/g;
    var re2 = /(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)([01]8((( |-)\d{1})|\d{1}))|(\d{4}[01]8\d{1}))/g;

    var test = re1.test(idNumber);

    if (test == true)
        return test;
    else {
        test = re2.test(idNumber);
        return test;
    }

    /*if (test && idNumber.length == 13)
    	return true;
    else
    	return false;*/
}

function checkCellNumber(cellNumber) {
	var re1 = /(\(0\d\d\)\s\d{3}[\s-]+\d{4})|(0\d\d[\s-]+\d{3}[\s-]+\d{4})|(0\d{9})|(\+\d\d\s?[\(\s]\d\d[\)\s]\s?\d{3}[\s-]?\d{4})/g;
    var re2 = /^((0|(\(0\)))?|(00|(\(00\)))?(\s?|-?)(27|\(27\))|((\+27))|(\(\+27\))|\(00(\s?|-?)27\))( |-)?(\(?0?\)?)( |-)?\(?(1[0-9]|2[1-4,7-9]|3[1-6,9]|4[0-9]|5[1,3,6-9]|7[1-4,6,8,9]|8[0-9])\)?(\s?|-?)((\d{3}(\s?|-?)\d{4}$)|((\d{4})(\s?|-?)(\d{3})$)|([0-2](\s?|-?)(\d{3}(\s?|-?)\d{3}$)))/g;

	var test = re1.test(cellNumber);

    if (test == true)
        return test;
    else {
        test = re2.test(cellNumber);
        return test;
    }

    /*if (test && cellNumber.length == 10)
    	return true;
    else
    	return false;*/
}

function checkEmailReg(email) {
	var re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/g;

	return re.test(email);
}

function checkPassword(password) {
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

    return re.test(password);
}

function checkPassport(passportNo) {
    var re = /^(?!^0+$)[a-zA-Z0-9]{9,20}$/g;

    return re.test(passportNo);
}