document.addEventListener("DOMContentLoaded", () => {
	const fadeElements = document.querySelectorAll(".fade-in");
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("visible");
					observer.unobserve(entry.target);
				}
			});
		},
		{
			threshold: 0.1,
			rootMargin: "0px 0px -100px 0px",
		}
	);

	fadeElements.forEach((element) => {
		observer.observe(element);
	});

	// Toggle theme functionality
	const themeToggle = document.getElementById("toggle-theme");
	const htmlElement = document.documentElement;

	themeToggle.addEventListener("click", () => {
		htmlElement.classList.toggle("light-theme");

		// Save theme preference to localStorage
		const isDarkTheme = !htmlElement.classList.contains("light-theme");
		localStorage.setItem("darkTheme", isDarkTheme);
	});

	// Load saved theme preference
	const savedDarkTheme = localStorage.getItem("darkTheme");
	if (savedDarkTheme === "false") {
		htmlElement.classList.add("light-theme");
	}

	// Scroll-to-section navigation
	const navButton = document.getElementById("nav-button");
	const scrollLinks = document.querySelectorAll('a[href^="#"]');

	scrollLinks.forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			const targetId = link.getAttribute("href");
			const targetElement = document.querySelector(targetId);

			if (targetElement) {
				// Calculate offset accounting for fixed header
				const headerHeight = document.querySelector(".nav")?.offsetHeight || 80;
				const scrollToPosition = targetElement.offsetTop - headerHeight;

				window.scrollTo({
					top: scrollToPosition,
					behavior: "smooth",
				});

				// Close mobile menu if open
				const navLinks = document.querySelector(".nav-links");
				if (navLinks.classList.contains("open")) {
					navLinks.classList.remove("open");
				}
			}
		});
	});

	// Improved scroll button functionality
	navButton.addEventListener("click", () => {
		const scrollPosition = window.scrollY;
		const scrollHeight = document.body.scrollHeight;
		const windowHeight = window.innerHeight;

		// Check if we're near the bottom of the page
		if (scrollPosition + windowHeight >= scrollHeight - 200) {
			// Scroll to top if near the bottom
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
			// Reset target to first section
			navButton.setAttribute("data-target", "#section2");
			return;
		}

		// Get the current target section
		const targetId = navButton.getAttribute("data-target");
		const targetElement = document.querySelector(targetId);

		if (targetElement) {
			// Calculate the scroll position accounting for fixed header
			const headerHeight = document.querySelector(".nav")?.offsetHeight || 80;
			const scrollToPosition = targetElement.offsetTop - headerHeight;

			window.scrollTo({
				top: scrollToPosition,
				behavior: "smooth",
			});

			// Update the button's target to the next section
			const currentSectionNum = parseInt(targetId.replace("#section", ""));
			const nextSectionNum = currentSectionNum + 1;
			const nextSectionId = `#section${nextSectionNum}`;
			const nextSection = document.querySelector(nextSectionId);

			// If next section exists, update the target
			if (nextSection) {
				navButton.setAttribute("data-target", nextSectionId);
			} else {
				// If no next section, set to go back to top
				navButton.setAttribute("data-target", "#section1");
			}
		}
	});

	// Toggle rotation of scroll button based on scroll position
	window.addEventListener("scroll", () => {
		const scrollPosition = window.scrollY;
		const scrollHeight = document.body.scrollHeight;
		const windowHeight = window.innerHeight;

		if (scrollPosition + windowHeight >= scrollHeight - 200) {
			navButton.classList.add("rotate");
		} else {
			navButton.classList.remove("rotate");
		}

		const navbar = document.querySelector(".nav");
		if (scrollPosition > 50) {
			navbar.classList.add("scrolled");
		} else {
			navbar.classList.remove("scrolled");
		}
	});

	// Portfolio details toggle
	window.toggleDetails = function (detailsId) {
		const details = document.getElementById(detailsId);
		const overlay = document.getElementById("overlay");

		details.classList.add("active");
		overlay.classList.add("active");

		if (!details.querySelector(".close-details")) {
			const closeButton = document.createElement("button");
			closeButton.className = "close-details";
			closeButton.innerHTML = "×";
			closeButton.onclick = window.closeDetails;
			details.appendChild(closeButton);
		}

		// Prevent body scrolling when modal is open
		document.body.style.overflow = "hidden";
	};

	window.closeDetails = function () {
		const activeDetails = document.querySelector(".portfolio-details.active");
		const overlay = document.getElementById("overlay");

		if (activeDetails) {
			activeDetails.classList.remove("active");
		}

		if (overlay) {
			overlay.classList.remove("active");
		}

		document.body.style.overflow = "";
	};

	// Close details when clicking outside
	const overlay = document.getElementById("overlay");
	if (overlay) {
		overlay.addEventListener("click", window.closeDetails);
	}

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			window.closeDetails();
		}
	});

	// Add mobile navigation toggle
	const navToggle = document.createElement("button");
	navToggle.className = "nav-toggle";
	navToggle.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;

	const navContainer = document.querySelector(".nav");
	const navLinks = document.querySelector(".nav-links");

	navContainer.insertBefore(navToggle, navLinks);

	navToggle.addEventListener("click", () => {
		navLinks.classList.toggle("open");
	});

	// Update portfolio layout structure
	const portfolioItems = document.querySelectorAll(".portfolio");
	const portfolioSection = document.querySelector("#section3 .container");

	if (portfolioSection && portfolioItems.length > 0) {
		const portfolioGrid = document.createElement("div");
		portfolioGrid.className = "portfolio";

		portfolioItems.forEach((item) => {
			// Create new card structure
			const card = document.createElement("div");
			card.className = "portfolio-item fade-in";

			// Get existing elements
			const img = item.querySelector(".portfolio-screenshot");
			const title = item.querySelector(".title");
			const description = item.querySelector(".text");
			const visitBtn = item.querySelector(".btn--line");
			const expandBtn = item.querySelector(".btn--expand");

			// Create content container
			const content = document.createElement("div");
			content.className = "portfolio-content";

			// Create actions container
			const actions = document.createElement("div");
			actions.className = "portfolio-actions";

			// Append buttons to actions
			if (visitBtn) actions.appendChild(visitBtn.cloneNode(true));
			if (expandBtn) actions.appendChild(expandBtn.cloneNode(true));

			// Build the new structure
			if (title) content.appendChild(title.cloneNode(true));
			if (description) content.appendChild(description.cloneNode(true));
			content.appendChild(actions);

			if (img) card.appendChild(img.cloneNode(true));
			card.appendChild(content);

			portfolioGrid.appendChild(card);
		});

		// Replace old content with new grid
		while (portfolioSection.firstChild) {
			if (portfolioSection.firstChild.id === "heading-portfolio") {
				portfolioSection.removeChild(portfolioSection.firstChild.nextSibling);
				break;
			}
			portfolioSection.removeChild(portfolioSection.firstChild);
		}

		portfolioSection.appendChild(portfolioGrid);
	}

	// Update testimonials layout
	const testimonials = document.querySelectorAll(
		"#section5 .layout-grid-half figure"
	);
	const testimonialsSection = document.querySelector("#section5 .container");

	if (testimonialsSection && testimonials.length > 0) {
		const testimonialsGrid = document.createElement("div");
		testimonialsGrid.className = "testimonials-grid";

		testimonials.forEach((item) => {
			const card = document.createElement("div");
			card.className = "testimonial-card fade-in";

			card.appendChild(item.cloneNode(true));
			testimonialsGrid.appendChild(card);
		});

		const oldGrid = document.querySelector("#section5 .layout-grid-half");
		if (oldGrid) {
			oldGrid.parentNode.replaceChild(testimonialsGrid, oldGrid);
		}
	}

	const skillTags = document.querySelectorAll(".tag");
	skillTags.forEach((tag) => {
		const tooltip = tag.querySelector(".tag-text");
		if (tooltip) {
			const label = document.createElement("span");
			label.className = "tag-label";
			label.textContent = tooltip.textContent;
			tag.appendChild(label);
		}
	});
});
