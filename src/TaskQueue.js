class TaskQueue {
  constructor(concurrency) {
    this.concurrency = concurrency || 10;
    this.runningNum = 0;
    this.queue = [];
  }
  async add(task) {
    this.queue.push(task);
    this.run();
  }
  async run() {
    while (this.runningNum < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      this.runningNum++;
      try {
        await task();
      } catch (error) {
        console.log("task run error", error);
      }
      this.runningNum--;
    }
  }
}

module.exports = {
  TaskQueue,
};
