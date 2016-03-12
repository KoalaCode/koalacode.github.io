$.getScript("https://cdn.firebase.com/js/client/2.2.1/firebase.js", function(){
function send(text) {
	API.sendChat(text);
}
API.on(API.USER_JOIN, function(data){
	send('User ' + data.username + ' joined.');
});
API.on(API.USER_LEAVE, function(data){
	send('User ' + data.username + ' left.');
});
var joinRef = new Firebase('http://cookieplug.firebaseio.com/join/');
var banRef = new Firebase('http://cookieplug.firebaseio.com/ban/');

var time = 600;
API.on(API.ADVANCE, function(data){
	setTimeout(function() {
		if (API.getTimeRemaining() > 600){
			API.moderateForceSkip();
			send('@' + data.dj.username + ' your song is longer than ' + time + ' seconds.');
		}
	}, 5000);
});


API.on(API.CHAT, function(data){
	var msg = data.message;
	var name = data.un;
	var woot = $('#woot');
	var ping = '@' + name + ' ';
	var args = undefined;
	
	var commands = {
		woot: function() {
			if (woot.hasClass('selected')) {
				send(ping + 'wooted already.');
			}
			else if (API.getDJ() == undefined) {
				send(ping + 'no songs to woot.');
			}
			else if (API.getDJ().username == API.getUser().username) {
				send(ping + 'i cant woot my own song.');
			}
			else {
				woot.click();
				send(ping + 'successfully wooted!');
			}
		},
		kill: function(args) {
			args = args || '';
			var meters = Math.floor(Math.random() * 1000) + 0;
			var kills = [
				'Oh noes! Someone killed ' + args + '! (Not me)',
				'Ohh, ' + args + ' jumped off the bridge during drought...',
				args + ' tried to swim in lava! He actually did it, he was killed by the sniper after that.',
				args + ' is killed by the sniper! (' + meters + ' meters)',
				'Poor ' + args + ", he's killed by his own cat.",
				args + ' suicided. (Thanks to me)',
				args + ' +  :bomb: = ' + args.slice(0,args.length - 2) + ':boom:'
			];
			if (args == 0) {
				send(ping + 'Usage: +kill <name>');
			}
			else {
				var killz = kills[Math.floor(Math.random() * kills.length)];
				send(ping + killz);
			}
		},
		givecookie: function(args){
			args = args || '';
			var cookies = [
				'gave chocolate cookie to ' + args + '!',
				'gave virtual cookie to ' + args + '!',
				'gave cookie to ' + args + '!',
				'gave old cookie to ' + args + '!',
				'gave plastic cookie to ' + args + '!'
			];
			if (args == 0) {
				send(ping + 'Usage: +givecookie <name>');
			}
			else {
				var cookiez = cookies[Math.floor(Math.random() * cookies.length)];
				send(ping + cookiez);
			}
		},
		skip: function(args){
			if (API.getDJ() == undefined) {
				send(ping + 'there is no dj.');
			}
			else if (args == undefined) {
				send('@' + name + ' you have to explain why. (+skip <reason>)');
			}
			else {
				API.moderateForceSkip();
				send('Admin ' + name + ' skipped current song. Reason: ' + args);
			}
		},
		
	}
	// SEND SCRIPT
	var banned = [];
	banRef.on('child_added', function(data){
		var bans = data.val();
		banned.push(bans.name)
	});
	var commandParts = msg.split(/^\+(\w+) ?(.+)?$/).filter(function (e) {
    	return !!e;
    });
	var command = commandParts[0];
	if (!!commandParts[1]) args = $('<a>').html(commandParts[1]).text();
	var checkban = $.inArray(name, banned) > -1;
	if (checkban) {
		API.moderateDeleteChat(data.cid);
	}
	else {
		commands[command](args);
	}
})
})
