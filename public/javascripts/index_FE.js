
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
	
	/** TODO: I want 3 form listeners: "run,", "delete", "save" 
			and I want it to save text in the database, or delete it.
			Renaming the event that is fired doesn't work.
	**/
	form.addEventListener("submit", submitQuery);

}

/** Complexity comes from the table headers being detached
		from the actual table
**/
var makeFixedTableHeaders = function(colNames) {
	var tableHead = document.createElement('thead');
	var tableHeadRow = document.createElement('tr');
	for(var i = 0; i < colNames.length; i++) {
		var currColName = colNames[i];
		var absolutelyPositionedDiv = document.createElement('div'); // could be a function in itself
		absolutelyPositionedDiv.className = "th-inner";
		absolutelyPositionedDiv.innerHTML = currColName;

		var column = document.createElement('th');
		column.appendChild(absolutelyPositionedDiv);
		tableHeadRow.appendChild(column);
	}
	tableHead.appendChild(tableHeadRow);
	return tableHead;
}

var appendQueryResult = function(data) {
	var rows = data.rows;
	var cols = data.cols;

	var resultSection = document.getElementById('data-body-js'); // add table to this
	resultSection.removeChild(resultSection.lastChild);

	/** Create table header **/
	var tableHead = makeFixedTableHeaders(cols);
	tableHead.id = 'hidden-header';

	/** Create rest or rows **/
	var tableBody = document.createElement('tbody');
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
	newTable.className = "table table-bordered table-striped table-shadow";
	newTable.appendChild(tableHead);	
	newTable.appendChild(tableBody);
	
	resultSection.appendChild(newTable);

	var visibleHeader = document.getElementById('visible-header');
	var hiddenHeader = document.getElementById('hidden-header');
	setVisibleTableHeaderWidths(hiddenHeader, visibleHeader);
}

var setVisibleTableHeaderWidths = function(hiddenTH, visibleThead) {
	var hiddenTR = hiddenTH.childNodes[0];
	var hiddenTHs = hiddenTR.childNodes;

	visibleThead.removeChild(visibleThead.lastChild); // delete the table row
	var visibleTR = document.createElement('tr');
	for (var i = 0; i < hiddenTHs.length; i++) {
		var current_th = hiddenTHs[i];
		var width = current_th.offsetWidth;
		
		var innerDiv = current_th.getElementsByTagName('div')[0];

		var visibleHeader = document.createElement('th');
		visibleHeader.innerHTML = innerDiv.innerHTML;
		visibleHeader.setAttribute("style", "width:" + width + "px");
		visibleHeader.style.width = width + "px";
		visibleHeader.setAttribute("style", "min-width:" + width + "px");
		visibleHeader.style["min-width"] = width + "px";
		visibleTR.appendChild(visibleHeader);
	}
	visibleThead.appendChild(visibleTR);
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
			hideTable();
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

var hideTable = function() {
	var results = document.getElementById('results');
	var table = results.getElementsByTagName('table')[0];
	table.style="display:none;"
}






