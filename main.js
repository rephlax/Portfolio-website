document.querySelector("#toggle-theme").addEventListener("click", () => {
	document.documentElement.classList.toggle("light-theme");
});

const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

if (prefersLight) {
	document.documentElement.classList.add("light-theme");
}

document.addEventListener("DOMContentLoaded", function () {
	const overlay = document.getElementById("overlay");
	if (overlay) {
		overlay.addEventListener("click", function () {
			closeDetails();
		});
	}

	// Full Story Toggle
	const fullStoryBtn = document.getElementById("fullStoryBtn");
	if (fullStoryBtn) {
		fullStoryBtn.addEventListener("click", function () {
			const fullStory = document.getElementById("fullStory");

			if (fullStory.style.display === "none" || !fullStory.style.display) {
				fullStory.style.display = "block";
				fullStoryBtn.textContent = "Show Less";

				fullStory.style.color = "var(--black)";

				const paragraphs = fullStory.querySelectorAll(".fade-in");
				paragraphs.forEach((p) => {
					p.classList.add("visible");
					p.style.color = "var(--black)";
				});
			} else {
				fullStory.style.display = "none";
				fullStoryBtn.textContent = "Read My Full Story";
			}
		});
	}

	function toggleDetails(id) {
		const details = document.getElementById(id);
		const overlay = document.getElementById("overlay");
		const activeClass = "active";
		const currentlyActive = details.classList.contains(activeClass);

		document.querySelectorAll(".portfolio-details").forEach((detail) => {
			detail.classList.remove(activeClass);
		});

		overlay.classList.remove(activeClass);

		if (!currentlyActive) {
			details.classList.add(activeClass);
			overlay.classList.add(activeClass);
		}
	}

	window.toggleDetails = toggleDetails;

	window.closeDetails = function () {
		document.querySelectorAll(".portfolio-details").forEach((detail) => {
			detail.classList.remove("active");
		});
		document.getElementById("overlay").classList.remove("active");
	};

	const fadeInElements = document.querySelectorAll(".fade-in");
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
			root: null,
			rootMargin: "0px",
			threshold: 0.1,
		}
	);

	fadeInElements.forEach((element) => observer.observe(element));
});

const button = document.getElementById("nav-button");
const sections = document.querySelectorAll("section");
let currentSectionIndex = 0;

const offsetTop = 25;

function scrollToSectionWithOffset(section) {
	const sectionTop = section.offsetTop;
	const scrollPosition = sectionTop - offsetTop;

	window.scrollTo({
		top: scrollPosition,
		behavior: "smooth",
	});
}

function navigateToNextSection() {
	currentSectionIndex = (currentSectionIndex + 1) % sections.length;

	if (currentSectionIndex === 0) {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
		button.classList.remove("rotate");
	} else {
		scrollToSectionWithOffset(sections[currentSectionIndex]);

		if (currentSectionIndex === sections.length - 1) {
			button.classList.add("rotate");
		} else {
			button.classList.remove("rotate");
		}
	}
}

button.addEventListener("click", navigateToNextSection);

const sectionObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("in-view");
				currentSectionIndex = Array.from(sections).findIndex(
					(section) => section.id === entry.target.id
				);

				if (currentSectionIndex === sections.length - 1) {
					button.classList.add("rotate");
				} else {
					button.classList.remove("rotate");
				}
			}
		});
	},
	{
		root: null,
		rootMargin: "0px",
		threshold: 0.5,
	}
);

sections.forEach((section) => sectionObserver.observe(section));

document.addEventListener("DOMContentLoaded", () => {
	window.scrollTo({
		top: 0,
		behavior: "auto",
	});

	sections[currentSectionIndex].classList.add("in-view");
});
