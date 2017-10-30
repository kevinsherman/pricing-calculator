import { PriceCalculator } from "../index";
import * as XLSX from 'xlsx';

(function testHarness() {

    var params = require('./test-data/params.json');
    var batters = require('./test-data/batting.json');
    var pitchers = require('./test-data/pitching.json');

    var t = new PriceCalculator(params, batters, pitchers);
    var r = t.calculate();

    console.log(`Batting Iterations: ${r.battersOutput.numberOfIterations}`);
    console.log(`Pitching Iterations: ${r.pitchersOutput.numberOfIterations}`);

    console.log(process.cwd());
    var file = 'src/tests/test-data/validation/batting_validation.xlsx';
    var wb = XLSX.readFile(file);
    console.log(wb.Workbook.Sheets[0]);

    
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
