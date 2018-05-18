$(document).ready(function(){

    var config = {
        apiKey: "AIzaSyDl8iPIJyJoDg1tGKhpmcr-NocEoezL8TE",
        authDomain: "traintime-d6124.firebaseapp.com",
        databaseURL: "https://traintime-d6124.firebaseio.com",
        projectId: "traintime-d6124",
        storageBucket: "traintime-d6124.appspot.com",
        messagingSenderId: "120373722569"
      };
      
    firebase.initializeApp(config);
    
    var database = firebase.database();
    
    // Initial Values
    var trainName = "";
    var destination = "";
    var firstTrain = "";
    var frequency = "";
    
    $("#submit-btn").on("click", function(event) {
        event.preventDefault();
    
        trainName = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train-time").val().trim();
        frequency = parseInt($("#frequency").val().trim());
    
        database.ref().push({
            TrainName: trainName,
            Destination: destination,
            FirstTrain: firstTrain,
            Frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        })
    });
    
      database.ref().orderByChild("dateAdded").limitToLast(10).on("child_added", function(snapshot) {
        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();
        var currentDate = moment();
        var trainArrivals = moment().hour(sv.FirstTrain.split(':')[0]).minutes(sv.FirstTrain.split(':')[1]);
        var nextTrain = false;
        var nextTrainTime = '';
        var minAway = '';

        console.log(currentDate);
        console.log(trainArrivals);

        while (nextTrain == false ){
            if(currentDate.diff(trainArrivals, 'minutes') < 0){
                console.log(currentDate.diff(trainArrivals, 'minutes'));
                nextTrain = true;
            } else {
                trainArrivals.add(sv.Frequency, "minutes");
            }
        }

        nextTrainTime = trainArrivals.hours() + ':' + trainArrivals.minutes();
        minAway = trainArrivals.diff(currentDate, 'minutes');



        // Console.logging the last user's data
        console.log(sv.TrainName);
        console.log(sv.Destination);
        console.log(sv.FirstTrain);
        console.log(sv.Frequency);
    
        var row = $("<tr>");
        row.append(`<td>${sv.TrainName}</td>`)
        row.append(`<td>${sv.Destination}</td>`)
        row.append(`<td>${sv.Frequency}</td>`)
        row.append(`<td>${nextTrainTime}</td>`)
        row.append(`<td>${minAway}</td>`)


    
        $("table").append(row);
        // Change the HTML to reflect
        // $("#name-display").text(sv.employeeName);
        // $("#roll-display").text(sv.roll);
        // $("#start-display").text(sv.startDate);
        // $("#rate-display").text(sv.monthlyRate);
    
        // Handle the errors
      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });
    });