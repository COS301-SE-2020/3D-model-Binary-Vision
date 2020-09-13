
<img name="image" src="/grCode"></img>



function getStl() 
{
    var response = fetch("/consultation/"+id+"/stl");

    response.then(res=> res.blob().then(blob => 
    {

        // work with blob to do render as the stl file 

    }))
    
}