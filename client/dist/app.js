(function () {
  // everything API related
  var API = {};
  // your API URL from Amazon API Gateway (important: without a trailing '/')
  API.rootUrl = 'https://0okt1o8r80.execute-api.eu-west-1.amazonaws.com/dev';

  // NOTE: this function was used multiple times for simplicity sake (e.g. when updating a car).
  // you should avoid this in a production environment as it adds up costs for the usage of the API gateway.
  API.getAllCars = function () {
    $.ajax({
      type: 'GET',
      url: 'https://0okt1o8r80.execute-api.eu-west-1.amazonaws.com/dev/cars',
      contentType: 'application/json',
      success: function (data, textStatus, xhr) {
        if (textStatus === 'success') {
          rerenderCarsList(data.car);
        }  else {
          showFlash('An error occurred while loading the cars. Please try again');
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        showFlash('An error occurred while loading the cars: ' + textStatus)
      }
    });
  };


API.createCar = function (body) {
  var data = {
    car: {
      body: body
    }
  };

  if (body.length !== 0) {
    $.ajax({
      type: 'POST',
      url: API.rootUrl + '/car',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (data, textStatus, xhr) {
        if (textStatus === 'success') {
          clearTextarea();
          API.getAllCars();
        } else {
          showFlash('An error occurred while creating the car. Please try again');
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        showFlash('An error ocurred while creating your car:' + textStatus);
      }
    });
  } else {
    showFlash('Body should not be blank');
  }
};



API.updateCar = function (id, body) {
  var data = {
    car: {
      body: body
    }
  }

  if (body.length !== 0) {
    if (id.length !== 0) {
      $.ajax({
        type: 'PUT',
        url: API.rootUrl + '/car/' + id,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data, textStatus, xhr) {
          if (textStatus === 'success') {
            clearTextarea();
            API.getAllCars();
          } else {
            showFlash('An error occurred while updating your car. Please try again');
          }
        },
        error: function (xhr, textStatus, errorThrown) {
          showFlash('An error ocurred while updating your car: ' + textStatus);
        }
      });
    } else {
      showFlash('Id should not be blank');
    }
  } else {
    showFlash('Body should not be blank');
  }
};


API.deleteCar = function (id) {
  if (id.length !== 0) {
    $.ajax({
      type: 'DELETE',
      url: API.rootUrl + '/car/' + id,
      contentType: 'application/json',
      success: function (data, textStatus, xhr) {
        if (textStatus === 'success') {
          $('[data-id=selected-car-id]').val('');
          API.getAllCars();
        } else {
          showFlash('An error occurred while deleting the car. Please try again');
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        showFlash('An error ocurred while deleting the car: ' + textStatus);
        console.log(xhr);
      }
    });
  } else {
    showFlash('Id should not be blank');
  }
};



// frontend DOM manipulations
var rerenderCarsList = function (cars) {
  var html = ''
  if (cars.length !== 0) {
    html = '<ul>';
    cars.forEach(function (car) {
      html += '<li data-car-id="' + car.id + '""><button class="no-style delete-car-button" data-id="delete-car"><i class="fa fa-trash"></i></button><span data-id="select-car">'+ car.body + '</span></li>';
    });
    html += '</ul>';
  } else {
    html += 'There are no cars available yet. Create the first one now!';
  }
  $('[data-id=dynamic-content]').html(html);
};

var showFlash = function (message) {
  var flashElement = $('[data-id=flash]').text(message);
  $(flashElement).toggle();
  setTimeout(function() {
      $(flashElement).toggle();
  }, 5000);
};

var clearTextarea = function () {
  $('[data-id=body]').val('');
  $('[data-id=selected-car-id]').val('');
};

// click handlers
$('[data-id=refresh]').on('click', function () {
  API.getAllCars();
});

$('[data-id=save-car]').on('click', function () {
  var selectedCarId = $('[data-id=selected-car-id]').val();
  var body = $('[data-id=body]').val();
  if (body.length !== 0) {
    // create a new car if nothing is selected
    if (selectedCarId.length === 0) {
      API.createCar(body);
    } else {
      API.updateCar(selectedCarId, body);
    }
  } else {
    showFlash('Body should not be blank');
  }
});

$(document).on('click', '[data-id=delete-car]', function
(event) {
  if (confirm('Do you really want to delete this car?')) {
    var id = ($(event.currentTarget).closest('li').data('car-id'));
    if (id.length !== 0) {
      API.deleteCar(id);
    }
  }
});


$(document).on('click', '[data-id=select-car]', function
(event) {
  var id = ($(event.currentTarget).closest('li').data('car-id'));
  var body = ($(event.currentTarget).closest('li').text());
  $('[data-id=selected-car-id]').val(id);
  $('[data-id=body]').val(body);
});
$('[data-id=clear]').on('click', function () {
     clearTextarea();
  });
  // load all cars initially
  API.getAllCars();
})();
