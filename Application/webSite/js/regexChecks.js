
function checkIdNumber(idNumber) {
    var re = /\d{13}/g;

    var test = re.test(idNumber);

    if (test && idNumber.length == 13)
    	return true;
    else
    	return false;
}

function checkCellNumber(cellNumber) {
	var re = /[0]+\d{9}/g;

	var test = re.test(cellNumber);

    if (test && cellNumber.length == 10)
    	return true;
    else
    	return false;
}

function checkEmailReg(email) {
	var re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/g;

	return re.test(email);
}