const { sleep } = require("openai/core");
const { TaskQueue } = require("./src/TaskQueue");

const queue = new TaskQueue();

for (let i = 0; i < 100; i++) {
    queue.add(async () => {
        console.log(i, 'running')
        await sleep(1000)
        console.log(i, 'done')
    })
}