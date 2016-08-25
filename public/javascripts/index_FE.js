
window.onload = function () {
	console.log("No need jq!");
	
	writeMessage = initializeWriteMessage();
	setupAjax();

	var dataBody = document.getElementById("data-body-js");
	dataBody.addEventListener("scroll", scrollVisibleHeader());
}

/** Front end js to handle AJAX **/
var setupAjax = function(){
	var xhr = new XMLHttpRequest();
	
	xhr.onload = function() {
    if (xhr.status === 200) {
				var data = JSON.parse(xhr.responseText);
				handleResponse(data);
		}
	};

	var submitQuery = function(ev){
		var type = ev.target.value; // 'Test Run' || 'Run' || 'Save' || 'Delete'

		// Every type of submit except Delete needs the query
		if (type !== 'Delete') {
			var query = document.getElementById('message').value;
		}
	
		var queryName = document.getElementById('queryname').value;

		//TODO: Have to find a robust URL when hosting this project one day
		xhr.open('POST', 'http://localhost:7000/', true);
		xhr.withCredentials = true;
		xhr.setRequestHeader('Content-Type', 'application/json');
	
		console.log("query: ", query)
		xhr.send(JSON.stringify({ 
			type: type,
			query: query,
			queryName: queryName
		}));
	}

	var testRunBtn = document.getElementById('Test');
	var runBtn = document.getElementById('Run');
	var saveBtn = document.getElementById('Save');
	var deleteBtn = document.getElementById('Delete');

	testRunBtn.onclick = submitQuery;
	runBtn.onclick = submitQuery;
	saveBtn.onclick = submitQuery;
	deleteBtn.onclick = submitQuery;
}

var handleResponse = function(data) {
	if (data.err) console.log(data.err);
	
	/** TODO: find a better separation of concerns for writeMessage
			because I'll also display a message, not in the same paragraph
			(if I did, saving means that the user wouldn't see
			the number of rows and columns and may resubmit the query)

			Are messages generated on client or server side?
	**/

	if (data.type === 'Save') {
		console.log(data.msg);
	}

	else if (data.type === 'Delete') {
		console.log(data.msg);
	}

	else if (writeMessage(data)) {
		appendQueryResult(data);
	}
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

	/** Create rest of rows **/
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
		// width property doesn't work on FF and Chrome, but min-width does
		visibleHeader.setAttribute("style", "min-width:" + width + "px");
		visibleHeader.style["min-width"] = width + "px";
		visibleTR.appendChild(visibleHeader);
	}
	visibleThead.appendChild(visibleTR);
}

var scrollVisibleHeader = function () {
	//var dataBody = evt.target; var dataBody = document.getElementById("data-body-js");
	var tableHeader = document.getElementById("table-header");
	return function (evt) {
		tableHeader.style.left = -evt.target.scrollLeft + "px";
	}
}

/** Note, as the software base grows, I may need to make a constructor.
		I'm pretty sure I will be switching out text quite often with other text.
		This is also temporary, until I package this function below into a module.
**/
var initializeWriteMessage = function(){
	var results = document.getElementById('results');
	var successP = results.getElementsByTagName('p')[0]; // currently I have a div as the children of results, fix later
	var spans = successP.getElementsByTagName('span');

	var errorP = document.createElement('p');
	errorP.style="color:red"; // keep until my CSS skills improve
	var currP = successP;

	var writeErrorMsg = function(err) {
		errorP.innerHTML = err;
	}

	var writeTableSummary = function(rowCount, colCount) {
		currP.style.visibility ="visible"; // make p visible
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






