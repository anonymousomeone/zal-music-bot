const ytdl = require('ytdl-core');
const search = require('youtube-search');
const config = require('./../config.json');
module.exports = {
	name: 'play',
	description: 'Play a song in your channel!',
	async execute(message, args) {
		function isValidHttpUrl(string) {
			try {
				new URL(string);
			}
			catch (_) {
				return false;
			}
			return true;
		}
		try {
			let songInfo = '';
			if (isValidHttpUrl(args[0])) {
				songInfo = await ytdl.getInfo(args);
				console.log('true')
			}
			else {
				const opts = {
					maxResults: 10,
					key: config['yt-api'],
					type: 'video',
				};
				const yMessage = message.content.split(' ').slice(1).join(' ');
				const results = await search(yMessage, opts).catch(err => console.log(err));
				if(results) {
					const youtubeResults = results.results;
				let selected = youtubeResults[0];
				selected = `${selected.link}`;
				selected = selected.toString();
				songInfo = await ytdl.getInfo(selected);
				}
			}
			const queue = message.client.queue;
			const serverQueue = message.client.queue.get(message.guild.id);

			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel) {
				return message.channel.send(
					'You need to be in a voice channel to play music!',
				);
			}
			const permissions = voiceChannel.permissionsFor(message.client.user);
			if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
				return message.channel.send(
					'I need the permissions to join and speak in your voice channel!',
				);
			}


			const song = {
				title: songInfo.videoDetails.title,
				url: songInfo.videoDetails.video_url,
			};

			if (!serverQueue) {
				const queueContruct = {
					textChannel: message.channel,
					voiceChannel: voiceChannel,
					connection: null,
					songs: [],
					volume: 5,
					playing: true,
				};

				queue.set(message.guild.id, queueContruct);

				queueContruct.songs.push(song);

				try {
					const connection = await voiceChannel.join();
					queueContruct.connection = connection;
					this.play(message, queueContruct.songs[0]);
				}
				catch (err) {
					console.log(err);
					queue.delete(message.guild.id);
					return message.channel.send(err);
				}
			}
			else {
				serverQueue.songs.push(song);
				return message.channel.send(
					`**${song.title}** has been added to the queue!`,
				);
			}
		}
		catch (error) {
			console.log(error);
		}
	},

	play(message, song) {
		const queue = message.client.queue;
		const guild = message.guild;
		const serverQueue = queue.get(message.guild.id);

		if (!song) {
			serverQueue.voiceChannel.leave();
			queue.delete(guild.id);
			return;
		}

		const dispatcher = serverQueue.connection
			.play(ytdl(song.url))
			.on('finish', () => {
				serverQueue.songs.shift();
				this.play(message, serverQueue.songs[0]);
			})
			.on('error', error => console.error(error));
		dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
		serverQueue.textChannel.send(`Now playing: **${song.title}**`);
	},
};
