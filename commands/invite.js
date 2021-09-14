module.exports = {
	name: 'invite',
	description: 'invite this bot to your server',
	execute(message) {
		message.channel.send('Invite: `https://discord.com/oauth2/authorize?client_id=887130170824212540&scope=bot&permissions=3148800`');
	},
};