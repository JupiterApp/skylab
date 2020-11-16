# Skylab 🛰🧪

Skylab is a simple library for running A/B tests and other experiments.

To use it, simply import the `Experiment` class, call the constructor's
`super()` method with a name, and create a `groupDistributions` method
which returns an object with the name of the bucket for user assignment
as the key, and the probability of the user being assigned to that
bucket as the value (0 to 1).

This ensures we can look up a user's group assignment without relying on
DB calls, by calling the idempotent `assignGroup` method.

### Demo
For a simple demonstration version, check the [docs
folder](https://github.com/JupiterApp/skylab/tree/master/docs).
