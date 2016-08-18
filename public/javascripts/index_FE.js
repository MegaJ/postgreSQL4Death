
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
				console.log("Parsed text: ", data);
				appendQueryResult(data);
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

var appendQueryResult = function(data) {
	var rows = data.rows;
	var cols = data.cols;
	var resultSection = document.getElementById('results');
	// TODO: Write Sentence about row nums and column numbers
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

var writeCountMsg = function(rowCount, colCount) {
	// TODO: Figure out a way to get touch the span tags in the message paragraph
	console.log("rows: ", rowCount, " cols: ", colCount);
}
