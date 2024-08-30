import { SlotMachine, SlotSymbol } from 'slot-machine'
import { BaseCommand, Command, Message } from '../../Structures'

@Command('slot2', {
    category: 'economy',
    description: 'Bets the given amount of gold in a slot machine',
    usage: 'slot2 <amount>',
    cooldown: 15,
    exp: 10,
    aliases: ['bet2']
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (M.numbers.length < 1) return void M.reply(`amount?`)
        const amount = M.numbers[0];
        const { wallet } = await this.client.DB.getUser(M.sender.jid)
        if (amount > wallet) return void M.reply(`check ur wallet`)
        const machine = new SlotMachine(3, this.symbols)
        const results = machine.play();
        const lines = results.lines.filter((line) => !line.diagonal);
        const points = results.lines.reduce((total, line) => total + line.points, 0)
        const resultAmount = points <= 0 ? -amount : amount * points;
        await this.client.DB.setGold(M.sender.jid, resultAmount)

        let text = '🎰 *SLOT MACHINE 2* 🎰\n\n';
        text += results.visualize();
        text += points <= 0 ? `📉 You lost ${amount} gold` : `📈 You won ${resultAmount} gold`;

        return void (await this.client.sendMessage(M.from, { text }, { quoted: M.message }))
    };

    private symbols = [
        new SlotSymbol('1', {
            display: '💸',
            points: 5,
            weight: 100
        }),
        new SlotSymbol('2', {
            display: '💶',
            points: 15,
            weight: 100
        }),
        new SlotSymbol('b', {
            display: '💰',
            points: 30,
            weight: 40
        })
    ];
                                        }
                                                                      
