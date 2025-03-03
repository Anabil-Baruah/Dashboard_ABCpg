function extractFeatures() {
    let featuresContainer = document.getElementById("featuresContainer");

    // Check if featuresContainer has inner content (i.e., at least one feature card)
    if (!featuresContainer || featuresContainer.innerHTML.trim() === "") {
        console.log("No features added.");
        return [];
    }

    let featuresArray = [];

    // Select all dynamically added feature cards
    document.querySelectorAll(".feature-card").forEach(featureCard => {
        let iconUrl = featureCard.querySelector("#featureIcon").value.trim();
        let bgColor = featureCard.querySelector("#featureBgColor").value;
        let title = featureCard.querySelector("#featureTitle").value.trim();
        let description = featureCard.querySelector("#featureDescription").value.trim();

        featuresArray.push({
            icon: {
                url: iconUrl || "", // Fallback to empty string if no input
                backgroundColor: bgColor || "#FFFFFF" // Default color if empty
            },
            title: title || "Untitled Feature",
            description: description || "No description provided"
        });
    });

    console.log(featuresArray); // Output the array
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
    document.querySelectorAll("#cardsContainer .card").forEach(card => {
        let iconUrl = card.querySelector("#cardIcon").value.trim();
        let bgColor = card.querySelector("#cardBgColor").value;
        let title = card.querySelector("#cardTitle").value.trim();

        serviceCardsArray.push({
            icon: {
                url: iconUrl || "", // Fallback to empty string if no input
                backgroundColor: bgColor || "#FFFFFF" // Default color if empty
            },
            title: title || "Untitled Service"
        });
    });

    console.log(serviceCardsArray); // Output the array
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
    document.querySelectorAll("#priceListContainer .card").forEach(plan => {
        let planTitle = plan.querySelector("#pricePlanTitle").value.trim();
        let priceValue = plan.querySelector("#priceValue").value.trim();
        let priceCurrency = plan.querySelector("#priceCurrency").value;
        let priceDuration = plan.querySelector("#priceDuration").value;
        let iconUrl = plan.querySelector("#priceIconUrl").value.trim();
        let bgColor = plan.querySelector("#priceBgColor").value;

        // Extracting Features for this pricing plan
        let featuresArray = [];
        let featuresContainer = plan.querySelector(`#featuresContainer${planTitle}`);
        if (featuresContainer) {
            featuresContainer.querySelectorAll(".feature-card").forEach(feature => {
                let featureTitle = feature.querySelector("#featureTitle").value.trim();
                let featureDescription = feature.querySelector("#featureDescription").value.trim();
                let featureIcon = feature.querySelector("#featureIcon").value.trim();
                let featureBgColor = feature.querySelector("#featureBgColor").value;

                featuresArray.push({
                    icon: {
                        url: featureIcon || "",
                        backgroundColor: featureBgColor || "#FFFFFF"
                    },
                    title: featureTitle || "Untitled Feature",
                    description: featureDescription || ""
                });
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
                url: iconUrl || "",
                backgroundColor: bgColor || "#FFFFFF"
            },
            features: featuresArray
        });
    });

    console.log(pricingPlansArray); // Output the array
    return pricingPlansArray;
}



document.getElementById("pgForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    // Get form values
    const name = document.getElementById("name").value;
    const brandName = document.getElementById("brandName").value;
    const contactNumber = document.getElementById("contactNumber").value;
    const contactLink = document.getElementById("contactLink").value;
    const heading = document.getElementById("heading").value;
    const subheading = document.getElementById("subheading").value;
    const buttonText = document.getElementById("buttonText").value;
    const buttonLink = document.getElementById("buttonLink").value;
    const buttonColor = document.getElementById("buttonColor").value;
    const aboutToggle = document.getElementById("aboutToggle").checked;
    const servicesToggle = document.getElementById("servicesToggle").checked;
    const pricingToggle = document.getElementById("pricingToggle").checked;

    //about values
    const aboutTitle = document.getElementById("aboutTitle").value;
    const aboutHeading = document.getElementById("aboutHeading").value;
    let extractedFeatures = extractFeatures();

    //service values
    const serviceTitle = document.getElementById("serviceTitle").value;
    const serviceHeading = document.getElementById("serviceHeading").value;
    const serviceDescription = document.getElementById("serviceDescription").value;
    const serviceBackground = document.getElementById("serviceBackground").value;
    const serviceFeatures = document.getElementById("serviceFeatures").value.split(",").map(feature => feature.trim());
    const serviceVideo = ""
    const serviceVideoThumbnail = ""
    let serviceCards = extractServiceCards();

    //priceValues
    const priceTitle = document.getElementById("priceTitle").value;
    const priceHeading = document.getElementById("priceHeading").value;
    const priceSubheading = document.getElementById("priceSubheading").value;
    const pricingPlansArray = extractPricingPlans();


    // Structure the data as required
    const formData = {
        name: name,
        homeData: {
            navbar: {
                brandName: brandName,
                contact: {
                    number: contactNumber,
                    status: true,
                    link: contactLink
                },
                about: { status: aboutToggle },
                services: { status: servicesToggle },
                team: { status: true },
                pricing: { status: pricingToggle },
                blog: { status: true }
            },
            content: {
                heading: heading,
                subheading: subheading,
                buttonColor: buttonColor,
                buttonText: buttonText,
                buttonLink: buttonLink
            }
        },
        aboutData: {
            title: aboutTitle,
            heading: aboutHeading,
            features: extractedFeatures
        },
        servicesData: {
            title: serviceTitle,
            heading: serviceHeading,
            backgroundImage: serviceBackground,
            description: serviceDescription,
            features: serviceFeatures,
            card: serviceCards,
            video: {
                url: serviceVideo,
                thumbnail: serviceVideoThumbnail
            }
        },
        pricingData: {
            title: priceTitle,
            heading: priceHeading,
            subheading: priceSubheading,
            pricingPlansArray: pricingPlansArray
        }
    };

    console.log("Data to be sent:", formData);

    // Send data to backend (Replace 'your-api-endpoint' with actual URL)
    fetch("http://localhost:4000/websites", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
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