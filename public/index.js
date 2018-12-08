// Initialize Firebase
var config = {
    apiKey: "AIzaSyAbsjbGgCq-W1dQRfBT9FvSzTy61VimauI",
    authDomain: "mememasterdb.firebaseapp.com",
    databaseURL: "https://mememasterdb.firebaseio.com",
    projectId: "mememasterdb",
    storageBucket: "mememasterdb.appspot.com",
    messagingSenderId: "732615011763"
};
firebase.initializeApp(config);
var database = firebase.database();
function checkIfSignedIn() {
    firebase.auth.onAuthStateChanged(function (user) {
        if (user) {
            window.location.href = "viewmemes.html"
        }
    })
}
function signIn() {
    alert("Signing in");
    var userEmail = document.getElementById('email').value;
    var userPass = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // Alerts user if incorrect password or other errors occur.
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });
    firebase.auth().onAuthStateChanged(function (user) {
        // Moves user to home page once signed in.
        if (user) {
            window.location.href = "viewmemes.html";
        }
    });
}
//}

function register() {
    var database = firebase.database();
    var userEmail = document.getElementById("registeremail").value;
    var userPass = document.getElementById("registerpassword").value;
    var checkPass = document.getElementById("registerpassword2").value;
    if (userPass != checkPass) {
        alert("password fields do not match");
        return;
    }
    firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).then(function () {
        // If user signs up successfully, moves user back to login
        alert("You have successfully registered for an account!");
        setTimeout(registerUser(userEmail, userPass), 1000);
        document.getElementById('email').value = userEmail;
        document.getElementById('password').value = userPass;
        setTimeout(signIn(), 1000);
    }).catch(function (error) {
        // Handle Errors here.
        alert(userPass);
        alert(checkPass);
        var errorCode = error.code;
        var errorMessage = error.message;
        // Alerts user if weak password or other errors occur.
        if (errorCode === "auth/weak-password") {
            alert("The password is too weak.");
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });
    //setTimeout(firebase.auth().signInWithEmailAndPassword(userEmail, userPass), 3000); 
}

function registerUser(userEmail, userPass) {
    var userId = firebase.auth().currentUser.uid;
    var userRef = firebase.database().ref("/Users");
    var userIdRef = userRef.child(userId).set({
        Email: userEmail,
        Password: userPass
    });
}

