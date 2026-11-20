document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // 1. NEWSLETTER SUBSCRIPTION
    // ======================================

    const subscribeForm = document.querySelector(".subscribe");

    if (subscribeForm) {
        subscribeForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const emailInput = subscribeForm.querySelector(
                'input[name="email"]'
            );

            const email = emailInput.value.trim();

            if (!emailInput.checkValidity() || email === "") {
                alert("Please enter a valid email address.");
                emailInput.focus();
                return;
            }

            const recipient = "hello@examplewebsite142.com";

            const subject = encodeURIComponent(
                "Pixel Club Newsletter Subscription"
            );

            const body = encodeURIComponent(
                "Hello by pxlpuff!\n\n" +
                "I would like to subscribe to the Pixel Club newsletter.\n\n" +
                "My email address: " + email
            );

            window.location.href =
                "mailto:" + recipient +
                "?subject=" + subject +
                "&body=" + body;
        });
    }


    // ======================================
    // 2. PRODUCT ORDER
    // ======================================

    const orderButton = document.querySelector(
        ".btn-row a:nth-child(2)"
    );

    if (orderButton) {

        orderButton.addEventListener("click", function (event) {

            event.preventDefault();

            const productName = document.querySelector(
                ".info h1"
            ).textContent.trim();

            const productPrice = document.querySelector(
                ".info .price"
            ).textContent.trim();

            const size = document.querySelector(
                ".size-select .value"
            ).textContent.trim();

            const quantity = document.querySelector(
                ".qty .n"
            ).textContent.trim();

            const recipient = "orders@examplewebsite142.com";

            const subject = encodeURIComponent(
                "Order Request - " + productName
            );

            const body = encodeURIComponent(
                "Hello by pxlpuff!\n\n" +
                "I would like to place an order for the following item:\n\n" +
                "Product: " + productName + "\n" +
                "Price: " + productPrice + "\n" +
                "Size: " + size + "\n" +
                "Quantity: " + quantity + "\n\n" +
                "Please contact me regarding the next steps for my order.\n\n" +
                "Thank you!"
            );

            window.location.href =
                "mailto:" + recipient +
                "?subject=" + subject +
                "&body=" + body;

        });
    }

    // ======================================
    // 3. CONTACT INQUIRY FORM
    // ======================================

    const contactForm = document.querySelector("#contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name = document.querySelector("#contactName").value.trim();
            const email = document.querySelector("#contactEmail").value.trim();
            const subjectText = document.querySelector("#contactSubject").value.trim();
            const message = document.querySelector("#contactMessage").value.trim();

            if (!name || !email || !subjectText || !message) {
                alert("Please complete all fields.");
                return;
            }

            const recipient = "hello@examplewebsite142.com";

            const subject = encodeURIComponent(subjectText);

            const body = encodeURIComponent(
                "Hello by pxlpuff!\n\n" +
                "Name: " + name + "\n" +
                "Email: " + email + "\n\n" +
                "Message:\n" + message
            );

            window.location.href =
                "mailto:" + recipient +
                "?subject=" + subject +
                "&body=" + body;

        });
    }


    // ======================================
    // 4. PRODUCT SEARCH + RECENT SEARCHES
    // ======================================

    const searchForm = document.querySelector(".search-box");

    if (searchForm) {

        const searchInput = searchForm.querySelector('input[name="q"]');
        const recentContainer = document.querySelector(".chips");
        const clearButton = document.querySelector(".clear-all");

        const products = [
            {
                name: "Do Good Work Tee",
                keywords: ["do good work", "good work", "do good"],
                link: "do-good-work-tee.html"
            },
            {
                name: "Don't Be Late Tee",
                keywords: ["don't be late", "dont be late", "be late"],
                link: "dont-be-late-tee.html"
            },
            {
                name: "Everyday Comfort Tee",
                keywords: ["everyday comfort", "comfort"],
                link: "everyday-comfort-tee.html"
            }
        ];

        // LOAD SAVED SEARCHES

        let recentSearches = JSON.parse(
            localStorage.getItem("recentSearches")
        ) || [];

        // DISPLAY RECENT SEARCHES

        function displayRecentSearches() {

            if (!recentContainer) return;

            recentContainer.innerHTML = "";

            recentSearches.forEach(function(search) {

                const chip = document.createElement("span");
                chip.className = "chip";

                chip.textContent = "× " + search;

                chip.style.cursor = "pointer";

                chip.addEventListener("click", function() {
                    searchInput.value = search;
                    searchForm.requestSubmit();
                });

                recentContainer.appendChild(chip);

            });

        }

        // SAVE A SEARCH

        function saveRecentSearch(search) {

            recentSearches = recentSearches.filter(function(item) {
                return item.toLowerCase() !== search.toLowerCase();
            });

            recentSearches.unshift(search);

            recentSearches = recentSearches.slice(0, 5);

            localStorage.setItem(
                "recentSearches",
                JSON.stringify(recentSearches)
            );

            displayRecentSearches();

        }

        // SEARCH PRODUCTS

        searchForm.addEventListener("submit", function(event) {

            event.preventDefault();

            const searchTerm = searchInput.value.trim().toLowerCase();

            if (searchTerm === "") {
                alert("Please enter a product name.");
                searchInput.focus();
                return;
            }

            const matchedProduct = products.find(function(product) {

                return product.name.toLowerCase().includes(searchTerm) ||
                    product.keywords.some(function(keyword) {
                        return keyword.includes(searchTerm) ||
                            searchTerm.includes(keyword);
                    });

            });

            if (matchedProduct) {

                saveRecentSearch(matchedProduct.name);

                window.location.href = matchedProduct.link;

            } else {

                alert("Sorry! No products found. Please try another search.");

            }

        });

        // CLEAR ALL RECENT SEARCHES

        if (clearButton) {

            clearButton.addEventListener("click", function(event) {

                event.preventDefault();

                recentSearches = [];

                localStorage.removeItem("recentSearches");

                displayRecentSearches();

            });

        }

        // SHOW SAVED SEARCHES WHEN PAGE LOADS

        displayRecentSearches();

    }

});