module.exports = compareVars;

function compareObjects(a, b)
{
    var _keys = Object.keys(a).concat(Object.keys(b));

    var keys = [];
    var diff = {};

    for(var i = 0; i < _keys.length; i++)
    {
        if(keys.indexOf(_keys[i]) == -1)
            keys.push(_keys[i]);
    }

    for(var i = 0; i < keys.length; i++)
    {
        var key = keys[i];
        var _diff = compareVars(a[key], b[key]);
        if(_diff)
            diff[key] = _diff;
    }

    return diff;
}

function compareVars(a, b)
{
    if(a instanceof Array && b instanceof Array)
    {
        var diff = [];
        var hasData = false;

        if(a.length != b.length)
            return {before: a, after: b};

        for(var i = 0; i < a.length; i++)
        {
            diff[i] = compareVars(a[i], b[i]);
            if(diff[i])
                hasData = true;
        }

        if(hasData)
            return diff;
    }
    else if(typeof a == "object" && typeof b == "object" && a && b)
    {
        var diff = compareObjects(a, b);
        if(Object.keys(diff).length > 0)
            return diff;
    }
    else if(a != b)
    {
        return {before: a, after: b};
    }
}
