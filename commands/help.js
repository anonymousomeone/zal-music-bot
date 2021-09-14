module.exports = {
	name: 'help',
	description: 'displays this help message',
	execute(message) {
		message.channel.send("Zalander's music bot v1.0.0\nCommands:\n```	play [url or title]\n	skip\n	stop\n	nowplaying\n	queue\n	volume [integer]\n	invite\n	help");
	},
};