module.exports = {
	name: 'volume',
	description: 'set the volume',
	execute(message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
        const dispatcher = serverQueue.connection.dispatcher;
        dispatcher.setVolumeLogarithmic(parseInt(args[0]) / 5);
	},
};