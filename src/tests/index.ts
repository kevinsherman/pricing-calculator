import { PriceCalculator } from "../index";
import { toCsv } from "../common/helpers";

(function testHarness() {

    var params = require('./test-data/params.json');
    var batters = require('./test-data/batting_20180408.json');
    var pitchers = require('./test-data/pitching_20180408.json');

    var t = new PriceCalculator(params, batters, pitchers);
    var r = t.calculate();

    console.log(`Batting Iterations: ${r.battersOutput.numberOfIterations}`);
    console.log(`Pitching Iterations: ${r.pitchersOutput.numberOfIterations}`);

    toCsv(r.hitters, "hitters");

})();