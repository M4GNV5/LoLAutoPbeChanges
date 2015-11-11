$.getJSON("/data.json", function(data)
{
    var changesElement = $("#changes");

    console.dir(data);
    var champChanges = data.champions;
    for(var champ in champChanges)
    {
        var changes = champChanges[champ];

        var rowspan = changes.length + 1;
        changesElement.append('<tr><td rowspan=' + rowspan + '><img src="' + data.images[champ] + '" /></td><td colspan=3><h3>' + champ + '</h3></td></tr>');

        for(var i = 0; i < changes.length; i++)
        {
            var title = changes[i].title;
            var before = changes[i].before;
            var after = changes[i].after;

            changesElement.append('<tr><td><h4>' + title + '</h4></td><td>' + before + '</td><td>' + after + '</td></tr>');
        }
    }

    console.log("done");
});
