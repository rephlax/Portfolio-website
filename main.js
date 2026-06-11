import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1/+esm";

document.addEventListener("DOMContentLoaded", () => {
	// Smooth scroll. Lenis wraps the native scroll, so anchor links, the
	// `.scrolled` nav toggle and accessibility all keep working. Skipped
	// entirely when the user asks for reduced motion.
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	let lenis = null;
	if (!prefersReducedMotion) {
		lenis = new Lenis({ autoRaf: true, duration: 1.1 });
	}

	// One scroll path for both the anchor links and the floating button.
	function scrollToTarget(target, offset = 0) {
		if (lenis) {
			lenis.scrollTo(target, { offset });
		} else if (typeof target === "number") {
			window.scrollTo({ top: target, behavior: "smooth" });
		} else {
			window.scrollTo({ top: target.offsetTop + offset, behavior: "smooth" });
		}
	}

	const fadeElements = document.querySelectorAll(".fade-in");
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// Stagger each item against its neighbours in the same section
					// so a block cascades in rather than snapping all at once.
					const section = entry.target.closest(".layout-section");
					const groupItems = section
						? Array.from(section.querySelectorAll(".fade-in"))
						: [];
					const indexInGroup = groupItems.indexOf(entry.target);
					const delay = Math.min(indexInGroup, 6) * 80;
					entry.target.style.transitionDelay = `${delay}ms`;

					entry.target.classList.add("visible");
					observer.unobserve(entry.target);
				}
			});
		},
		{
			threshold: 0.1,
			rootMargin: "0px 0px -100px 0px",
		},
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
				const headerHeight = document.querySelector(".nav")?.offsetHeight || 80;
				scrollToTarget(targetElement, -headerHeight);

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
			scrollToTarget(0);
			// Reset target to first section
			navButton.setAttribute("data-target", "#section2");
			return;
		}

		// Get the current target section
		const targetId = navButton.getAttribute("data-target");
		const targetElement = document.querySelector(targetId);

		if (targetElement) {
			const headerHeight = document.querySelector(".nav")?.offsetHeight || 80;
			scrollToTarget(targetElement, -headerHeight);

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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--dark-icon)" xmlns="http://www.w3.org/2000/svg">
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
});
