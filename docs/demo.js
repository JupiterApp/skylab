const { Experiment } = require('../lib/experiment');

class TestExperiment extends Experiment {
  constructor () {
    const name = 'TestExperiment';
    super(name);
  }

  groupDistributions () {
    return {
      control: 0.5,
      experiment: 0.5,
    };
  }
}

// Somewhere else:
const testExperiment = new TestExperiment();
const experimentGroup = testExperiment.assignGroup(user.id);
