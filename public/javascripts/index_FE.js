
window.onload = function () {
	console.log("No need jq!");
	
	writeMessage = initializeWriteMessage();
	setupAjax();
}

/** Front end js to handle AJAX **/
var setupAjax = function(){
	var xhr = new XMLHttpRequest();
	
	xhr.onload = function() {
    if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
				if (data.err) console.log(data.err);
				if (writeMessage(data)) {
					appendQueryResult(data);
				}
				
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

var appendQueryResult = function(data) {
	var rows = data.rows;
	var cols = data.cols;

	var resultSection = document.getElementById('results');
	resultSection.removeChild(resultSection.lastChild)

	var tableBody = document.createElement('tbody');

	/** Create table header **/
	var tableHeadRow = document.createElement('tr');
	for(var i = 0; i < cols.length; i++) {
		var currColName = cols[i];
		var column = document.createElement('th');
		column.innerHTML = currColName;
		tableHeadRow.appendChild(column);
	}

	tableBody.appendChild(tableHeadRow);
	
	/** Create rest or rows **/
	for(var i = 0; i < rows.length; i++) {
		var dataRow = document.createElement('tr');
		for(var j = 0; j < cols.length; j++) {
			var currColName = cols[j];
			var colValue = document.createElement('td');
			colValue.innerHTML = rows[i][currColName];
			dataRow.appendChild(colValue);
		}
		tableBody.appendChild(dataRow);
	}

	var newTable = document.createElement('table');
	newTable.className = "table table-bordered table-striped";
	newTable.appendChild(tableBody);

	resultSection.appendChild(newTable);
}

/** Note, as the software base grows, I may need to make a constructor.
		I'm pretty sure I will be switching out text quite often with other text.
		This is also temporary, until I package this function below into a module.
**/
var initializeWriteMessage = function(){
	var results = document.getElementById('results');
	var successP = results.getElementsByTagName('p')[0];
	var spans = successP.getElementsByTagName('span');

	var errorP = document.createElement('p');
	errorP.style="color:red"; // keep until my CSS skills improve
	var currP = successP;

	var writeErrorMsg = function(err) {
		errorP.innerHTML = err;
	}

	var writeTableSummary = function(rowCount, colCount) {
		currP.style=""; // make p visible
		spans[0].innerHTML = rowCount;
		spans[1].innerHTML = colCount;
	}

	return function (data) {
		if (data.err) { 
			results.replaceChild(errorP, currP);
			currP = errorP;

			writeErrorMsg(data.err);
			return false;
		}
	
		if (currP === errorP) {
			results.replaceChild(successP, currP);
			currP = successP;
		}

		writeTableSummary(data.rowCount, data.colCount);
		return true;
	}
};






