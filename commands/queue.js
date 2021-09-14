const Discord = require('discord.js');
module.exports = {
	name: 'queue',
	description: 'shows the queue',
	execute(message) {
        const serverQueue = message.client.queue.get(message.guild.id);
        console.log(serverQueue)
        let songs = []
        serverQueue.songs.forEach(element => {
            songs.push(element)
        });
        let string = ''
        for (var i = 0; i < songs.length; i++) {
            string += (' ' + i + `: ${songs[i].title}\n`);
        }

        message.channel.send('music queue:\n```' + string + '```')
	},
};