const amqp = require("amqplib");
const data = require("./data.json");
const redis = require("redis");
const client = redis.createClient({ legacyMode: true });

const queueName = process.argv[2] || "jobsQueue";
console.log("qu", queueName);
connectRabbitMq();

(async () => {
  await client.connect();
})();

async function connectRabbitMq() {
  try {
    const connection = await amqp.connect("amqp://127.0.0.1:5672");
    const channel = await connection.createChannel();
    const assertion = await channel.assertQueue(queueName);
    console.log("Mesaj Bekleniyor...");
    channel.consume(queueName, (message) => {
      const messageInfo = JSON.parse(message.content.toString());
      const userInfo = data.find((u) => u.id == messageInfo.description);
      if (userInfo) {
        console.log("İşlenen kayıt", userInfo);
        client.set(
          `user_${userInfo.id}`,
          JSON.stringify(userInfo),
          (err, status) => {
            if (!err) {
              console.log("Status:", status);
              channel.ack(message);
            }
          }
        );
      }
    });
  } catch (e) {
    console.log("Hata", e.message);
  }
}
