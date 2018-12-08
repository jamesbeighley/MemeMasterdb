var config = {
        apiKey: "AIzaSyAbsjbGgCq-W1dQRfBT9FvSzTy61VimauI",
		authDomain: "mememasterdb.firebaseapp.com",
		databaseURL: "https://mememasterdb.firebaseio.com",
		projectId: "mememasterdb",
		storageBucket: "mememasterdb.appspot.com",
		messagingSenderId: "732615011763"
  	};
  	
firebase.initializeApp(config);

function getBase64(file) {
			return new Promise((resolve, reject) => {
			    const reader = new FileReader();
			    reader.readAsDataURL(file);
			    reader.onload = () => resolve(reader.result);
			    reader.onerror = error => reject(error);
			});
		}
grid = document.getElementById('template');
var storageRef = firebase.storage().ref();

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

getJSON('https://api.imgflip.com/get_memes',
function(err, data) {
	grid.data = data.data.memes;
});

function thisMeme(data){
	console.log(data)
}
firebase.auth().onAuthStateChanged(function(user) { if (user) {
	var userID = firebase.auth().currentUser.uid;
	var ref = firebase.database().ref("Users/"+userID+"/Memes");
	var uRef = firebase.database().ref("Users/"+userID);
	var reader  = new FileReader();
	document.getElementById("submitURL").addEventListener('click',function(){
		var file = document.querySelector('input[type="file"]').files[0];
		getBase64(file).then( data => {uRef.update({currentMeme:data});location.href="composememe.html?url=true";});
	});
}});
