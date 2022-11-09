const DiscordImgUrl = ({ ID, AV }: { ID: string; AV: string }) =>
  `https://cdn.discordapp.com/avatars/${ID}/${AV}.png`;

export default DiscordImgUrl;
