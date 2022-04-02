const amqp = require('amqplib')
const data = require("./data.json");

const message = {
    description: ""
}

const queueName = process.argv[2] || "jobsQueue"
console.log("qu", queueName);


connectRabbitMq();

async function connectRabbitMq() {
    try {
        const connection = await amqp.connect("amqp://127.0.0.1:5672");
        const channel = await connection.createChannel();
        const assertion = await channel.assertQueue(queueName);

        data.forEach(i => {
            message.description = i.id;
            channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
            console.log("Gönderilen Mesaj", message);
        })

        // setInterval(() => {
        //     message.description = new Date().getTime();
        //     channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
        //     console.log("Gönderilen Mesaj", message);
        // }, 500);

    } catch (e) {
        console.log("Hata", e.message);
    }
}