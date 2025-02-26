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
    console.log(extractedFeatures)

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
        aboutData:{
            title:  aboutTitle,
            heading: aboutHeading,
            features: extractedFeatures
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