import Taskmaster from './index'
import axios from 'axios'

const master = new Taskmaster()

master.setInitializer({async: false, initializer: ()=> {}})

const reporter = {
  report: result => console.log(result)
}
const task = {
  async: true,
  task: () => axios.get('http://0.0.0.0:8000')
}

master.setTask(task)

master.setReporter(reporter)

master.abuse(30)
