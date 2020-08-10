
function initReceptionist()
{
    //getReceptionist Info and populate visual info on page
   var info = getReceptionistInfo();

   console.log(info);

}



function getReceptionistInfo(){
    var response = fetch("/getReceptionist",{
        method:"POST",
        header:{'Content-Type':'Application/json ; charset=UTF-8'}
    });

    var info = [];
    response.then(res=> res.json().then(data=> {

        info[0] = data.name;
        info[1] = data.surname;
        info[3] = data.practition;
        info[4] = data.Note;

        document.getElementById("receptionistName").innerHTML = data.name+" "+ data.surname;
        document.getElementById("receptionistNotes").innerHTML = data.Note;
        // console.log(data);
    }));

    return info;
}


function saveNotes(){
    var noteSpace = document.getElementById('receptionistNotes').value;
    console.log("Note captured to save: "+ noteSpace);
    saveReceptionistNotes(noteSpace);

}