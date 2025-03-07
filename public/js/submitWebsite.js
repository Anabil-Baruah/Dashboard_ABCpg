function extractFeatures() {
    let featuresContainer = document.getElementById("featuresContainer");

    // Ensure at least one feature exists
    if (!featuresContainer || featuresContainer.children.length === 0) {
        // console.log("No features added.");
        return [];
    }

    let featuresArray = [];

    // Select all dynamically added feature cards
    document.querySelectorAll(".feature-card").forEach((featureCard, index) => {
        // let iconInput = featureCard.querySelector("#featureIcon");
        let title = featureCard.querySelector("#featureTitle").value.trim();
        let description = featureCard.querySelector("#featureDescription").value.trim();

        let featureData = {
            title: title || `Feature ${index + 1}`,
            description: description || "No description provided"
        };

        featuresArray.push(featureData);
    });

    return featuresArray;
}


function extractServiceCards() {
    let cardsContainer = document.getElementById("cardsContainer");

    // Check if cardsContainer has inner content (i.e., at least one service card)
    if (!cardsContainer || cardsContainer.innerHTML.trim() === "") {
        console.log("No service cards added.");
        return [];
    }

    let serviceCardsArray = [];

    // Select all dynamically added service cards
    document.querySelectorAll("#cardsContainer .card").forEach((card, index) => {
        // let iconUrl = card.querySelector("#cardIcon").files[0]; // File input
        let title = card.querySelector("#cardTitle").value.trim() || `Service ${index + 1}`;

        serviceCardsArray.push({
            title: title
        });
    });

    return serviceCardsArray;
}

function extractPricingPlans() {
    let priceListContainer = document.getElementById("priceListContainer");

    // Check if priceListContainer has inner content (i.e., at least one pricing plan)
    if (!priceListContainer || priceListContainer.innerHTML.trim() === "") {
        console.log("No pricing plans added.");
        return [];
    }

    let pricingPlansArray = [];

    // Select all dynamically added pricing plans
    document.querySelectorAll("#priceListContainer .card").forEach((plan, index) => {
        let planTitle = plan.querySelector("#pricePlanTitle").value.trim();
        let priceValue = plan.querySelector("#priceValue").value.trim();
        let priceCurrency = plan.querySelector("#priceCurrency").value;
        let priceDuration = plan.querySelector("#priceDuration").value;
        // let iconUrl = plan.querySelector("#priceIconUrl").files[0];
        // let bgColor = plan.querySelector("#priceBgColor").value;

        // Extracting Features for this pricing plan
        let featuresArray = [];
        let featuresContainer = plan.querySelector(`#featuresContainer${index + 1}`);
        if (featuresContainer) {
            featuresContainer.querySelectorAll(".input-group").forEach(feature => {
                let featureTitle = feature.querySelector("#priceFeature")?.value.trim() || "Untitled Feature";
                featuresArray.push(featureTitle);
            });
        }

        pricingPlansArray.push({
            title: planTitle || "Untitled Plan",
            price: {
                value: priceValue || "0",
                currency: priceCurrency,
                duration: priceDuration
            },
            icon: {
                url: "",
                backgroundColor: "#FFFFFF"
            },
            features: featuresArray
        });
    });

    return pricingPlansArray;
}



document.getElementById("pgForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(); // Create FormData object

    // Append form fields
    formData.append("name", document.getElementById("name").value);
    formData.append("websiteThemeColor", document.getElementById("websiteThemeColor").value);
    formData.append("brandName", document.getElementById("brandName").value);
    formData.append("contactNumber", document.getElementById("contactNumber").value);
    formData.append("contactLink", document.getElementById("contactLink").value);
    formData.append("heading", document.getElementById("heading").value);
    formData.append("subheading", document.getElementById("subheading").value);
    formData.append("buttonText", document.getElementById("buttonText").value);
    formData.append("buttonLink", document.getElementById("buttonLink").value);
    formData.append("aboutToggle", document.getElementById("aboutToggle").checked);
    formData.append("servicesToggle", document.getElementById("servicesToggle").checked);
    formData.append("pricingToggle", document.getElementById("pricingToggle").checked);

    // Append the home background image file using name="homeBgImage"
    const homeBgImage = document.getElementById("homeBgImage")?.files[0];
    if (homeBgImage) {
        formData.append("homeBgImage", homeBgImage);
    }

    // Append About Section
    formData.append("aboutTitle", document.getElementById("aboutTitle").value);
    formData.append("aboutHeading", document.getElementById("aboutHeading").value);
    formData.append("featureArray", JSON.stringify(extractFeatures()));

    // Extract and append features (including image files)
    // let features = extractFeatures(formData);
    // console.log("Extracted Features:", features);
    // features.forEach((feature, index) => {
    //     formData.append(`featureTitles[${index}]`, feature.title); // Append title
    //     formData.append(`featureDescs[${index}]`, feature.description); // Append description
    // });
    // formData.append("extractedFeatures", JSON.stringify(features)); // Convert array to JSON

    // Append Service Section
    formData.append("serviceTitle", document.getElementById("serviceTitle").value);
    formData.append("serviceHeading", document.getElementById("serviceHeading").value);
    formData.append("serviceDescription", document.getElementById("serviceDescription").value);
    formData.append("serviceBackground", document.getElementById("serviceBackground").files[0]);
    formData.append("serviceFeatures", JSON.stringify(
        document.getElementById("serviceFeatures").value.split(",").map(feature => feature.trim())
    )); // Convert array to JSON
    const serviceVideoThumbnail = document.getElementById("serviceVideoThumbnail").files[0];
    const serviceVideo = document.getElementById("serviceVideo").files[0];

    if (serviceVideoThumbnail && serviceVideo) {
        formData.append("serviceVideoThumbnail", serviceVideoThumbnail);
        formData.append("serviceVideo", serviceVideo);
    }
    // formData.append("serviceCards", JSON.stringify(extractServiceCards())); // Convert array to JSON
    // Extract service cards data
    const serviceCards = extractServiceCards();
    serviceCards.forEach((card, i) => {
        formData.append(`serviceTitles[${i}]`, card.title);
    });


    // Append Pricing Section
    formData.append("priceTitle", document.getElementById("priceTitle").value);
    formData.append("priceHeading", document.getElementById("priceHeading").value);
    formData.append("priceSubheading", document.getElementById("priceSubheading").value);
    formData.append("pricingPlansArray", JSON.stringify(extractPricingPlans())); // Convert array to JSON

    const pricePlans = extractPricingPlans();

    pricePlans.forEach((plan, i) => {
        formData.append("pricePlanTitles", plan.title);
        formData.append("priceValues", plan.price.value);
        formData.append("priceCurrencies", plan.price.currency);
        formData.append("priceDurations", plan.price.duration);

        plan.features.forEach((feature, j) => {
            formData.append(`priceFeatures[${i}][${j}]`, feature);
        });
    });

    //Append footer section
    formData.append("footerHeading", document.getElementById("footerHeading").value);
    formData.append("footerSubheading", document.getElementById("footerSubheading").value);
    formData.append("address", document.getElementById("address").value);
    formData.append("footerPhoneNumber", document.getElementById("footerPhoneNumber").value);
    formData.append("footerEmail", document.getElementById("footerEmail").value);
    formData.append("linkInstagram", document.getElementById("linkInstagram").value);
    formData.append("linkFacebook", document.getElementById("linkFacebook").value);
    formData.append("linkX", document.getElementById("linkX").value);

    // console.log("FormData Entries:");
    // for (let [key, value] of formData.entries()) {
    //     console.log(`${key}:`, value);
    // }

    // Send data to backend
    fetch("http://localhost:4000/websites", {
        method: "POST",
        body: formData // Send FormData object directly
    })
        .then(response => response.json())
        .then(data => {
            console.log("Success:", data);
            alert("Data submitted successfully!");
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error submitting data.");
        });
});

