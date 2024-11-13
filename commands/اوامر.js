const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'مساعدة',
  description: 'عرض الاوامر المتاحة',
  usage: 'مساعدة/nمساعدة[اسم الامر]',
  author: 'النظام',
  execute(senderId, args, pageAccessToken) {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    if (args.length > 0) {
      const commandName = args[0].toLowerCase();
      const commandFile = commandFiles.find(file => {
        const command = require(path.join(commandsDir, file));
        return command.name.toLowerCase() === commandName;
      });

      if (commandFile) {
        const command = require(path.join(commandsDir, commandFile));
        const commandDetails = `
––––––––––––––––––––
إسـم الأمـر🆎: ${command.name}
الوصـف🌐: ${command.description}
الإستـخدام🚻: ${command.usage}
––––––––––––––––––––`;
        
        sendMessage(senderId, { text: commandDetails }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: `Command "${commandName}" not found.` }, pageAccessToken);
      }
      return;
    }

    const commands = commandFiles.map(file => {
      const command = require(path.join(commandsDir, file));
      return `│ - ${command.name}`;
    });

    const helpMessage = `
––––––––––––––––––––
قـائمـة أوامـر الملك ستـورم:
╭─╼━━━━━━━━╾─╮
${commands.join('\n')}
╰─━━━━━━━━━╾─╯
• الدردشـة • مساعدة [اسم الامر] لرؤية طريقة عمله.
––––––––––––––––––––`;

    sendMessage(senderId, { text: helpMessage }, pageAccessToken);
  }
};
