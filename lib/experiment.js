const crypto = require('crypto');

class Experiment {
  constructor (name) {
    if (!name) throw new Error('No experiment name passed to the constructor');
    this.name = name;
    this.checkGroupDistributionTotals();
  }

  checkGroupDistributionTotals () {
    const distributions = this.groupDistributions();
    const values = Object.values(distributions);
    const valueTotal = values.reduce((memo, value) => memo + value, 0);
    if (valueTotal !== 1.0) throw new Error('Group distributions must add up to 1.0 for even distribution among the groups');
  }

  groupDistributions () {
    // Subclasses should return an object with the group names as keys
    // and the distribution ratio (0 - 1) as the values.
    throw new Error(`${this.name}#groupDistributions is not implemented`);
  }

  assignGroup (userKey) {
    const assignmentValue = this.distributionPositionFromUserKey(userKey);
    return this.groupAssignmentFromValue(assignmentValue);
  }

  distributionPositionFromUserKey (userKey) {
    if (!userKey) throw new Error('User keys must be unique to assign them to an experiment group');
    const entropy = 8;
    const userKeyHash = crypto.createHmac('sha256', this.name).update(String(userKey)).digest('hex').substring(0, entropy);
    const numericUserKey = parseInt(userKeyHash, 16);
    const maxNumericUserKey = parseInt(`0x${'F'.repeat(entropy)}`, 16);
    const assignmentValue = numericUserKey / maxNumericUserKey;
    return assignmentValue;
  }

  groupAssignmentFromValue (value) {
    const groups = this.groupDistributions();
    const groupNames = Object.keys(groups);
    let expendedDistributionAmount = 0.0;
    const assignedGroupName = groupNames.find((groupName) => {
      if (value >= expendedDistributionAmount && value <= expendedDistributionAmount + groups[groupName]) return true;
      expendedDistributionAmount += groups[groupName];
      return false;
    });
    return assignedGroupName;
  }
}

module.exports = { Experiment };
