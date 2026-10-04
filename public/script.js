const input = document.getElementById("githubUsername");
const generateBtn = document.getElementById("generateBtn");

generateBtn.addEventListener("click", generatePortfolio);

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        generatePortfolio();
    }
});

async function generatePortfolio() {

    const username = input.value.trim();

    if (!username) {
        alert("Please enter a GitHub username");
        input.focus();
        return;
    }

    generateBtn.textContent = "Generating...";
    generateBtn.disabled = true;

    try {

        // Get GitHub profile
        const userResponse = await fetch(
            `https://api.github.com/users/${encodeURIComponent(username)}`
        );

        if (!userResponse.ok) {
            throw new Error("GitHub user not found");
        }

        const user = await userResponse.json();


        // Get repositories
        const repoResponse = await fetch(
            `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`
        );

        if (!repoResponse.ok) {
            throw new Error("Could not load GitHub repositories");
        }

        const repos = await repoResponse.json();


        // Save GitHub data
        localStorage.setItem(
            "githubUser",
            JSON.stringify(user)
        );

        localStorage.setItem(
            "githubRepos",
            JSON.stringify(repos)
        );


        // Go to personalization page
        window.location.href = "/personalize.html";

    } catch (error) {

        console.error(error);

        alert(
            error.message ||
            "Something went wrong. Please try again."
        );

        generateBtn.textContent = "Generate →";
        generateBtn.disabled = false;
    }
}/* =========================================
   SHARE PORTFOLIO
========================================= */

/* =========================================
   SHARE PORTFOLIO
========================================= */

const shareButton =
    document.getElementById("sharePortfolio");

shareButton.addEventListener("click", async function (event) {

    event.preventDefault();

    const portfolioURL = window.location.href;

    try {

        /* Use native sharing when available */
        if (
            navigator.share &&
            window.isSecureContext
        ) {

            await navigator.share({
                title: "My BentoFolio Portfolio",
                text: "Check out my developer portfolio!",
                url: portfolioURL
            });

            return;
        }

        /* Fallback: copy the portfolio link */
        if (navigator.clipboard) {

            await navigator.clipboard.writeText(
                portfolioURL
            );

            showShareMessage(
                "✓ Portfolio link copied!"
            );

        } else {

            /* Older browser fallback */
            const textArea =
                document.createElement("textarea");

            textArea.value =
                portfolioURL;

            document.body.appendChild(textArea);

            textArea.select();

            document.execCommand("copy");

            textArea.remove();

            showShareMessage(
                "✓ Portfolio link copied!"
            );
        }

    } catch (error) {

        console.error(
            "Share error:",
            error
        );

        showShareMessage(
            "Could not share the link."
        );

    }

});


function showShareMessage(message) {

    const originalText =
        shareButton.textContent;

    shareButton.textContent =
        message;

    setTimeout(function () {

        shareButton.textContent =
            "Share ↗";

    }, 2000);

}