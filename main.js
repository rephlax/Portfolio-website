document.querySelector("#toggle-theme").addEventListener("click", () => {
    document.documentElement.classList.toggle("light-theme");
});

const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

if (prefersLight) {
    document.documentElement.classList.add("light-theme");
}

document.addEventListener("DOMContentLoaded", function() {
    function toggleDetails(id) {
        const details = document.getElementById(id);
        if (details.classList.contains("active")) {
            details.classList.remove("active");
        } else {
            details.classList.add("active");
        }
    }

    // Attach toggleDetails to the window object so it can be accessed globally
    window.toggleDetails = toggleDetails;
});

const button = document.getElementById('nav-button');
const sections = document.querySelectorAll('section');
let currentSectionIndex = 0;

// Offset from the top of the screen
const offsetTop = 25;

// Function to scroll to a section with an offset from the top
function scrollToSectionWithOffset(section) {
    const sectionTop = section.offsetTop;
    const scrollPosition = sectionTop - offsetTop;
    
    // Scroll to the section with the desired offset
    window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
    });
}

// Function to navigate to the next section
function navigateToNextSection() {
    // Increment the current section index
    currentSectionIndex = (currentSectionIndex + 1) % sections.length;
    
    // Check if we are at the last section
    if (currentSectionIndex === 0) {
        // If we've reached the last section and cycled back to the first index,
        // scroll to the top of the page
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        button.classList.remove('rotate');
    } else {
        // Otherwise, scroll to the next section with the offset
        scrollToSectionWithOffset(sections[currentSectionIndex]);
        
        // Check if we are at the last section and rotate the button if so
        if (currentSectionIndex === sections.length - 1) {
            button.classList.add('rotate');
        } else {
            button.classList.remove('rotate');
        }
    }
}

// Attach event listener to the button
button.addEventListener('click', navigateToNextSection);

// Create an observer for each section
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            currentSectionIndex = Array.from(sections).findIndex(section => section.id === entry.target.id);
            
            // Rotate the button if we are at the last section
            if (currentSectionIndex === sections.length - 1) {
                button.classList.add('rotate');
            } else {
                button.classList.remove('rotate');
            }
        }
    });
}, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
});

// Observe each section
sections.forEach(section => observer.observe(section));

// Scroll to the top of the page on initial load
document.addEventListener('DOMContentLoaded', () => {
    // Scroll to the top of the page
    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });

    // Add in-view class to the first section
    sections[currentSectionIndex].classList.add('in-view');
});