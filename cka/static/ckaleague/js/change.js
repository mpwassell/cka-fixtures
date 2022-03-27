
$( document ).ready(function() {
	init_tables();
});


function init_tables() {


	url = '/cka/pending_changes'
	$("#pending_change_table").jqGrid({ 
		    url: url, 
			datatype: "json", colNames:['Fixture', 'Date', 'Requester','Type', 'Description','Old Date', 'New Date'], 
			colModel:[ 
					   {name:'fixture_code'  ,index:'fixture_code', width:100},
				       {name:'submit_date'  ,index:'submit_date', width:100}, 
				       {name:'requester',index:'requester', width:100 },
				       {name:'change_type', index:'change_type', width:100},
				       {name:'change_description', index:'change_description', width:150},
					   {name:'old_date'  ,index:'old_date', width:100},	
					   {name:'new_date'  ,index:'new_date', width:100}
				       ], 
				       rowNum:10, rowList:[10,20,20,20,20,20], 
				       pager: '#pending_change_pager', 
				       sortname: 'submit_date', 
				       viewrecords: true, 
				       sortorder: "desc", 
				       caption:"Pending Changes"
				   });
	/*
	$("#player_table").jqGrid('navGrid','#pager2',{edit:false,add:false,del:false});
	$("#player_table").jqGrid().setGridParam({url : url}).trigger("reloadGrid")
	*/

	/*
	$.getJSON( '/cka/player_search/' + like,function( data ) {
		var tbody = $('#player_table');
		tbody.html('');

		$.each(data, function(i, v) { 
			tbody.append( "<tr><td>" + v.id + "</td><td>" + v.club + "</td><td>" + v.name + "</td></tr>");
		});
	});
	*/

}