document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.section-toggle').forEach(toggle => {
        toggle.addEventListener('change', function () {
            let contentField = this.closest('.form-check').nextElementSibling.querySelector('.section-input');
            if (this.checked) {
                contentField.removeAttribute('readonly');
            } else {
                contentField.setAttribute('readonly', true);
            }
        });
    });

    // Set initial state based on toggle positions
    document.querySelectorAll('.section-toggle').forEach(toggle => {
        let contentField = toggle.closest('.form-check').nextElementSibling.querySelector('.section-input');
        if (!toggle.checked) {
            contentField.setAttribute('readonly', true);
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    let featureCount = 0;
    let cardCount = 0;
    let priceCount = 0;

    document.getElementById("addFeatureBtn").addEventListener("click", function () {
        featureCount++;
        let featureHTML = `
        <div class="card p-3 mb-3 feature-card" id="feature-${featureCount}">
            <h6>Feature ${featureCount}</h6>
            <div class="mb-2">
                <label class="form-label">Icon URL</label>
                <input type="text" id = "featureIcon" class="form-control" placeholder="Enter icon URL">
            </div>
            <div class="mb-2">
                <label class="form-label">Icon Background Color</label>
                <input type="color" id="featureBgColor" class="form-control form-control-color">
            </div>
            <div class="mb-2">
                <label class="form-label">Feature Title</label>
                <input type="text" id="featureTitle" class="form-control" placeholder="Enter feature title">
            </div>
            <div class="mb-2">
                <label class="form-label">Feature Description</label>
                <textarea class="form-control" id="featureDescription" rows="2" placeholder="Enter feature description"></textarea>
            </div>
            <button type="button" class="btn btn-danger btn-sm remove-feature" data-id="feature-${featureCount}">Remove Feature</button>
        </div>
    `;
        document.getElementById("featuresContainer").insertAdjacentHTML("beforeend", featureHTML);
    });

    // Remove Feature Card
    document.getElementById("featuresContainer").addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-feature")) {
            let featureId = event.target.getAttribute("data-id");
            document.getElementById(featureId).remove();
        }
    });

    // Toggle About Section
    document.getElementById("aboutToggle").addEventListener("change", function () {
        let aboutFields = document.querySelectorAll("#aboutSection input, #aboutSection textarea, #addFeatureBtn");
        aboutFields.forEach(field => field.disabled = !this.checked);
    });

    // Set initial state
    if (!document.getElementById("aboutToggle").checked) {
        document.querySelectorAll("#aboutSection input, #aboutSection textarea, #addFeatureBtn").forEach(field => field.disabled = true);
    }

    // Add Service Card
    document.getElementById("addCardBtn").addEventListener("click", function () {
        cardCount++;
        let cardHTML = `
        <div class="card mt-3 border-primary">
            <div class="card-body">
                <h6>Service Card ${cardCount}</h6>
                <div class="mb-2">
                    <label class="form-label">Icon URL</label>
                    <input type="text" id="cardIcon" class="form-control" placeholder="Enter icon URL">
                </div>
                <div class="mb-2">
                    <label class="form-label">Icon Background Color</label>
                    <input type="color" id="cardBgColor" class="form-control form-control-color">
                </div>
                <div class="mb-2">
                    <label class="form-label">Title</label>
                    <input type="text" id="cardTitle" class="form-control" placeholder="Enter card title">
                </div>
                <button type="button" class="btn btn-danger btn-sm remove-card">Remove Card</button>
            </div>
        </div>
    `;
        document.getElementById("cardsContainer").insertAdjacentHTML("beforeend", cardHTML);
    });

    // Remove Service Card
    document.getElementById("cardsContainer").addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-card")) {
            event.target.closest(".card").remove();
        }
    });

    // Toggle Service Section
    document.getElementById("servicesToggle").addEventListener("change", function () {
        let serviceFields = document.querySelectorAll("#serviceSection input, #serviceSection textarea, #addFeatureBtn, #addCardBtn");
        serviceFields.forEach(field => field.disabled = !this.checked);
    });

    // Add Pricing Plan
    document.getElementById("addPriceBtn").addEventListener("click", function () {
        priceCount++;
        let priceHTML = `
        <div class="card mt-3 border-primary">
            <div class="card-body">
                <h6>Pricing Plan ${priceCount}</h6>

                <div class="mb-2">
                    <label class="form-label">Plan Title</label>
                    <input type="text" id="pricePlanTitle" class="form-control" placeholder="Enter plan title">
                </div>

                <div class="row">
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Price</label>
                        <input type="number" id="priceValue" class="form-control" placeholder="Enter price">
                    </div>
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Currency</label>
                        <select class="form-select" id="priceCurrency">
                            <option value="₹" selected>₹ (INR)</option>
                            <option value="$">$ (USD)</option>
                            <option value="€">€ (EUR)</option>
                            <option value="£">£ (GBP)</option>
                            <option value="¥">¥ (JPY)</option>
                        </select>
                    </div>
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Duration</label>
                        <select class="form-select" id="priceDuration">
                            <option value="mo" selected>Month</option>
                            <option value="yr">Year</option>
                            <option value="wk">Week</option>
                            <option value="day">Day</option>
                        </select>
                    </div>
                </div>

                <!-- Icon -->
                <div class="mb-2">
                    <label class="form-label">Icon URL</label>
                    <input type="text" id="priceIconUrl" class="form-control" placeholder="Enter icon URL">
                </div>
                <div class="mb-2">
                    <label class="form-label">Icon Background Color</label>
                    <input type="color" id="priceBgColor" class="form-control form-control-color">
                </div>

                <!-- Features List -->
                <h6>Features</h6>
                <div id="featuresContainer${priceCount}"></div>
                <button type="button" class="btn btn-info btn-sm mt-2 addFeatureBtn" data-id="${priceCount}">Add Feature</button>

                <button type="button" class="btn btn-danger btn-sm remove-price">Remove Plan</button>
            </div>
        </div>
    `;
        document.getElementById("priceListContainer").insertAdjacentHTML("beforeend", priceHTML);
    });

    // Remove Pricing Plan
    document.getElementById("priceListContainer").addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-price")) {
            event.target.closest(".card").remove();
        }
    });

    // Add Features Inside a Pricing Plan
    document.getElementById("priceListContainer").addEventListener("click", function (event) {
        if (event.target.classList.contains("addFeatureBtn")) {
            let id = event.target.getAttribute("data-id");
            let featureHTML = `
            <div class="input-group mt-2">
                <input type="text" class="form-control" placeholder="Enter feature">
                <button type="button" class="btn btn-danger remove-feature">Remove</button>
            </div>
        `;
            document.getElementById(`featuresContainer${id}`).insertAdjacentHTML("beforeend", featureHTML);
        }
    });

    // Remove Features
    document.getElementById("priceListContainer").addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-feature")) {
            event.target.closest(".input-group").remove();
        }
    });

    // Toggle Pricing Section
    document.getElementById("pricingToggle").addEventListener("change", function () {
        let pricingFields = document.querySelectorAll("#pricingSection input, #pricingSection select, #addPriceBtn");
        pricingFields.forEach(field => field.disabled = !this.checked);
    });
});