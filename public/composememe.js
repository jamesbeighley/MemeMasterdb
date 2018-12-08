var config = {
        apiKey: "AIzaSyAbsjbGgCq-W1dQRfBT9FvSzTy61VimauI",
		authDomain: "mememasterdb.firebaseapp.com",
		databaseURL: "https://mememasterdb.firebaseio.com",
		projectId: "mememasterdb",
		storageBucket: "mememasterdb.appspot.com",
		messagingSenderId: "732615011763"
  	};
  	
firebase.initializeApp(config);
var title;
var tags;
function addText(){
			let string = document.getElementById('text').value;
			document.getElementById('text').value = "";
			let textAdded = new fabric.IText(string);
			textAdded.fill = '#FFFFFF';
			textAdded.stroke = '#000000';
			
			textAdded.fontFamily = 'Impact';
			canvas.add(textAdded)
		};
		
		function removeText(obj){
			canvas.remove(obj);
		};
		
		async function saveImage(){
			let jsonCanvas;
			jsonCanvas = await stringifyCanvas();
			console.log(jsonCanvas);
		};
		
		function stringifyCanvas()
		{
		    //array of the attributes not saved by default that I want to save
		    var additionalFields = ['selectable', 'uid', 'custom']; 
		
		    sCanvas = JSON.stringify(canvas);
		    oCanvas = JSON.parse(sCanvas) ;
		    $.each(oCanvas.objects, function(n, object) {
		        $.each(additionalFields, function(m, field) {
		            oCanvas.objects[n][field] = canvas.item(n)[field];
		        });
		    });
		
		    return JSON.stringify(oCanvas);     
		};

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        console.log(item);
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

var canvas = new fabric.Canvas('c');
var currentMeme;
var width=0;
var height=0;
firebase.auth().onAuthStateChanged(function(user) { if (user) {
	var userID = firebase.auth().currentUser.uid;
	var ref = firebase.database().ref("Users/"+userID+"/Memes");
	var chRef;
	//console.log(ref);
	
	const urlParams = new URLSearchParams(window.location.search);
	var url = urlParams.get('url');
	firebase.database().ref("Users/"+userID+"/currentMeme").once("value").then(function(snapshot){currentMeme=snapshot.val();});
	setTimeout(function(){if(url=="false")
	{
		firebase.database().ref("Users/"+userID+"/currentMeme").once("value").then(function(snapshot){
			chRef=ref.child(currentMeme);
			ref.child(currentMeme+"/canvas").once("value").then(function(child){
				canvas.loadFromJSON(child.val(),canvas.renderAll.bind(canvas));
			})
			
		});
		setTimeout(function(){
			chRef.child("dimension").once("value").then(function(snapshot){
					canvas.setHeight(snapshot.val()[0]);
					canvas.setWidth(snapshot.val()[1]);		
			});
			chRef.child("title").once("value").then(function(snapshot){
				if(snapshot.val()!=undefined)
					document.getElementById('title').value=snapshot.val();
			});
			chRef.child("tags").once("value").then(function(snapshot){
				if(snapshot.val()!=undefined)
					document.getElementById('tags').value=snapshot.val();
			});
		}, 1000);
	}
	else{
		var img = new Image();
		if(url=="true")
			url=currentMeme;
		img.addEventListener("load", function(){
			let factor = 400;
			if(this.height>this.width){
				height = factor;
				width = (factor/this.height)*this.width;
			}
			else{
				width = factor;
				height = (factor/this.width)*this.height;
			}
		    canvas.setHeight(height);
			canvas.setWidth(width);
			canvas.setBackgroundImage(url, canvas.renderAll.bind(canvas), {
				scaleX: canvas.width / this.naturalWidth,
				scaleY: canvas.height / this.naturalHeight,
				crossOrigin: 'anonymous'
			});
			
		});
		//console.log(currentMeme);
		img.src = url;
	}
	;},0);

		setTimeout(function(){ 
		ref.once("value").then(
			function(snapshot) {
				if(url!="false")
				{
					document.getElementById('submit').addEventListener('click', function(e){
						if(document.getElementById('title').value!=""){
						var memeRef = ref.push();
						var imgurl = canvas.toDataURL() ; // This method saves graphics in png		    
					    memeRef.set({
							title: document.getElementById('title').value,
							tags: document.getElementById('tags').value,
							img: imgurl,
							canvas: stringifyCanvas(),
							key: memeRef.key,
							dimension:[height,width]
						});
					setTimeout(function(){window.location.href = "viewmemes.html"},500);}
					else{alert("Please Enter a Title")}
					});
				}
				else
				{
					document.getElementById('submit').addEventListener('click', function(e){
						var memeRef = chRef;
						var imgurl = canvas.toDataURL() ; // This method saves graphics in png		    
					    memeRef.update({
							title: document.getElementById('title').value,
							tags: document.getElementById('tags').value,
							img: imgurl,
							canvas: stringifyCanvas()
						});
					setTimeout(function(){window.location.href = "viewmemes.html"},500);
					});
				}
					
			});
		},500);

async function updatePicture() {
    var databaseStorage = firebase.storage().ref().child(userId);
    databaseStorage.getDownloadURL().then(function(url){
        return url;
       // document.getElementById('icon').src = url;
    }).catch(function(error){
        document.getElementById('Pic').src = 'img/sample.png'

    });
}
}});
