
window.onload = function () {
	console.log("No need jq!");
	
	setupAjax();
}

/** Front end js to handle AJAX **/
var setupAjax = function(){
	var xhr = new XMLHttpRequest();
	
	xhr.onload = function() {
    if (xhr.status === 200) {
				console.log("Raw response text: ", xhr.responseText);
        var data = JSON.parse(xhr.responseText);
				appendQueryResult(data.rows);
				writeCountMsg(data.rowCount, data.colCount);
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

var appendQueryResult = function(rows) {
	var resultSection = document.getElementById('results');
	resultSection.removeChild(resultSection.lastChild)

	// TODO: Add a table instead
	var newElement = document.createElement('div');
	newElement.innerHTML = JSON.parse(rows);
	resultSection.appendChild(newElement);
}

var writeCountMsg = function(rowCount, colCount) {
	// TODO: Figure out a way to get touch the span tags in the message paragraph
	console.log("rows: ", rowCount, " cols: ", colCount);
}
