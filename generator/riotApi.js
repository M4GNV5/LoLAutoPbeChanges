var request = require("request");

function Riot(devKey)
{
    var self = this;

    self.key = devKey;

    self.makeRequest = function(url, callback)
    {
        var _url = "https://global.api.pvp.net/api/lol/static-data/" + url + "&api_key=" + this.key;

        request(_url, function(err, res, body)
        {
            if(res.statusCode == 429)
            {
                var time = parseInt(res.headers["retry-after"]);
                console.log("rito rate limit for " + time + " seconds");
                setTimeout(self.makeRequest.bind(url, callback), time * 1000 + 1);
            }
            else if(err || res.statusCode != 200)
            {
                var err = err || "Riot server returned status code " + res.statusCode + " when requesting " + url;
                callback(err);
            }
            else
            {
                var data;
                try
                {
                    var data = JSON.parse(body);
                }
                catch (e)
                {
                    callback(e);
                }

                callback(undefined, data);
            }
        });
    };
}

Riot.prototype.champions = function(server, callback)
{
    var url = server + "/v1.2/champion?champData=all";
    this.makeRequest(url, callback);
};

Riot.prototype.items = function(server, callback)
{
    var url = server + "/v1.2/item?itemListData=all";
    this.makeRequest(url, callback);
};

Riot.prototype.runes = function(server, callback)
{
    var url = server + "/v1.2/rune?runeListData=all";
    this.makeRequest(url, callback);
};

Riot.prototype.masteries = function(server, callback)
{
    var url = server + "/v1.2/mastery?masteryListData=all";
    this.makeRequest(url, callback);
};

Riot.prototype.spells = function(server, callback)
{
    var url = server + "/v1.2/summoner-spell?spellData=all";
    this.makeRequest(url, callback);
};

module.exports = Riot;
