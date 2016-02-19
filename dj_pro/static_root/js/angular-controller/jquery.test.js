app.controller('jquery_test_ctrl', function($scope,$timeout) {

    var ctx = $("#myChart").get(0).getContext("2d");
    //This will get the first returned node in the jQuery collection.
    var data = {
    labels : ["January","February","March","April","May","June","July"],
    datasets : [
        {
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            data : [65,59,90,81,56,55,40]
        },
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
            pointStrokeColor : "#fff",
            data : [28,48,40,19,96,27,100]
        }
        ]
    };

    options =  {
        scaleFontColor: "#f00",
        datasetStrokeWidth: 5
    };

    var myNewChart = new Chart(ctx).Line(data,options);

    var bar = $("#ChartBar").get(0).getContext("2d");
    var bardata = {
    labels : ["January","February","March","April","May","June","July"],
    datasets : [
        {
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "rgba(220,220,220,1)",
            data : [65,59,90,81,56,55,40]
        },
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            data : [28,48,40,19,96,27,100]
        }
        ]
    };
    mybar = new Chart(bar).Bar(bardata,options);
    
    var radardata = {
    labels : ["Eating","Drinking","Sleeping","Designing","Coding","Partying","Running"],
    datasets : [
        {
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            data : [65,59,90,81,56,55,40]
        },
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
            pointStrokeColor : "#fff",
            data : [28,48,40,19,96,27,100]
        }
    ]
};
    var radar = $("#RadarBar").get(0).getContext("2d");
    new Chart(radar).Radar(radardata,options);

    var polardata = [
    {
        value : 30,
        color: "#D97041"
    },
    {
        value : 90,
        color: "#C7604C"
    },
    {
        value : 24,
        color: "#21323D"
    },
    {
        value : 58,
        color: "#9D9B7F"
    },
    {
        value : 82,
        color: "#7D4F6D"
    },
    {
        value : 8,
        color: "#584A5E"
    }
    ];
    var polar = $("#Polar").get(0).getContext("2d");
    polarchart = new Chart(polar).PolarArea(polardata,options);
    
    var piedata = [
    {
        value: 30,
        color:"#F38630"
    },
    {
        value : 50,
        color : "#E0E4CC"
    },
    {
        value : 100,
        color : "#69D2E7"
    }           
    ];
    var pie = $("#Pie").get(0).getContext("2d");
    piechart = new Chart(pie).PolarArea(piedata,options);
    var doughnutdata = [
    {
        value: 30,
        color:"#F7464A"
    },
    {
        value : 50,
        color : "#E2EAE9"
    },
    {
        value : 100,
        color : "#D4CCC5"
    },
    {
        value : 40,
        color : "#949FB1"
    },
    {
        value : 120,
        color : "#4D5360"
    }

    ];
    var dough = $("#Dough").get(0).getContext("2d");
    doughchart = new Chart(dough).Doughnut(doughnutdata,options);
});
