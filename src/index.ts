export interface initializer {
  initializer: () => any;
  async: boolean;
}

export interface task {
  task: () => any;
  async: boolean;
}

export interface reporter {
  report: (results: any) => any;
}

export default class Taskmaster {
  private initializer: initializer
  private task: task
  private reporter: reporter

  setInitializer(initializer: initializer) {
    this.initializer = initializer
  }

  setTask(task: task) {
    this.task = task
  }

  setReporter(reporter: reporter) {
    this.reporter = reporter
  }

  async abuse(times: number) {
    if (this.initializer.async) {
      await this.initializer.initializer()
    }

    const promises = []

    for (let i = 0; i < times; i++) {
      promises.push(this._executeAndBenchmark(this.task))
    }

    const results = await Promise.all(promises)
    this.reporter.report(results)
  }

/*------------------------------*/ 
  private async _executeAndBenchmark (task: task) {
    const start = process.hrtime()
    let success = false
    let error = null

    try {
      await this._execute(task)
      success = true
    } catch(err) {
      error = err
    }

    const elapsedTime = (process.hrtime(start)[1] * 1e-6)
    
    return { elapsedTime, success, error }
  }

  private async _execute(task: task) {
    if (task.async) return Promise.resolve(task.task())
    return task.task()
  }
}
