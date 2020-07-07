var i = 2;
function showLogin()
{
  document.getElementById('formCheck').style.visibility="visible";
  document.getElementById('container').style.display="none";
}

function find()
{
  var element = document.getElementById('showHidden');
  if(element.style.display!="block"){
    element.style.display="block";
  }else{
    alert("Find Patient Already Open!");
  }
}

function hide()
{
  document.getElementById('showHidden').style.display="none";
}

function addToTable()
{
  var table = document.getElementById('addToTable');
  var row = table.insertRow(i);

  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  cell1.innerHTML = "<td id='entry'>"+i+"</td>";
  cell2.innerHTML = "<td id='id'>546725364</td>";
  cell3.innerHTML = "<td><textarea rows='3' cols ='40'></textarea></td>";
  i++;

}
