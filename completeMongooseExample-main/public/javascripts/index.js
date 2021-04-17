
function HW(pClassName, pAssignmentName, pSubmitted, pScore) {
    this.className = pClassName;
    this.assignmentName = pAssignmentName;
    this.submitted = pSubmitted;
    this.score = pScore;
  }
  var ClientNotes = [];  // our local copy of the cloud data

// POST
document.addEventListener("DOMContentLoaded", function (event) {

    document.getElementById("submit").addEventListener("click", function () {
        var tClassName = document.getElementById("className").value;
        var tAssignmentName = document.getElementById("assignmentName").value;
        var tSubmitted = document.getElementById("submitted").value;
        var tScore = document.getElementById("score").value;
        var oneHW = new HW(tClassName, tAssignmentName, tSubmitted, tScore);

        $.ajax({
            url: '/NewHW' ,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(oneHW),
            success: function (result) {
                clearAddGridComponents();
                showSuccessAddNotif();
                updateList();
            }
        });
    });

    document.getElementById("get").addEventListener("click", function () {
        updateList()
    });
  
    document.getElementById("delete").addEventListener("click", function () {
        
        var whichHW = document.getElementById('deleteAssignmentName').value;
        var idToDelete = "";
        for(i=0; i< ClientNotes.length; i++){
            if(ClientNotes[i].title === whichHW) {
                idToDelete = ClientNotes[i]._id;
           }
        }
        
        if(idToDelete != "")
        {
                     $.ajax({  
                    url: 'DeleteHW/'+ idToDelete,
                    type: 'DELETE',  
                    contentType: 'application/json',  
                    success: function (response) {  
                        console.log(response);  
                    },  
                    error: function () {  
                        console.log('Error in Operation');  
                    }  
                });  
        }
        else {
            console.log("no matching Assignment");
        } 
    });

    document.getElementById("msubmit").addEventListener("click", function () {
        var tClassName = document.getElementById("className").value;
        var tAssignmentName = document.getElementById("assignmentName").value;
        var tSubmitted = document.getElementById("submitted").value;
        var tScore = document.getElementById("score").value;
        var oneHW = new HW(tClassName, tAssignmentName, tSubmitted, tScore);
        
            $.ajax({
                url: 'UpdateHW/'+idToFind,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(oneHW),
                    success: function (response) {  
                        console.log(response);  
                    },  
                    error: function () {  
                        console.log('Error in Operation');  
                    }  
                });  
            
       
    });

    var idToFind = ""; // using the same value from the find operation for the modify
    // find one to modify
    document.getElementById("find").addEventListener("click", function () {
        var tAssignmentName = document.getElementById("modAssignmentName").value;
         idToFind = "";
        for(i=0; i< ClientNotes.length; i++){
            if(ClientNotes[i].assignmentName === tAssignmentName) {
                idToFind = ClientNotes[i]._id;
           }
        }
        // console.log(idToFind);
 
        $.get("/FindHW/"+ idToFind, function(data, status){ 
            document.getElementById("mclassName").value = data[0].className;
            document.getElementById("massignmentName").value= data[0].assignmentName;
            document.getElementById("msubmitted").value = data[0].submitted;
            document.getElementById("mscore").value = data[0].score;
        }).fail(function() {
            console.log("FindHW Failed");
            showFoundErrorMessage(tAssignmentName);
            document.getElementById("modAssignmentName").value = "";
        });
        
    });

    // get the server data into the local array
    updateList();

});


function updateList() {
    // console.log("Into updateList()");
    var ul = document.getElementById('listUl');
    ul.innerHTML = "";  // clears existing list so we don't duplicate old ones

    $.get("/HWs", function(data, status){  // AJAX get
        ClientNotes = data;  // put the returned server json data into our local array

        // sort array by one property
        ClientNotes.sort(compare);  // see compare method below
        ClientNotes.forEach(ProcessOneHW); // build one li for each item in array
        function ProcessOneHW(item, index) {
            var li = document.createElement('li');
            ul.appendChild(li);

            li.innerHTML=li.innerHTML + index + ": " + " Class: " + 
                item.className + " Assignment: " + item.assignmentName + 
                " Submitted: " + item.submitted + " Score:  " + item.score;
        }
    });
}

function compare(a,b) {
    if (a.submitted == false && b.submitted== true) {
        return -1;
    }
    if (a.submitted == false && b.submitted== true) {
        return 1;
    }
    return 0;
}

function clearAddGridComponents() {
    document.getElementById("className").value = "";
    document.getElementById("assignmentName").value = "";
    document.getElementById("submitted").value = "";
    document.getElementById("score").value = "";
}

function showSuccessAddNotif() {
    document.getElementById("addNotif").innerHTML = "Added Successfully!";
    setTimeout(function(){
        document.getElementById("addNotif").innerHTML = '';
    }, 3000);
}

function showFoundErrorMessage(assignName) {
    const msg = "Assignment \'" + assignName + "\' not found.";
    document.getElementById("findErrorMsg").innerHTML = msg;
    setTimeout(function(){
        document.getElementById("findErrorMsg").innerHTML = '';
    }, 3000);

}