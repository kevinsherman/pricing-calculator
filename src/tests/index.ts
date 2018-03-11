import { PriceCalculator } from "../index";
import * as jsonexport from "jsonexport/dist";
import * as fs from 'fs';

(function testHarness() {

    var params = require('./test-data/params.json');
    var batters = require('./test-data/batting_20180310.json');
    var pitchers = require('./test-data/pitching_20180310.json');

    var t = new PriceCalculator(params, batters, pitchers);
    var r = t.calculate();

    console.log(`Batting Iterations: ${r.battersOutput.numberOfIterations}`);
    console.log(`Pitching Iterations: ${r.pitchersOutput.numberOfIterations}`);

    toCsv(r.hitters, "hitters");


})();



export function toCsv(input: any[], fileName: string) {
    var outFile = 'data/output/' + fileName;

    jsonexport(input, function(err: any, csv: any) {
        if (err) return console.log(err);
        // console.log(csv);
        fs.writeFile(outFile, csv, function(err) {
            if (err) console.log(err);
        })
    })
    
    // fs.writeFile(outFile, csv, function (err) {
    //     if (err) {
    //         console.log(err);
    //     }
    // })
}
    // fs.writeFile(outFile, csv, function (err) {
    //     if (err) {
    //         console.log(err);
    //     }
    // })