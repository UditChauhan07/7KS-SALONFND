$('#addSerivce').on('click', function () {
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
    $('#businessService').append(html)
    $(this).attr('data-index', index + 1)
  })