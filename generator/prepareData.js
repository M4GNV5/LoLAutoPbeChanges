module.exports = function(beforeData, afterData, diff)
{
    var data = {};
    data.champions = {};
    data.newSkins = [];
    data.removedSkins = [];
    data.items = {};
    data.images = {};

    for(var champ in diff.champions.data)
    {
        var champDiff = diff.champions.data[champ];
        var changes = [];

        function parseSpell(label, spellDiff)
        {
            if(spellDiff.cooldownBurn)
                changes.push({title: label + " - " + "Cooldown", before: spellDiff.cooldownBurn.before, after: spellDiff.cooldownBurn.after});

            if(spellDiff.costBurn)
                changes.push({title: label + " - " + "Cost", before: spellDiff.costBurn.before, after: spellDiff.costBurn.after});

            if(spellDiff.effectBurn)
                changes.push({title: label + " - " + "Damage", before: spellDiff.effectBurn.before, after: spellDiff.effectBurn.after});

            if(spellDiff.tooltip || spellDiff.vars)
            {
                var before = beforeData.champions.data[champ].spells[i];
                var after = afterData.champions.data[champ].spells[i];

                var beforeText = formatSpell(before.tooltip, before);
                var afterText = formatSpell(after.tooltip, after);

                var title = label + " - " + after.name;

                changes.push({title: title, before: beforeText, after: afterText});
            }
        }

        if(champDiff.spells)
        {
            var spellIdentifier = ["Q", "W", "E", "R"];
            for(var i = 0; i < champDiff.spells.length; i++)
            {
                if(champDiff.spells[i])
                    parseSpell(spellIdentifier[i], champDiff.spells[i]);
            }
        }

        if(champDiff.passive)
            parseSpell("Passive", champDiff.passive);

        if(champDiff.stats)
        {
            for(var key in champDiff.stats)
            {
                var statDiff = champDiff.stats[key];
                changes.push({title: key, before: statDiff.before, after: statDiff.after});
            }
        }

        if(champDiff.skins)
        {
            var addedSkins = {};
            var removedSkins = {};

            var before = champDiff.skins.before;
            var after = champDiff.skins.after;

            for(var i = 0; i < after.length; i++)
            {
                var id = after[i].id;
                addedSkins[id] = after[i];
            }

            for(var i = 0; i < before.length; i++)
            {
                var id = before[i].id;
                if(addedSkins[id])
                    delete addedSkins[id];
                else
                    removedSkins[id] = before[i];
            }

            for(var key in addedSkins)
                data.newSkins.push(addedSkins[key]);
            for(var key in removedSkins)
                data.removedSkins.push(removedSkins[key]);

            delete champDiff.skins;
        }

        data.images[champ] = "http://ddragon.leagueoflegends.com/cdn/" +
            afterData.champions.version + "/img/champion/" + afterData.champions.data[champ].image.full;

        data.champions[champ] = changes;
    }

    return data;
};

function formatSpell(text, spell)
{
    var replacements = {};

    if(spell.effectBurn)
    {
        for(var i = 1; i < spell.effectBurn.length; i++)
        {
            replacements["{{ e" + i + " }}"] = spell.effectBurn[i];
        }
    }
    if(spell.vars)
    {
        for(var i = 0; i < spell.vars.length; i++)
        {
            var val = spell.vars[i];
            replacements["{{ " + val.key + " }}"] = val.coeff.join("/");
        }
    }
    if(spell.costBurn)
    {
        replacements.cost = spell.costBurn;
    }

    for(var key in replacements)
    {
        if(text.indexOf(key) != -1)
            text = text.replace(new RegExp(escapeRegexp(key), "g"), replacements[key]);
    }

    return text;
}

function escapeRegexp(text)
{
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
