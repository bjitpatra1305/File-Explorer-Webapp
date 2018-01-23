$( document ).ready(function() {

    var bindClickFunction = function () {
        $(".filename").click(function (e) {
            e.preventDefault();
            var type = $(this).attr('data-type');
            var currentDir = $("#currentDir").html();
            var name = $(this).attr('data-name');
            if (currentDir == '/') currentDir = '';

            if (type == "file") {
                var win = window.open('/get_file?path=' + currentDir + '/' + name, '_blank');
                win.focus();
            }
            else {
                var newDirectory = currentDir + "/" + name;
                fetchDirectory(newDirectory);
            }
        });
    };


    var fetchDirectory = function (path) {
        path = path || '/';
        fetch("/list_dir?path="+path, {
            headers: {
                Authorization: "Basic " + btoa("sayan" + ":" + "abcd")
            }
        }).then(function(response){
            return response.json();
        }).then(function(data){
            $("#currentDir").text(path);
            $("#dirList").text('');
            for(var i=0;i<data.length; i++) {
                var string = "<tr> <td class='filename' data-type='"+ data[i].type +  "' data-name='"+ data[i].name + "'><a href='#'>" + data[i].name + "</a></td> <td>" + data[i].type + "</td> <td>" + data[i].size + "</td> </tr>";
                $("#dirList").append(string);
            }
            bindClickFunction();
        })
    };

    fetchDirectory("C:\\\\Users\\\\sayan");


});