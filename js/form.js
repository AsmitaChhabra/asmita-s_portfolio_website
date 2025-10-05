const form = () => {
    const contactForm = document.querySelector(".contactForm"),
        responseMessage = document.querySelector(".response");

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        responseMessage.classList.add("open");
        responseMessage.textContent = "Please wait...";

        // --- UPDATED URL ---
        const AZURE_ENDPOINT = "https://asmitachhabra-beh2fffjhud0dwbc.southeastasia-01.azurewebsites.net/mail.php";

        async function getData() {
            try {
                // The fetch request now goes directly to your PHP script on Azure
                const response = await fetch(AZURE_ENDPOINT, {
                    method: "POST",
                    body: formData,
                });
                
                // Note: The original code had a slight logic error in the 'if (!response.ok)' block.
                // It should read the result *before* checking the response text.
                // We'll trust the PHP script handles the HTTP status codes (200 for success, 500 for error).
                
                const result = await response.text();
                responseMessage.textContent = result;
            } catch (error) {
                console.error(error.message);
                responseMessage.textContent = "A network error occurred. Please try again.";
            }
        }

        getData()
            .then(
                setTimeout(() => {
                    responseMessage.classList.remove("open");
                }, 3000)
            )
            .finally(form.reset());
    });
};
export default form;