
// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {
    // Receipt verification (https://github.com/mozilla/receiptverifier)
    require('receiptverifier');

    // Installation button
    require('./install-button');

    // Install the layouts
    require('layouts/layouts');

    // Write your app here.


    function formatDate(d) {
        return (d.getMonth()+1) + '/' +
            d.getDate() + '/' +
            d.getFullYear();
    }

    // List view

    var list = $('.list').get(0);
    // list.add({ title: 'Make things',
    //            desc: 'Make this look like that',
    //            date: new Date(12, 9, 5) });

navigator.mozSetMessageHandler("alarm", function (mozAlarm) { 
  alert("alarm fired: " + JSON.stringify(mozAlarm.data)); 
});

var alarms_req = navigator.mozAlarms.getAll();
console.log('alarmas',alarms_req);

alarms_req.onsuccess = function() {
    console.log('exito en consulta');
    this.result.forEach(function (alarm) {
        console.log(alarm);
        list.add({
            title: alarm.id + ' : ' + alarm.date.toString() + ' : ' + alarm.respectTimezone,
            desc: 'Peps',
            date: alarm.date
        });
    });
};

console.log(navigator.mozHasPendingMessage("alarm"));

alarms_req.onerror = function () {
  console.log('operation failed: ' + this.error);
};


var alarm = {
  date: new Date(2014,5,28,1,35,0),
  respectTimezone: 'honorTimezone',
  data: {
    message: "Do something dude!"
  }
};

var request = navigator.mozAlarms.add(alarm.date, alarm.respectTimezone, alarm.data);

request.onsuccess = function () {
  console.log('A new alarm has been set:' + this.result);
  alarm.id = this.result; // get the id of the new alarm.
   list.add({
            title: alarm.id + ' : ' + alarm.date.toString() + ' : ' + alarm.respectTimezone,
            desc: 'Peps',
            date: alarm.date
        });
};

    // for(var i=0; i<alarms.length; i++) {
    //     list.add({ title: 'Move stuff',
    //                desc: 'Move this over there',
    //                date: new Date(12, 10, 1) });
    // }

    // Detail view

    var detail = $('.detail').get(0);
    detail.render = function(item) {
        $('.title', this).html(item.get('title'));
        $('.desc', this).html(item.get('desc'));
        $('.date', this).text(formatDate(item.get('date')));
    };

    // Edit view

    var edit = $('.edit').get(0);
    edit.render = function(item) {
        item = item || { id: '', get: function() { return ''; } };

        $('input[name=id]', this).val(item.id);
        $('input[name=title]', this).val(item.get('title'));
        $('input[name=desc]', this).val(item.get('desc'));
    };

    edit.getTitle = function() {
        var model = this.view.model;

        if(model) {
            return model.get('title');
        }
        else {
            return 'New';
        }
    };

    $('button.add', edit).click(function() {
        var el = $(edit);
        var title = el.find('input[name=title]');
        var desc = el.find('input[name=desc]');
        var model = edit.model;

        if(model) {
            model.set({ title: title.val(), desc: desc.val() });
        }
        else {
            list.add({ title: title.val(),
                       desc: desc.val(),
                       date: new Date() });
        }

        edit.close();
    });
});