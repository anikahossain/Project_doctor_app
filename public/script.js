$(document).ready(function(){
console.log('script is running!');

//retrieving data from api about location
  var docInfo = function(info){
     $.ajax ({
      //put info somewhere in here
      url: "https://api.betterdoctor.com/2016-03-01/doctors?location="+ info +"&user_location=37.773%2C-122.413&skip=0&limit=10&user_key=705afbee08e4b69ffce243dfeb346f50",
      method: "GET",
      datatype: "jsonp"
      })
    .done(function(results){
      console.log(results);
     handleDoctorData(results);

      })
  };
  //on click, run docinfo, pass in the value of the input field and append it to your ajax url.
// docInfo();
document.querySelector('#docsearch input[type="submit"]').addEventListener('click', function(e){ //sends event as arguement
  e.preventDefault();
  var state = document.querySelector('#docsearch input[name="state"]').value;
  var city = document.querySelector('#docsearch input[name="city"]').value;
  docInfo(state + "-" + city); //won't be called until the submit button is clicked
}); //targets submit button in the doc search form


function handleDoctorData(data){
  var results = "";
  data.data.forEach(function(doctor){
    var name = doctor.practices[0].name;
    var specialties = []; //creates new empty array
    doctor.specialties.forEach(function(specialty){
      specialties.push({name:specialty.name, description:specialty.description});
    });
    var address = [];
    doctor.practices.forEach(function(practice){
      addr = practice.visit_address.street + " " + practice.visit_address.city + " " + practice.visit_address.state + " " + practice.visit_address.zip;
      if(!address.includes(addr)){
        address.push(addr);
      }
    });
    var uid = doctor.uid;

    results+=htmlTemplate({
      name: name,
      specialties: specialties,
      address: address,
      uid: uid
    });
  });
  document.querySelector('#search').innerHTML=results;
  var buttons = document.querySelectorAll("button");//buttons is an array like object called element list
  [].forEach.call(buttons, function(button){//.call swaps out empty array and puts in buttons and forces it to work on buttons
    button.addEventListener("click", saveDoctor);
  });
}

function saveDoctor(){//save doctor is being called when click event happens
  var uid = this.getAttribute("data-uid");//keyword this refers to button that was just clicked
  console.log(uid);
  $.ajax ({
    url: "/saveDoctor",
    data: {uid: uid},
    type: "POST"
  })
  .done(function(){
    console.log("saved");
  })
  .fail(function(){
    console.log("saved failed");
  });
}

function htmlTemplate(obj){
  var results = "<h3>" + obj.name;
  if (id){
    results+= " <button data-uid="+ obj.uid +">Save</button>";
  }
  results+="</h3>";
  obj.specialties.forEach(function(specialty){
    results+= "<h4>" + specialty.name + "</h4>";
    results+= "<p>" + specialty.description + "</p>";
  });
  obj.address.forEach(function(addr){
    results+= "<p>" + addr + "</p>";
  });
  return results;
}


var id = document.querySelector("[data-id]");
if (id){
  id = id.getAttribute("data-id");
}
console.log(id);








});
