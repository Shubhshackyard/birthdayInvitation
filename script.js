// Language toggle functionality
let currentLanguage = 'en';

document.getElementById('toggleLanguage').addEventListener('click', function() {
    if (currentLanguage === 'en') {
        switchLanguage('hi');
        this.textContent = 'English';
    } else {
        switchLanguage('en');
        this.textContent = 'हिंदी';
    }
});

function switchLanguage(lang) {
    currentLanguage = lang;
    const elements = document.querySelectorAll('[data-en]');
    
    elements.forEach(element => {
        if (element.hasAttribute(`data-${lang}`)) {
            element.textContent = element.getAttribute(`data-${lang}`);
        }
    });
    
    // Update options in select elements
    document.querySelectorAll('option').forEach(option => {
        if (option.hasAttribute(`data-${lang}`)) {
            option.textContent = option.getAttribute(`data-${lang}`);
        }
    });
    
    // Handle placeholders for inputs
    document.querySelectorAll('input[placeholder]').forEach(input => {
        if (input.hasAttribute(`data-placeholder-${lang}`)) {
            input.placeholder = input.getAttribute(`data-placeholder-${lang}`);
        }
    });

    // Update map button text
    const mapWrapper = document.querySelector('.map-wrapper');
    const toggleMapBtn = document.querySelector('.toggle-map');
    
    if (toggleMapBtn && mapWrapper) {
        const isCollapsed = mapWrapper.classList.contains('collapsed');
        updateMapToggleText(toggleMapBtn, isCollapsed);
    }
}

// Form submission handling
document.getElementById('rsvpForm').addEventListener('submit', function(event) {
    if (!window.location.search.includes('success=true')) {
        event.preventDefault();
        
        // Show loading state
        const submitButton = document.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = currentLanguage === 'en' ? 'Submitting...' : 'भेज रहा है...';
        submitButton.disabled = true;
        
        // Collect all guest data and prepare it for FormSubmit
        const guestCount = parseInt(document.getElementById('guests').value) || 1;
        
        // Create serialized fields for guests
        for (let i = 1; i <= guestCount; i++) {
            if (document.getElementById(`guestName${i}`)) {
                const input1 = document.createElement('input');
                input1.type = 'hidden';
                input1.name = `Guest_${i}_Name`;
                input1.value = document.getElementById(`guestName${i}`).value || "Not Attending";
                this.appendChild(input1);
                
                const input2 = document.createElement('input');
                input2.type = 'hidden';
                input2.name = `Guest_${i}_Meal`;
                input2.value = document.getElementById(`guestMeal${i}`).value || "vegetarian";
                this.appendChild(input2);
            }
        }
        
        // Handle kids in a similar way
        const kidCount = parseInt(document.getElementById('kidsCount').value) || 0;
        for (let i = 1; i <= kidCount; i++) {
            if (document.getElementById(`kidName${i}`)) {
                const input1 = document.createElement('input');
                input1.type = 'hidden';
                input1.name = `Kid_${i}_Name`;
                input1.value = document.getElementById(`kidName${i}`).value;
                this.appendChild(input1);
                
                const input2 = document.createElement('input');
                input2.type = 'hidden';
                input2.name = `Kid_${i}_Age`;
                input2.value = document.getElementById(`kidAge${i}`).value;
                this.appendChild(input2);
                
                const input3 = document.createElement('input');
                input3.type = 'hidden';
                input3.name = `Kid_${i}_Likes`;
                input3.value = document.getElementById(`kidLikes${i}`).value || "";
                this.appendChild(input3);
            }
        }
        
        // Save response locally as backup
        const formData = {
            name: document.getElementById('name').value,
            attendance: document.querySelector('input[name="attendance"]:checked').value,
            guests: document.getElementById('guests').value,
            kidsCount: document.getElementById('kidsCount').value,
            allergies: document.getElementById('allergies')?.value || "",
            message: document.getElementById('message')?.value || ""
        };
        saveResponseLocally(formData);
        
        // Submit the form
        this.submit();
    } else {
        // We've returned from successful submission
        event.preventDefault();
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('rsvpForm').style.display = 'none';
        launchConfetti();
        launchBalloons();
    }
});

// Check for success parameter on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with 1 guest
    generateGuestFields(1);
    
    // Check for success parameter
    if (window.location.search.includes('success=true')) {
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('rsvpForm').style.display = 'none';
        launchConfetti();
        launchBalloons();
    }
    
    // Set up map toggle - THIS IS THE ONLY INSTANCE OF THIS CODE
    const toggleMapBtn = document.querySelector('.toggle-map');
    const mapWrapper = document.querySelector('.map-wrapper');
    
    if (toggleMapBtn && mapWrapper) {
        // Check if map should start collapsed (e.g., on mobile)
        if (window.innerWidth < 768) {
            mapWrapper.classList.add('collapsed');
            updateMapToggleText(toggleMapBtn, true);
        }
        
        toggleMapBtn.addEventListener('click', function() {
            mapWrapper.classList.toggle('collapsed');
            const isCollapsed = mapWrapper.classList.contains('collapsed');
            updateMapToggleText(toggleMapBtn, isCollapsed);
        });
    }
    
    // Rest of your initialization code...
});

// Helper function for updating toggle button text
function updateMapToggleText(button, isCollapsed) {
    if (currentLanguage === 'en') {
        button.textContent = isCollapsed ? 'Show Map' : 'Hide Map';
    } else {
        button.textContent = isCollapsed ? 'मानचित्र दिखाएं' : 'मानचित्र छिपाएं';
    }
}

// Show/hide number of guests based on attendance
document.querySelectorAll('input[name="attendance"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        // Get all form sections that should be hidden/shown based on attendance
        const formSections = [
            document.getElementById('guests').parentElement,
            document.getElementById('guestDetailsContainer'),
            document.getElementById('kidsCount').parentElement,
            document.getElementById('kidsDetailsContainer'),
            document.getElementById('allergies').parentElement
        ];
        
        if (this.value === 'yes') {
            // Show all sections
            formSections.forEach(section => {
                if (section) section.style.display = 'block';
            });
        } else {
            // Hide all sections
            formSections.forEach(section => {
                if (section) section.style.display = 'none';
            });
            
            // Pre-fill hidden required fields with default values
            document.getElementById('guests').value = "1";
            
            // Also fill in any guest details fields
            if (document.getElementById('guestName1')) {
                document.getElementById('guestName1').value = document.getElementById('name').value || "Not Attending";
            }
            
            if (document.getElementById('guestMeal1')) {
                document.getElementById('guestMeal1').value = "vegetarian"; // Default value
            }
            
            // Set kids count to 0
            document.getElementById('kidsCount').value = "0";
        }
    });
});

// Handle dynamic guest details generation
document.getElementById('guests').addEventListener('change', function() {
    generateGuestFields(parseInt(this.value) || 1);
    
    // Apply language to new elements
    if (currentLanguage !== 'en') {
        switchLanguage(currentLanguage);
    }
});

function generateGuestFields(count) {
    const container = document.getElementById('guestDetailsContainer');
    container.innerHTML = ''; // Clear existing fields
    
    // Generate fields for each guest
    for (let i = 1; i <= count; i++) {
        const guestDiv = document.createElement('div');
        guestDiv.className = 'guest-detail';
        guestDiv.dataset.guestIndex = i;
        
        const title = i === 1 ? 
            `<h4 data-en="Guest ${i} (you)" data-hi="अतिथि ${i} (आप)">Guest ${i} (you)</h4>` : 
            `<h4 data-en="Guest ${i}" data-hi="अतिथि ${i}">Guest ${i}</h4>`;
        
        guestDiv.innerHTML = `
            ${title}
            <div class="form-group">
                <label for="guestName${i}" data-en="Name:" data-hi="नाम:">Name:</label>
                <input type="text" id="guestName${i}" name="guestName${i}" required>
            </div>
            <div class="form-group">
                <label for="guestMeal${i}" data-en="Meal Preference:" data-hi="भोजन प्राथमिकता:">Meal Preference:</label>
                <select id="guestMeal${i}" name="guestMeal${i}">
                    <option value="" data-en="-- Please select --" data-hi="-- कृपया चुनें --">-- Please select --</option>
                    <option value="standard" data-en="🔴 Non-Veg (Chicken/Mutton)" data-hi="🔴 नॉन-वेज (चिकन/मटन)">🔴 Non-Veg (Chicken/Mutton)</option>
                    <option value="vegetarian" data-en="🟢 Vegetarian" data-hi="🟢 शाकाहारी">🟢 Vegetarian</option>
                </select>
            </div>
        `;
        
        container.appendChild(guestDiv);
    }
}

// Handle kids details generation
document.getElementById('kidsCount').addEventListener('change', function() {
    const count = parseInt(this.value) || 0;
    generateKidsFields(count);
    
    // Show or hide the kids container
    const kidsContainer = document.getElementById('kidsDetailsContainer');
    kidsContainer.style.display = count > 0 ? 'block' : 'none';
    
    // Apply language to new elements
    if (currentLanguage !== 'en') {
        switchLanguage(currentLanguage);
    }
});

function generateKidsFields(count) {
    const container = document.getElementById('kidsDetailsContainer');
    container.innerHTML = ''; // Clear existing fields
    
    if (count <= 0) return;
    
    // Add title for kids section
    const titleDiv = document.createElement('div');
    titleDiv.innerHTML = `
        <h3 data-en="Kids Details" data-hi="बच्चों का विवरण">Kids Details</h3>
        <p data-en="Please provide details for the special surprise!" data-hi="कृपया विशेष आश्चर्य के लिए विवरण प्रदान करें!">
            Please provide details for the special surprise!
        </p>
    `;
    container.appendChild(titleDiv);
    
    // Generate fields for each kid
    for (let i = 1; i <= count; i++) {
        const kidDiv = document.createElement('div');
        kidDiv.className = 'kid-detail';
        kidDiv.dataset.kidIndex = i;
        
        kidDiv.innerHTML = `
            <h4 data-en="Kid ${i}" data-hi="बच्चा ${i}">Kid ${i}</h4>
            <div class="form-group">
                <label for="kidName${i}" data-en="Name:" data-hi="नाम:">Name:</label>
                <input type="text" id="kidName${i}" name="kidName${i}" required>
            </div>
            <div class="form-group">
                <label for="kidAge${i}" data-en="Age:" data-hi="उम्र:">Age:</label>
                <input type="number" id="kidAge${i}" name="kidAge${i}" min="1" max="10" required>
            </div>
            <div class="form-group">
                <label for="kidLikes${i}" data-en="Favorite character/toy:" data-hi="पसंदीदा किरदार/खिलौना:">Favorite character/toy:</label>
                <input type="text" id="kidLikes${i}" name="kidLikes${i}" placeholder="Princess, Spiderman, Cars...">
            </div>
        `;
        
        container.appendChild(kidDiv);
    }
}

// Auto-fill Guest 1 name from main name field
let guestName1ManuallyEdited = false;

document.getElementById('name').addEventListener('input', function() {
    if (!guestName1ManuallyEdited && document.getElementById('guestName1')) {
        document.getElementById('guestName1').value = this.value;
    }
});

document.getElementById('guestDetailsContainer').addEventListener('input', function(event) {
    if (event.target && event.target.id === 'guestName1') {
        guestName1ManuallyEdited = event.target.value !== document.getElementById('name').value;
    }
});

// Animation functions
function launchConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    const colors = ['#FF61A6', '#7B5BE6', '#FFD166', '#06D6A0', '#118AB2'];
    
    confettiContainer.innerHTML = '';
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.position = 'absolute';
        confetti.style.top = '-10px';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.opacity = Math.random() + 0.5;
        
        confettiContainer.appendChild(confetti);
        
        confetti.animate([
            { transform: `translateY(-10px) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${360 * Math.random()}deg)`, opacity: 0.3 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.37, 1.04, 0.68, 0.98)',
            fill: 'forwards'
        }).onfinish = () => confetti.remove();
    }
}

function launchBalloons() {
    const balloonContainer = document.getElementById('balloon-container');
    const balloonEmojis = ['🎈', '🎈', '🎈', '🎀', '🎁', '🎉', '🎊', '🦄', '🧸'];
    
    balloonContainer.innerHTML = '';
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.textContent = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
            balloon.style.fontSize = Math.random() * 20 + 30 + 'px';
            balloon.style.left = Math.random() * 90 + 5 + 'vw';
            balloon.style.bottom = '0';
            
            balloonContainer.appendChild(balloon);
            
            balloon.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 0 },
                { transform: 'translateY(-20vh) rotate(-5deg)', opacity: 1, offset: 0.2 },
                { transform: 'translateY(-100vh) rotate(5deg)', opacity: 0.7 }
            ], {
                duration: Math.random() * 10000 + 10000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            }).onfinish = () => balloon.remove();
        }, i * 500);
    }
}

// Initialize the form and animations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with 1 guest
    generateGuestFields(1);
    
    // Check if kids count is > 0
    const kidsCount = parseInt(document.getElementById('kidsCount').value) || 0;
    if (kidsCount > 0) {
        generateKidsFields(kidsCount);
        document.getElementById('kidsDetailsContainer').style.display = 'block';
    }
    
    // Animate in the form fields
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        setTimeout(() => {
            group.style.transition = 'all 0.5s ease';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
    
    // Launch animations for initial display
    setTimeout(() => {
        launchConfetti();
        launchBalloons();
    }, 1000);
    
    // Setup auto-fill for guest name
    if (document.getElementById('guestName1') && document.getElementById('name')) {
        document.getElementById('guestName1').value = document.getElementById('name').value;
    }
});

// Test button for animations
document.getElementById('testAnimations').addEventListener('click', function() {
    launchConfetti();
    launchBalloons();
});

// Store responses locally as backup
function saveResponseLocally(formData) {
    try {
        const existingResponses = JSON.parse(localStorage.getItem('birthdayRSVPs') || '[]');
        existingResponses.push({
            data: formData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('birthdayRSVPs', JSON.stringify(existingResponses));
    } catch (e) {
        console.error('Could not save to local storage:', e);
    }
}
