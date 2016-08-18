 /** Front end js to handle AJAX **/
window.onload = function () {
	console.log("No need jq!");
	var xhr = new XMLHttpRequest();
	
	xhr.onload = function() {
    if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
				console.log(data);
    }
	};

	var form = document.getElementById('queryForm');
	var submitQuery = function(ev){
		ev.preventDefault();
		
		xhr.open('POST', 'http://localhost:7000/', true);
		xhr.withCredentials = true;
		xhr.setRequestHeader('Content-Type', 'text/plain'); // send the plain text query
		var query = document.getElementById('message').value;
		console.log("query: ", query)
		xhr.send(query);
	}

	form.addEventListener("submit", submitQuery);	
}

