const amqp = require('amqplib')
const data = require("./data.json");

const queueName = process.argv[2] || "jobsQueue"
console.log("qu", queueName);
connectRabbitMq();

async function connectRabbitMq() {
    try {
        const connection = await amqp.connect("amqp://127.0.0.1:5672");
        const channel = await connection.createChannel();
        const assertion = await channel.assertQueue(queueName);
        console.log("Mesaj Bekleniyor...");
        channel.consume(queueName, (message) => {
            const messageInfo = JSON.parse(message.content.toString())
            const userInfo = data.find(u => u.id == messageInfo.description)
            if (userInfo) {
                console.log("İşlenen kayıt", userInfo)
                channel.ack(message)
            }

        })


    } catch (e) {
        console.log("Hata", e.message);
    }
}