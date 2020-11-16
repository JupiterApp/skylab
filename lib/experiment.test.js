const {
  Experiment,
} = require('./experiment');

function generateExperiment (name, distributions = {}) {
  class TestExperiment extends Experiment {
    constructor () {
      super(name);
    }

    groupDistributions () {
      return distributions;
    }
  }
  return new TestExperiment();
}

describe('Experiment setup', () => {
  test('experiments must have names', () => {
    expect(generateExperiment.bind(null, null)).toThrow('No experiment name passed to the constructor');
  });

  test('experiment distribution values must add up to 1.0 between them', () => {
    const testExperiment = generateExperiment.bind(null, 'Test experiment', {
      control: 0.8,
      groupA: 0.4,
    });
    expect(testExperiment).toThrow('Group distributions must add up to 1.0 for even distribution among the groups');
  });

  test('groupAssignmentFromValue correctly assigns a value of 0', () => {
    const testExperiment = generateExperiment('Test experiment', {
      control: 0.8,
      groupA: 0.2,
    });
    expect(testExperiment.groupAssignmentFromValue(0.0)).toEqual('control');
  });

  test('groupAssignmentFromValue correctly assigns a value of 1', () => {
    const testExperiment = generateExperiment('Test experiment', {
      control: 0.8,
      groupA: 0.2,
    });
    expect(testExperiment.groupAssignmentFromValue(1.0)).toEqual('groupA');
  });

  test('groupAssignmentFromValue correctly assigns values between 0 and 1', () => {
    const testExperiment = generateExperiment('Test experiment', {
      control: 0.4,
      groupA: 0.3,
      groupB: 0.3,
    });
    expect(testExperiment.groupAssignmentFromValue(0.2)).toEqual('control');
    expect(testExperiment.groupAssignmentFromValue(0.5)).toEqual('groupA');
    expect(testExperiment.groupAssignmentFromValue(0.8)).toEqual('groupB');
  });

  test('distributionPositionFromUserKey returns a value between 0.0 and 1.0', () => {
    const testExperiment = generateExperiment('Test experiment', {
      control: 0.8,
      groupA: 0.2,
    });
    // Run it on 10000 random values
    const testValues = [...Array(10000)].map((_) => {
      return testExperiment.distributionPositionFromUserKey(Math.random());
    });
    expect(Math.max(...testValues)).toBeLessThanOrEqual(1.0);
    expect(Math.min(...testValues)).toBeGreaterThanOrEqual(0.0);
  })

  test('expect a reasonable amount of accuracy', () => {
    const testExperiment = generateExperiment('Test experiment', {
      control: 0.95,
      groupA: 0.05,
    });
    // Run it on 100000 random values
    const testValues = [...Array(100000)].map((_) => {
      return testExperiment.assignGroup(Math.random());
    });
    const controlEntries = testValues.filter(val => val === 'control');
    const controlRatio = controlEntries.length / testValues.length;
    expect(controlRatio).toBeGreaterThan(0.94);
    expect(controlRatio).toBeLessThan(0.96);
  })
});
