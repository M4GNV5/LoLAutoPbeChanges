var fs = require("fs");
var Riot = require("./riotApi.js");
var compare = require("./compare.js");
var prepareData = require("./prepareData.js");
var config = require("./config.json");

var riot = new Riot(config.devKey);

doIt("champions", end);
doIt("items", end);
doIt("runes", end);
doIt("masteries", end); //500 :(
doIt("spells", end);

var before = {};
var after = {};
var diff = {};
var count = 5;

function end(err)
{
    if(err)
        console.log(err);

    count--;
    if(count == 0)
    {
        var data = prepareData(before, after, diff);
        fs.writeFileSync("./../data.json", JSON.stringify(data, undefined, 4));
    }
}

function doIt(type, cb)
{
    riot[type](config.region, function(err, _before)
    {
        if(err)
            return cb(err);

        riot[type]("pbe", function(err, _after)
        {
            if(err)
                return cb(err);

            var _diff = compare(_before, _after);

            diff[type] = _diff;
            after[type] = _after;
            before[type] = _before;

            cb();
        });
    });
}
