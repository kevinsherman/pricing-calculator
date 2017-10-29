import { PriceCalculator } from "../index";

(function testHarness() {

    var params = require('./test-data/params.json');
    var batters = require('./test-data/batting.json');
    var pitchers = require('./test-data/pitching.json');

    var t = new PriceCalculator(params, batters, pitchers);
    var r = t.calculate();

    console.log(`Batting Iterations: ${r.battersOutput.numberOfIterations}`);
    console.log(`Pitching Iterations: ${r.pitchersOutput.numberOfIterations}`);

})();

// import * as json2csv from 'json2csv';
// import * as fs from 'fs';

// export function toCsv(input: any[], fileName: string) {
//     var outFile = 'data/output/' + fileName;

//     var csv = json2csv({ data: input });
//     fs.writeFile(outFile, csv, function (err) {
//         if (err) {
//             console.log(err);
//         }
//     })
// }
