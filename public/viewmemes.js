var config = {
        apiKey: "AIzaSyAbsjbGgCq-W1dQRfBT9FvSzTy61VimauI",
		authDomain: "mememasterdb.firebaseapp.com",
		databaseURL: "https://mememasterdb.firebaseio.com",
		projectId: "mememasterdb",
		storageBucket: "mememasterdb.appspot.com",
		messagingSenderId: "732615011763"
  	};
firebase.initializeApp(config);
  	
function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};
function emailImage(url){
	var image = new Image();
	image.src = 'data:image/png;base64,iVBORw0K...';
	return image;
}
var grid = document.getElementById('grid');
function removeElement(elementId) {
	// Removes an element from the document.
	var element = document. getElementById(elementId);
	element. parentNode. removeChild(element);
}

firebase.auth().onAuthStateChanged(function(user) { if (user) {
	var userID = firebase.auth().currentUser.uid;
	var ref = firebase.database().ref("Users/"+userID+"/Memes");
	ref.once("value").then(function(snapshot) {
		var string = JSON.stringify(snapshotToArray(snapshot));
		//console.log(string);
		grid.setAttribute("data", string);
		var shareButtons = document.getElementsByClassName("share");
		for(var i=0;i<shareButtons.length;i++)
		{
			shareButtons[i].addEventListener('click', function(){
				var file = this.value.split(',')[1];
			    var databaseStorage = firebase.storage().ref().child(userID);
			    databaseStorage.putString(file,'base64');
			    setTimeout(function(){
				    databaseStorage.getDownloadURL().then(function(url){
				        console.log( url);
				        javascript:window.location='mailto:?subject=Copy and Paste this link in your browser to view a Meme &body='+url.split('&')[0]+'%26'+url.split('&')[1];
				        
				});}, 1000);
			})
		}
		var deleteButtons = document.getElementsByClassName("delete");
		for(var i=0;i<deleteButtons.length;i++)
		{
			deleteButtons[i].addEventListener('click', function(){
				if(confirm("Are you sure you want to delete this Meme?"))
				{
					var delRef=ref.child(this.value);
					delRef.remove();
					location.reload();
				}
			});
		}
		var editButtons = document.getElementsByClassName("edit");
		for(var i=0;i<deleteButtons.length;i++)
		{
			editButtons[i].addEventListener('click', function(){
				ref = firebase.database().ref("Users/"+userID).update(
					{
						currentMeme: this.value
					});
				window.location.href="./composememe.html?url=false"
			});
		}
	});
}});