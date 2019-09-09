"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveGlobalMessage", function (message) {    
    var msg = message.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = message.userId + " from global group says " + msg;
    console.log(msg);
    console.log(encodedMsg);
    var li = CreateLi(encodedMsg);

    function CreateLi(encodedMsg) {
        var li = document.createElement("li");
        li.textContent = encodedMsg;
        return li;
    }

    document.getElementById("globalMessagesList").appendChild(CreateLi(encodedMsg));
});

//"ReceiveMessage", messageText, groupId, userId
connection.on("ReceiveMessage", function (message, group, user) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " from " + group + " says " + msg;
    console.log(msg);
    console.log(encodedMsg);
    var li = CreateLi(encodedMsg);

    function CreateLi(encodedMsg) {
        var li = document.createElement("li");
        li.textContent = encodedMsg;
        return li;
    }

    if (group == 'A') {
        console.log("in group A");
        document.getElementById("groupAMessagesList").appendChild(CreateLi(encodedMsg));
    }
    if (group == "B") {
        console.log("in group B");
        document.getElementById("groupBMessagesList").appendChild(CreateLi(encodedMsg));
    }
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    console.log("In send button function ")
    var user = document.getElementById("userInput").value;
    console.log(user);
    var message = document.getElementById("messageInput").value;
    console.log(message);
    var group = document.getElementById("groupInput").value;
    //connection.invoke("SendMessage", user, message).catch(function (err) {
    //    return console.error(err.toString());
    //});
    console.log(group);
    connection.invoke("SendMessageToGroup", user, message, group).catch(function (err) {
        return console.error(err.toString());
    });
    document.getElementById("messageInput").value = "";
    document.getElementById("groupInput").value = "";
    event.preventDefault();
});

document.getElementById("sendGlobalMessageButton").addEventListener("click", function (event) {
    console.log("In global send button function ")
    var user = document.getElementById("userInput").value;
    console.log(user);
    var text = document.getElementById("messageInput").value;
    console.log(text);
    let message =
    {
        'Id': 0,
        'GroupId': null,
        'UserId': 2,
        'Text': text,
        'Date': new Date()
    }; 

    connection.invoke("SendMessageToGlobalGroup", message).catch(function (err) {
        return console.error(err.toString());
    });
    document.getElementById("messageInput").value = "";
    event.preventDefault();
});


document.getElementById("joinGroup").addEventListener("click", function (event) {
    console.log("In joinGroup button function ")
    var group = document.getElementById("group").value;
    console.log(group);
    connection.invoke("JoinToGroup", group).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});




