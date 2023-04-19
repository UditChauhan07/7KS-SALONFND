let barberCategory = {
  services:undefined,
  hairType:undefined
}
function SubmitCreateUserForm() {
  let oname = $("#create-salon-buisness-owner-name").val();
  let oemail = $("#create-salon-buisness-owner-email").val();
  let ophone = $("#create-salon-buisness-owner-phone").val();
  let password = $("#create-salon-buisness-password").val();
  let cpassword = $("#create-salon-buisness-c-password").val();
  if (!oname) {
    $("#create-salon-buisness-owner-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-owner-error").addClass("d-none");
  }
  if (!oemail) {
    $("#create-salon-buisness-owner-email-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-owner-email-error").addClass("d-none");
  }
  if (!ophone) {
    $("#create-salon-buisness-owner-phone-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-owner-phone-error").addClass("d-none");
  }
  if (!password) {
    $("#create-salon-buisness-password-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-password-error").addClass("d-none");
  }
  if (!cpassword) {
    $("#create-salon-buisness-c-password-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-c-password-error").addClass("d-none");
  }
  if (oname && oemail && ophone && password === cpassword) {
    if (true) {
      $("#salonCreationFormButton").removeClass("disabled").addClass("active");
      $("#salonCreationForm").addClass("show active");
    } else {
      $("#BarberCreationFormButton").removeClass("disabled").addClass("active");
      $("#BarberCreationForm").addClass("show active");
    }
    $("#UserCreationFormButton").addClass("disabled");
    $("#UserCreationFormButton").removeClass("active");
    $("#UserCreationForm").removeClass("show active");
  }
}
function previous() {
  $("#salonCreationFormButton").addClass("disabled").removeClass("active");
  $("#BusinessServicesButton").addClass("disabled").removeClass("active");
  $("#UserCreationFormButton").removeClass("disabled").addClass("active");
  $("#salonCreationForm").removeClass("show active");
  $("#BusinessServices").removeClass("show active");
  $("#UserCreationForm").addClass("show active");
}
function step1(){
  $("#BusinessServicesButton").addClass("disabled").removeClass("active");
  $("#UserCreationFormButton").addClass("disabled").removeClass("active");
  $("#salonCreationFormButton").removeClass("disabled").addClass("active");
  $("#BusinessServices").removeClass("show active");
  $("#UserCreationForm").removeClass("show active");
  $("#salonCreationForm").addClass("show active");  
}
function step2(){
  let fullName = $("#create-salon-buisness-name").val();
  let email = $("#create-salon-buisness-email").val();
  let phone = $("#create-salon-buisness-phone").val();
  let address = $("#create-salon-buisness-address").val();
  let city = $("#create-salon-buisness-city").val();
  let state = $("#create-salon-buisness-state").val();
  let zipCode = $("#create-salon-buisness-zipCode").val();
  let country = $("#create-salon-buisness-country").val();
  let businessType = $("#create-salon-buisness-type").val();
  let weekData = [];
  $(".weekCheck:checked").map((i, e) => {
    weekData.push($(e).attr('data-week'))
  });
  let hairType = $('#create-salon-buisness-hair-type').val();
  let services = $('#create-salon-buisness-service').val();
  let latitute = $('#create-salon-buisness-latitute').val();
  let longitute = $('#create-salon-buisness-longitute').val();
  let openTime = $('#salon-create-working-closing').val();
  let closeTime = $('#salon-create-working-closing').val();

  if (!fullName || fullName == "") {
    $("#create-salon-buisness-name-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-name-error").addClass("d-none");
  }
  if (!email) {
    $("#create-salon-buisness-email-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-email-error").addClass("d-none");
  }
  if (!phone) {
    $("#create-salon-buisness-phone-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-phone-error").addClass("d-none");
  }
  if (!address) {
    $("#create-salon-buisness-address-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-address-error").addClass("d-none");
  }
  if (!city) {
    $("#create-salon-buisness-city-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-city-error").addClass("d-none");
  }
  if (!state) {
    $("#create-salon-buisness-state-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-state-error").addClass("d-none");
  }
  if (!zipCode) {
    $("#create-salon-buisness-zipCode-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-zipCode-error").addClass("d-none");
  }
  if (!country) {
    $("#create-salon-buisness-country-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-country-error").addClass("d-none");
  }
  if (!weekData.length) {
    $("#create-salon-buisness-weekCheck-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-weekCheck-error").addClass("d-none");
  }
  if (!hairType.length) {
    $("#create-salon-buisness-hair-type-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-hair-type-error").addClass("d-none");
  }
  if (!services.length) {
    $("#create-salon-buisness-service-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-service-error").addClass("d-none");
  }
  if (!longitute) {
    $("#create-salon-buisness-longitute-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-longitute-error").addClass("d-none");
  }
  if (!latitute) {
    $("#create-salon-buisness-latitute-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-latitute-error").addClass("d-none");
  }
  if (!closeTime) {
    $("#salon-create-working-closing-error").removeClass("d-none");
  } else {
    $("#salon-create-working-closing-error").addClass("d-none");
  }
  if (!openTime) {
    $("#salon-create-working-opening-error").removeClass("d-none");
  } else {
    $("#salon-create-working-opening-error").addClass("d-none");
  }
  if (!businessType) {
    $("#create-salon-buisness-type-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-type-error").addClass("d-none");
  }
  if (fullName && email && phone && address && city && state && zipCode && country && weekData.length && hairType.length && services.length && businessType && longitute && latitute) {
  $("#salonCreationFormButton").addClass("disabled").removeClass("active");
  $("#UserCreationFormButton").addClass("disabled").removeClass("active");
  $("#BusinessServicesButton").removeClass("disabled").addClass("active");
  $("#salonCreationForm").removeClass("show active");
  $("#UserCreationForm").removeClass("show active");
  $("#BusinessServices").addClass("show active");
  barberCategory.services = services;
  barberCategory.hairType = hairType;
  barberCategoryForm(barberCategory);
  console.log({barberCategory})
  }
}
$(".weekCheck").on("change", function () {
  src = $(this).val();
  triggerId = $(this).attr("data-triger");
  $(`#${triggerId}`).attr("disabled", !$(`#${triggerId}`).attr("disabled"));
});

function submitCreateSalon() {
  let fullName = $("#create-salon-buisness-name").val();
  let email = $("#create-salon-buisness-email").val();
  let phone = $("#create-salon-buisness-phone").val();
  let aphone = $("#create-salon-buisness-a-phone").val();
  let isEActivated = $("#create-salon-buisness-isEnabled:checked").val();
  let isVerifed = $("#create-salon-buisness-isisVerifed:checked").val();
  let address = $("#create-salon-buisness-address").val();
  let city = $("#create-salon-buisness-city").val();
  let state = $("#create-salon-buisness-state").val();
  let zipCode = $("#create-salon-buisness-zipCode").val();
  let country = $("#create-salon-buisness-country").val();
  let businessType = $("#create-salon-buisness-type").val();
  let weekData = [];
  $(".weekCheck:checked").map((i, e) => {
    weekData.push($(e).attr('data-week'))
  });
  let oname = $("#create-salon-buisness-owner-name").val();
  let oemail = $("#create-salon-buisness-owner-email").val();
  let ophone = $("#create-salon-buisness-owner-phone").val();
  let password = $("#create-salon-buisness-password").val();
  let cpassword = $("#create-salon-buisness-c-password").val();
  let isEnabled = $("#create-salon-buisness-isEnabled:checked").val();
  let hairType = $('#create-salon-buisness-hair-type').val();
  let services = $('#create-salon-buisness-service').val();
  let latitute = $('#create-salon-buisness-latitute').val();
  let longitute = $('#create-salon-buisness-longitute').val();
  let openTime = $('#salon-create-working-closing').val();
  let closeTime = $('#salon-create-working-closing').val();

  if (!fullName || fullName == "") {
    $("#create-salon-buisness-name-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-name-error").addClass("d-none");
  }
  if (!email) {
    $("#create-salon-buisness-email-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-email-error").addClass("d-none");
  }
  if (!phone) {
    $("#create-salon-buisness-phone-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-phone-error").addClass("d-none");
  }
  if (!address) {
    $("#create-salon-buisness-address-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-address-error").addClass("d-none");
  }
  if (!city) {
    $("#create-salon-buisness-city-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-city-error").addClass("d-none");
  }
  if (!state) {
    $("#create-salon-buisness-state-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-state-error").addClass("d-none");
  }
  if (!zipCode) {
    $("#create-salon-buisness-zipCode-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-zipCode-error").addClass("d-none");
  }
  if (!country) {
    $("#create-salon-buisness-country-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-country-error").addClass("d-none");
  }
  if (!weekData.length) {
    $("#create-salon-buisness-weekCheck-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-weekCheck-error").addClass("d-none");
  }
  if (!hairType.length) {
    $("#create-salon-buisness-hair-type-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-hair-type-error").addClass("d-none");
  }
  if (!services.length) {
    $("#create-salon-buisness-service-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-service-error").addClass("d-none");
  }
  if (!oname) {
    $("#salonCreationForm").removeClass("show active");
    $("#BarberCreationForm").removeClass("show active");
    $("#UserCreationForm").addClass("show active");
    $("#UserCreationFormButton").removeClass("disabled").addClass("active");
    $("#salonCreationFormButton").removeClass("disabled").removeClass("active");
    $("#BarberCreationFormButton").addClass("disabled").removeClass("active");
    $("#create-salon-buisness-owner-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-owner-error").addClass("d-none");
  }
  if (!oemail) {
    $("#salonCreationForm").removeClass("show active");
    $("#BarberCreationForm").removeClass("show active");
    $("#UserCreationForm").addClass("show active");
    $("#UserCreationFormButton").removeClass("disabled").addClass("active");
    $("#salonCreationFormButton").removeClass("disabled").removeClass("active");
    $("#BarberCreationFormButton").addClass("disabled").removeClass("active");
    $("#create-salon-buisness-owner-email-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-owner-email-error").addClass("d-none");
  }
  if (!ophone) {
    $("#salonCreationForm").removeClass("show active");
    $("#BarberCreationForm").removeClass("show active");
    $("#UserCreationForm").addClass("show active");
    $("#UserCreationFormButton").removeClass("disabled").addClass("active");
    $("#salonCreationFormButton").removeClass("disabled").removeClass("active");
    $("#BarberCreationFormButton").addClass("disabled").removeClass("active");
    $("#create-salon-buisness-owner-phone-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-owner-phone-error").addClass("d-none");
  }
  if (!password) {
    $("#salonCreationForm").removeClass("show active");
    $("#BarberCreationForm").removeClass("show active");
    $("#UserCreationForm").addClass("show active");
    $("#UserCreationFormButton").removeClass("disabled").addClass("active");
    $("#salonCreationFormButton").removeClass("disabled").removeClass("active");
    $("#BarberCreationFormButton").addClass("disabled").removeClass("active");
    $("#create-salon-buisness-password-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-password-error").addClass("d-none");
  }
  if (!cpassword) {
    $("#salonCreationForm").removeClass("show active");
    $("#BarberCreationForm").removeClass("show active");
    $("#UserCreationForm").addClass("show active");
    $("#UserCreationFormButton").removeClass("disabled").addClass("active");
    $("#create-salon-buisness-c-password-error").removeClass("d-none");
    $("#salonCreationFormButton").removeClass("disabled").removeClass("active");
    $("#BarberCreationFormButton").addClass("disabled").removeClass("active");
  } else {
    $("#create-salon-buisness-c-password-error").addClass("d-none");
  }
  if (!longitute) {
    $("#create-salon-buisness-longitute-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-longitute-error").addClass("d-none");
  }
  if (!latitute) {
    $("#create-salon-buisness-latitute-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-latitute-error").addClass("d-none");
  }
  if (!closeTime) {
    $("#salon-create-working-closing-error").removeClass("d-none");
  } else {
    $("#salon-create-working-closing-error").addClass("d-none");
  }
  if (!openTime) {
    $("#salon-create-working-opening-error").removeClass("d-none");
  } else {
    $("#salon-create-working-opening-error").addClass("d-none");
  }
  if (!businessType) {
    $("#create-salon-buisness-type-error").removeClass("d-none");
  } else {
    $("#create-salon-buisness-type-error").addClass("d-none");
  }
  let businessServices = [];
  let errorIndex = 0;
  let serviceNames = $('input[name^=serviceName]').serializeArray()
  let serviceDescription = $('input[name^=serviceDescription]').serializeArray()
  let serviceTime = $('input[name^=serviceTime]').serializeArray()
  let servicePrice = $('input[name^=servicePrice]').serializeArray()
  let serviceDescription1 = $('input[name^=serviceLongDescription]').serializeArray()
  $('.servicesName').map((i1, e1) => {
    $('.servicePrice').map((i2, e2) => {
      $('.serviceTime').map((i3, e3) => {
        $('.serviceDescription').map((i4, e4) => {
          $('.serviceLongDescription').map((i5, e5) => {
            if ($(e1).val() != '' && $(e2).val() != '' && $(e3).val() != '' && $(e4).val() != '') {
            } else {
              if ($(e1).val() == '') {
                $('#' + $(e1).attr('id') + '-error').removeClass('d-none');
              } else {
                $('#' + $(e1).attr('id') + '-error').addClass('d-none');
              }
              if ($(e2).val() == '') {
                $('#' + $(e2).attr('id') + '-error').removeClass('d-none');
              } else {
                $('#' + $(e2).attr('id') + '-error').addClass('d-none');
              }
              if ($(e3).val() == '') {
                $('#' + $(e3).attr('id') + '-error').removeClass('d-none');
              } else {
                $('#' + $(e3).attr('id') + '-error').addClass('d-none');
              }
              if ($(e4).val() == '') {
                $('#' + $(e4).attr('id') + '-error').removeClass('d-none');
              } else {
                $('#' + $(e4).attr('id') + '-error').addClass('d-none');
              }
            }
          })
        })
      })
    })
  })
  serviceNames.map((e, i) => {
    let data = undefined;
    data = {
      name: e.value,
      description1: serviceDescription[i].value,
      description2: serviceDescription1[i].value,
      time: serviceTime[i].value,
      price: servicePrice[i].value
    }
    if (data) businessServices.push(data)
    if (e.value == '') {
      // $(`#create-salon-buisness-service-name-${i + 1}-error`).removeClass('d-none');
      errorIndex++;
    } else {
      // $(`#create-salon-buisness-service-name-${i + 1}-error`).addClass('d-none');
    }
    if (servicePrice[i].value == '') {
      // $(`#create-salon-buisness-service-price-${i + 1}-error`).removeClass('d-none');
      errorIndex++;
    } else {
      // $(`#create-salon-buisness-service-price-${i + 1}-error`).addClass('d-none');
    }
    if (serviceTime[i].value == '') {
      // $(`#create-salon-buisness-service-time-${i + 1}-error`).removeClass('d-none');
      errorIndex++;
    } else {
      // $(`#create-salon-buisness-service-time-${i + 1}-error`).addClass('d-none');
    }
    if (serviceDescription[i].value == '') {
      // $(`#create-salon-buisness-service-desc-${i + 1}-error`).removeClass('d-none');
      errorIndex++;
    } else {
      // $(`#create-salon-buisness-service-desc-${i + 1}-error`).addClass('d-none');
    }
  });
  if (fullName && email && phone && address && city && state && zipCode && country && weekData.length && oname && oemail && ophone && password === cpassword && hairType.length && services.length && errorIndex == 0 && businessType && longitute && latitute) {
    let data = {
      salonName: fullName,
      salonEmail: email,
      salonPhone: phone,
      salonAPhone: aphone,
      salonStatus: isEActivated || 0,
      salonVerifed: isVerifed || 0,
      salonAddress: address,
      salonCity: city,
      salonState: state,
      salonZipCode: zipCode,
      salonCountry: country,
      salonOpening: weekData,
      salonWorking: openTime + '-' + closeTime,
      longitute, latitute,
      salonHairType: hairType,
      salonServices: services,
      userName: oname,
      userEmail: oemail,
      userPhone: ophone,
      userPassword: password,
      businessServices: JSON.stringify(businessServices),
      userStatus: isEnabled || 0,
      businesstypeId: businessType
    };
    sender(data)
  }
}
function sender(data) {
  $.ajax({
    type: "post",
    url: "/salon/create",
    data: data,
    success: function (result) {
      console.log(result);
      if (result.status) {
        if ($("#upload").val()) {
          // $("#uploadImgCreatesalon").submit();
        } else {
          window.location = "/salon";
        }
      }
    },
    error: function (data) {
      console.log("Error:", data);
    },
  });
  //admin-create-fullname-error
}
function barberCategoryForm(data) {
  data.services.map((e)=>{ console.log(e)})
  data.hairType.map((e)=>{ console.log(e)})
  console.log("{{barber}}")
  // let serviceList = {{{barber}}};
  // let hairTypeList = {{{stylist}}};
  console.log({serviceList,hairTypeList})
  return;
  let index = parseInt($(this).attr('data-index'));
  let html = ` <div id="service-${index}"> <div class="mb-3 row">
  <label for="create-salon-buisness-service-name-${index}"
      class="col-md-2 col-form-label"><sup>*</sup>Name</label>
  <div class="col-md-4">
      <input class="form-control servicesName" name="serviceName[]" id="create-salon-buisness-service-name-${index}" data-index="${index}"/>
      <span id="create-salon-buisness-service-name-${index}-error"
          class="text-danger d-none">this field is
          required</span>
  </div>
  <label for="create-salon-buisness-service-price-${index}"
      class="col-md-2 col-form-label"><sup>*</sup>Price</label>
  <div class="col-md-4">
      <input class="form-control servicePrice" type="number" min="0" name="servicePrice[]" id="create-salon-buisness-service-price-${index}" data-index="${index}"/>
      <span id="create-salon-buisness-service-price-${index}-error"
          class="text-danger d-none">this field is
          required</span>
  </div>
</div>
<div class="mb-3 row">
  <label for="create-salon-buisness-service-time-${index}"
      class="col-md-2 col-form-label"><sup>*</sup>Time</label>
  <div class="col-md-4">
      <input class="form-control serviceTime" type="time" value="00:00" name="serviceTime[]" id="create-salon-buisness-service-time-${index}" data-index="${index}"/>
      <span id="create-salon-buisness-service-time-${index}-error"
          class="text-danger d-none">this field is
          required</span>
  </div>
  <label for="create-salon-buisness-service-desc-${index}"
      class="col-md-2 col-form-label"><sup>*</sup>Description</label>
  <div class="col-md-4">
      <input class="form-control serviceDescription" name="serviceDescription[]" id="create-salon-buisness-service-desc-${index}" data-index="${index}"/>
      <span id="create-salon-buisness-service-desc-${index}-error"
          class="text-danger d-none">this field is
          required</span>
  </div></div>
  <div class="mb-3 row">
  <label for="create-salon-buisness-service-desc2-${index}"
      class="col-md-2 col-form-label">Description-2</label>
  <div class="col-md-4">
      <input class="form-control serviceLongDescription" name="serviceLongDescription[]" id="create-salon-buisness-service-desc2-${index}" data-index="${index}"/>
  </div>
  <div class="col-md-4"></div>
  <div class="col-md-2 float-right">
  <span class="btn btn-danger removeSerivce" onclick="$('#service-${index}').remove()">Remove</span>
  </div>
  </div>
</div>`
  $('#barberCategory').append(html)
  $(this).attr('data-index', index + 1)
}