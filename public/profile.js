var myPassword = "*******";
var storage = firebase.storage().ref();
var root = firebase.database().ref("Users");
var userId;
var currentUser;


window.onload = function () {

    firebase.auth().onAuthStateChanged(function(user){
        // User is signed in: set userId and teamId
        if (user){
            userId = user.uid;
            currentUser = user;

            // Check values
            console.log("userId has been set: "+ userId);

            document.getElementById('Password').innerHTML = myPassword.toString();
        }
        // No user is signed in.
        else{
            console.log('User is not logged in. !!')
        }
    });
}



function passwordChange() {
  var temp = document.getElementById("PasswordRow");
  temp.style = "display: none";
  document.getElementById("curPassword").style = "";
  document.getElementById("newPassword").style = "";
  document.getElementById("re-enterPW").style = "";
  document.getElementById("passwordSave").hidden = false;
  document.getElementById("passwordCancel").hidden = false;
  document.getElementById("currentPW").value = "";
  document.getElementById("newPW").value = "";
  document.getElementById("reenterPW").value = "";
}


function passwordSave() {
  var curPassword = document.getElementById("currentPW").value;
  var newPassword1 = document.getElementById("newPW").value;
  var newPassword2 = document.getElementById("reenterPW").value;
  var databasePassword = root.child(userId).child("Password");

  if (curPassword == "" || newPassword1 == "" || newPassword1 == "") {
    alert("Password Field Is Missing !!");
    return false;
  } else if (newPassword1.length < "4") {
    alert(
      "Your new password is not long enough! Please enter a new password !"
    );
    return false;
  }
  databasePassword.once("value", function (snapshot) {
    databasePassword = snapshot.val();
    if (databasePassword !== curPassword) {
      alert("Your current password is incorrect. Please Try Again");
    } else if (newPassword2 !== newPassword1) {
      alert(
        "The confirm password does not match the new password. Please try again"
      );
    } else {
        currentUser.updatePassword(newPassword1).then(function () {
            alert('You have successfully changed your password');
            root.child(userId).child('Password').set(newPassword1.toString());
            donePasswordEdit();
        }).catch(function (error) {
            alert('An error has occurred. Please try again')
        })
     }
    });
}

function passwordCancel() {
  document.getElementById("Password").innerHTML = myPassword.toString();
  donePasswordEdit();
}



function donePasswordEdit() {
  document.getElementById("passwordEdit").hidden = false;
  document.getElementById("passwordSave").hidden = true;
  document.getElementById("passwordCancel").hidden = true;
  document.getElementById("curPassword").style = "display : none";
  document.getElementById("newPassword").style = "display : none";
  document.getElementById("re-enterPW").style = "display : none";
  document.getElementById("PasswordRow").style = "";
}

var fileUpload = document.getElementById('upload');

fileUpload.addEventListener('change', function(e){
    var file = e.target.files[0];
    var databaseStorage = firebase.storage().ref().child(userId);
    databaseStorage.put(file);
    var reader = new FileReader();
    reader.onload = function(){
        var image = reader.result;
        document.getElementById('Pic').src = image;
        //document.getElementById('icon').src = image;
    }
    reader.readAsDataURL(file);
})




function signOut() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("Signing out");
      firebase.auth().signOut();
    }
  });
}