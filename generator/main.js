var fs = require("fs");
var Riot = require("./riotApi.js");
var compare = require("./compare.js");
var config = require("./config.json");

var riot = new Riot(config.devKey);

doIt("champions", end);
doIt("items", end);
doIt("runes", end);
doIt("masteries", end); //500 :(
doIt("spells", end);

var data = {};
var diff = {};
var count = 5;

function end(err)
{
    if(err)
        console.log(err);

    count--;
    if(count == 0)
    {
        fs.writeFile("./../data/diff.json", JSON.stringify(diff, undefined, 4), function(err)
        {
            if(err)
                throw err;
        });
        fs.writeFile("./../data/data.json", JSON.stringify(data, undefined, 4), function(err)
        {
            if(err)
                throw err;
        });
    }
}

function doIt(type, cb)
{
    riot[type](config.region, function(err, before)
    {
        if(err)
            return cb(err);

        riot[type]("pbe", function(err, after)
        {
            if(err)
                return cb(err);

            var _diff = compare(before, after);

            diff[type] = _diff;
            data[type] = after;

            cb();
        });
    });
}
