
$( document ).ready(function() {
	$("#search_button" ).button().click(function( event ) {
		player_search();
	});
	$("#add_button" ).button().click(function( event ) {
		player_add();
	});
});

function player_add() {
	
}

function player_search() {

	like = $('#player_like').val()

	url = '/cka/player_search/' + like
	$("#player_table").jqGrid({ 
		    url: url, 
			datatype: "json", colNames:['ID', 'Club','Name'], 
			colModel:[ {name:'id'  ,index:'id', width:100}, 
				       {name:'club',index:'club', width:200}, 
				       {name:'name',index:'name', width:300}],
				       rowNum:10, rowList:[10,20,30], 
				       pager: '#pager2', 
				       sortname: 'id', 
				       viewrecords: true, 
				       sortorder: "desc", 
				       caption:"Players"
				   });
	
	$("#player_table").jqGrid('navGrid','#pager2',{edit:false,add:false,del:false});
	$("#player_table").jqGrid().setGridParam({url : url}).trigger("reloadGrid")

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