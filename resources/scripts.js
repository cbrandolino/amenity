function refreshData() {
	$.get(
		"https://getamen.com/notifications.json", 
		function(data) {
			latestNews = data.splice(0,5);
			localStorage.posts = JSON.stringify(latestNews);
			if (html) {
				makeHTML(latestNews);
			}
		},
		"json"
	);
}

function makeHTML(data) {
	var picLink = "";

	for (i = 0; i < 5; i++) {
		var newElement = $("<a class='item'></a>");
		var item = data[i];
		var amenLink = "";
		var text = "";
		
		
			
		switch (item.kind) {
			case "new agree":
				picLink = (item.actor.photo) ? item.actor.photo : item.actor.picture+"?type=small" ;
				amenLink = 'https://getamen.com/statements/'+item.amen.statement.slug;
				text = item.actor.name
					+" agrees <span class='object type"+item.amen.statement.objekt.kind_id+"'>"
					+item.amen.statement.objekt.name
					+"</span> is the ";
				text += (item.amen.statement.topic.best)? "Best " : "Worst ";
				text += item.amen.statement.topic.description;
				text += " "+item.amen.statement.topic.scope;
				break;

			case "new dispute":
				picLink = (item.actor.photo) ? item.actor.photo : item.actor.picture+"?type=small" ;
				amenLink = 'https://getamen.com/statements/'+item.amen.statement.slug;
				text = item.actor.name
					+" disputes <span class='object type"+item.amen.statement.objekt.kind_id+"'>"
					+item.amen.referring_amen.statement.objekt.name
					+"</span> and says ";
				text += item.amen.statement.objekt.name
					+" is the ";
				text += (item.amen.statement.topic.best)? "Best" : "Worst";
				text += " "+item.amen.statement.topic.description;
				text += " "+item.amen.statement.topic.scope;
				break;
				
			case "new follower":
				picLink = (item.actor.photo) ? item.actor.photo : item.actor.picture+"?type=small" ;
				amenLink = 'https://getamen.com/'+item.actor.username;
				text = item.actor.name
					+" started following you";
				break;
				
			case "new hot topic":
				picLink = "resources/awesome.png" ;
				amenLink = "https://getamen.com/topics/"+item.topic.slug;
				text = "Rejoice! Your topic on the ";
				text += (item.topic.best)? "Best " : "Worst ";
				text += item.topic.description
					+ " is so hot right now!";
				break;
		}
		
		
		newElement.attr(
			'onclick', 
			"chrome.tabs.create({'url':'"+amenLink+"'})"
		);		
		
		newElement.append(
			'<span class="user" style="background-image:url('
			+picLink
			+');"> </span>');
		newElement.append('<div class="textbox">'+text+'</div>');
		
		$('.items').append(newElement);

	}
}

function getCount() {

	var request = $.get(
		"https://getamen.com/notifications/count.json", 
		"json"
	);	
	request.success(function(data) {
		localStorage.offline = 0;
		if (data.count > 0) {
			chrome.browserAction.setIcon({'path': 'resources/icon_news.png'});		
			refreshData();

		} else {
			chrome.browserAction.setIcon({'path': 'resources/icon.png'});
		}
	});
	request.error(function(data) {
		localStorage.offline = 1;
		chrome.browserAction.setIcon({'path': 'resources/icon_disconnect.png'});
	});
}

function offline() {
	var newElement = $("<a class='item'></a>");
	newElement.attr(
		'onclick', 
		"chrome.tabs.create({'url':'https://getamen.com/sign-in'})"
	);
	newElement.append(
		'<span class="user" style="background-image:url(resources/sad.png);"> </span>'
	);
	newElement.append('<div class="textbox">It looks like you\'re offline :(<br/>Click here to log in, we miss you!</div>');	
	$('.items').append(newElement);
}
