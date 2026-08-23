// Clock

function updateClocks() {
    const clocks = document.querySelectorAll(".world-time");

    clocks.forEach(clock => {
        const timezone = clock.dataset.timezone;

        const time = new Intl.DateTimeFormat("en-GB", {
            timeZone: timezone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }).format(new Date());

        clock.textContent = time;
    });
}

// Update immediately
updateClocks();

// Update every second
setInterval(updateClocks, 1000);



// destinatie generator

const destinations = [
    {
        name: "Tokyo, Japan",
        description: "Explore neon streets, incredible food, ancient temples and a completely different culture.",
        emoji: "🇯🇵"
    },
    {
        name: "Barcelona, Spain",
        description: "Enjoy beautiful architecture, sunny beaches, amazing food and lively streets.",
        emoji: "🇪🇸"
    },
    {
        name: "Cape Town, South Africa",
        description: "Discover mountains, beaches, wildlife and some of the most spectacular views in the world.",
        emoji: "🇿🇦"
    },
    {
        name: "New York, USA",
        description: "Experience the city that never sleeps, from Times Square to Central Park and beyond.",
        emoji: "🇺🇸"
    },
    {
        name: "Bali, Indonesia",
        description: "Relax on tropical beaches, explore rice terraces and discover beautiful temples.",
        emoji: "🇮🇩"
    },
    {
        name: "Reykjavik, Iceland",
        description: "See dramatic landscapes, waterfalls, hot springs and maybe even the Northern Lights.",
        emoji: "🇮🇸"
    },
    {
        name: "Paris, France",
        description: "Wander through beautiful streets, visit famous landmarks and enjoy incredible French food.",
        emoji: "🇫🇷"
    },
    {
        name: "Rio de Janeiro, Brazil",
        description: "Enjoy beaches, mountains, music and one of the most energetic cities in the world.",
        emoji: "🇧🇷"
    },
    {
        name: "Sydney, Australia",
        description: "Combine city life with beautiful beaches, surfing and incredible coastal views.",
        emoji: "🇦🇺"
    },
    {
        name: "Santorini, Greece",
        description: "Relax beside the Aegean Sea and enjoy white buildings, sunsets and amazing Greek food.",
        emoji: "🇬🇷"
    }
];

const generateButton = document.getElementById("generateButton");
const destinationName = document.getElementById("destinationName");
const destinationDescription = document.getElementById("destinationDescription");
const destinationImage = document.querySelector(".destination-image");

let lastDestination = -1;

generateButton.addEventListener("click", function () {

    // Prevent the same destination
    let randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * destinations.length);
    } while (randomIndex === lastDestination);

    lastDestination = randomIndex;

    const destination = destinations[randomIndex];

    // Change content
    destinationName.textContent = destination.name;
    destinationDescription.textContent = destination.description;
    destinationImage.querySelector("span").textContent = destination.emoji;

});