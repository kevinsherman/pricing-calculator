# Pricing Calculator

Fantasy Baseball Pricing Calculator using Z-Scores 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. This project uses Node.js and Typescript.

### Prerequisites

I plan on publishing a more detailed blog post on how the background and usage of this library (as well as it's roadmap), but here is quick Getting Started.

This assumes that you already have Node and TypeScript installed.

### Installing

1. Create a new directory for a sample consumer application:

```
mkdir sample && cd sample
```

2. Create a node application

```
npm init -y
```

3. Install the pricing-calculator

```
npm install --save @sablelab/pricing-calculator
```

4. Create an index.js file

```
touch index.js
```

5. Create a directory to hold your sample data

```
makedir sample-data
```

6. Populuate the sample-data directory with the following input files. There are sample files in the gihub repository that you can use:
* [batting projection file](https://github.com/sablelab/pricing-calculator/blob/master/src/tests/test-data/batting.json)
* [pitching projection file](https://github.com/sablelab/pricing-calculator/blob/master/src/tests/test-data/pitching.json)
* [input parameters file](https://github.com/sablelab/pricing-calculator/blob/master/src/tests/test-data/params.json)

7. Use the sample files to calculate pricing:

```
var pricing = require('@sablelab/pricing-calculator');

// use our sample data to generate the necessary inputs:
var params = require('./sample-data/params.json');
var batting = require('./sample-data/batting.json');
var pitching = require('./sample-data/pitching.json');

// create a new calculator with the inputs:
var calc = new pricing.PriceCalculator(params, batting, pitching);

// calculate the reponse:
var response = calc.calculate();

// inspect the response object to see all of the pricing information:
console.log(`Batting Iterations: ${r.battersOutput.numberOfIterations}`);
console.log(`Pitching Iterations: ${r.pitchersOutput.numberOfIterations}`);
```

8. Run the application to generate the response:
```
node index.js

// output:
Batting Iterations: 4
Pitching Iterations: 3
```

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Node](https://nodejs.org/en/) - Developement Environment
* [TypeScript](http://www.typescriptlang.org/) - JavaScript that scales

## Contributing

Please read [CONTRIBUTING.md](https://needlink.com) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Kevin R. Sherman** - *Initial work* - [Sablelab](https://github.com/sablelab/)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

#### This engine was built by piecing together prior-work from (among others):

* [Fantasy Baseball Calculator](http://fantasybaseballcalculator.webs.com/auction-price-determination)
* lastplayerpicked.com (site is no longer live)
