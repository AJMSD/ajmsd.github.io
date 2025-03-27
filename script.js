// home
var sidemenu = document.getElementById("side-menu");

function openmenu(){
    sidemenu.classList.add('active');
    
    // Hide hamburger icon
    const menuBtn = document.querySelector('.menu-btn');
    menuBtn.style.opacity = '0';
    menuBtn.style.visibility = 'hidden';
    
    // Show cross icon with rotation animation
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.style.opacity = '1';
    closeBtn.style.visibility = 'visible';
    closeBtn.style.transform = 'rotate(90deg)';
}

function closemenu(){
    sidemenu.classList.remove('active');
    
    // Hide cross icon
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.style.opacity = '0';
    closeBtn.style.transform = 'rotate(0deg)';
    
    // Show hamburger icon after animation completes
    setTimeout(function() {
        const menuBtn = document.querySelector('.menu-btn');
        menuBtn.style.opacity = '1';
        menuBtn.style.visibility = 'visible';
    }, 300); // Slightly faster than menu transition
}

// about
var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabName){
   for(tablink of tablinks){
        tablink.classList.remove("active-link");
    }   
    for(tabcontent of tabcontents){
        tabcontent.classList.remove("active-tab");
    }
    event.currentTarget.classList.add("active-link");
    
    // Get the selected tab
    const selectedTab = document.getElementById(tabName);
    selectedTab.classList.add("active-tab");
    
    // Adjust the margin between About section and Projects section based on selected tab
    const workSection = document.getElementById('project');
    const aboutSection = document.getElementById('about');
    
    // Adjust spacing based on which tab is active
    switch(tabName) {
        case 'skills':
            workSection.style.marginTop = '50px';
            aboutSection.style.paddingBottom = '0px';
            break;
        case 'education':
            workSection.style.marginTop = '30px';
            aboutSection.style.paddingBottom = '0px';
            break;
        case 'research':
            workSection.style.marginTop = '40px';
            aboutSection.style.paddingBottom = '0px';
            break;
        case 'work-exp':
            workSection.style.marginTop = '20px';
            aboutSection.style.paddingBottom = '0px';
            break;
        default:
            workSection.style.marginTop = '50px';
            aboutSection.style.paddingBottom = '0px';
    }
    
    // If the skills tab is activated, trigger progress bar animations
    if (tabName === 'skills') {
        // Reset animation by removing and reapplying the animation class
        const progressBars = selectedTab.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
            bar.style.animation = 'none';
            // Force reflow
            void bar.offsetWidth;
            bar.style.animation = 'progress-animation 1.5s ease-in-out forwards';
        });
    }
    
    // Add smooth scrolling transition for better visual effect
    document.documentElement.style.scrollBehavior = 'smooth';
}

// No typewriter functionality needed

// Set initial margins and trigger animations on page load
document.addEventListener('DOMContentLoaded', function() {
    // No typewriter initialization needed
    
    // Set initial margins between sections
    const workSection = document.getElementById('project');
    const aboutSection = document.getElementById('about');
    
    // Check which tab is active initially
    const activeTab = document.querySelector('.tab-contents.active-tab').id;
    
    // Set initial margins based on active tab
    switch(activeTab) {
        case 'skills':
            workSection.style.marginTop = '50px';
            aboutSection.style.paddingBottom = '0px';
            break;
        case 'education':
            workSection.style.marginTop = '30px';
            aboutSection.style.paddingBottom = '0px';
            break;
        case 'research':
            workSection.style.marginTop = '40px';
            aboutSection.style.paddingBottom = '0px';
            break;
        case 'work-exp':
            workSection.style.marginTop = '20px';
            aboutSection.style.paddingBottom = '0px';
            break;
        default:
            workSection.style.marginTop = '50px';
            aboutSection.style.paddingBottom = '0px';
    }
    
    // Trigger skills animation if skills tab is active
    if (document.getElementById('skills').classList.contains('active-tab')) {
        const progressBars = document.querySelectorAll('#skills .skill-progress');
        progressBars.forEach(bar => {
            setTimeout(() => {
                bar.style.animation = 'progress-animation 1.5s ease-in-out forwards';
            }, 300);
        });
    }
    
    // Experience items click functionality
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
        item.addEventListener('click', function() {
            // Close all other items
            experienceItems.forEach(otherItem => {
                if (otherItem !== this && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle active class on clicked item
            this.classList.toggle('active');
        });
    });
    
    // Mobile-friendly book interaction
    if (window.innerWidth <= 600) {
        const books = document.querySelectorAll('.book');
        let activeBook = null;
        
        // Close active book when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (activeBook && !activeBook.contains(e.target)) {
                activeBook.style.width = '28px';
                activeBook.querySelector('.book-content').style.width = '0';
                activeBook = null;
            }
        });
        
        books.forEach(book => {
            book.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // If this book is already active, close it
                if (activeBook === this) {
                    this.style.width = '28px';
                    this.querySelector('.book-content').style.width = '0';
                    activeBook = null;
                    return;
                }
                
                // Close previously active book
                if (activeBook) {
                    activeBook.style.width = '28px';
                    activeBook.querySelector('.book-content').style.width = '0';
                }
                
                // Open this book
                const viewportWidth = window.innerWidth;
                this.style.width = (viewportWidth - 50) + 'px';
                this.querySelector('.book-content').style.width = (viewportWidth - 80) + 'px';
                activeBook = this;
            });
        });
    }
});

// google-form
const scriptURL = 'https://script.google.com/macros/s/AKfycbzjByxRJORkMRJZCIxb1xb7_v9wbESwh_6TxVht7GL-AwYFkTgc5F88X3KdDB99SQA4/exec'
const form = document.forms['submit-to-google-sheet']
const message = document.getElementById("accepted");
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', e => {
    e.preventDefault();
    
    // Add loading state
    submitButton.classList.add('submitting');
    submitButton.disabled = true;
    
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
        console.log('Success!', response);
        message.innerHTML = "Message sent!";
        
        // Reset form with success animation
        form.reset();
        
        // Remove loading state
        submitButton.classList.remove('submitting');
        submitButton.disabled = false;
        
        // Add success animation
        submitButton.classList.add('success');
        
        // Clear message after delay
        setTimeout(function() {
            message.innerHTML = "";
            submitButton.classList.remove('success');
        }, 3000);
    })
    .catch(error => {
        console.error('Error!', error.message);
        message.innerHTML = "Something went wrong. Please try again.";
        message.style.color = "#e74c3c";
        
        // Remove loading state
        submitButton.classList.remove('submitting');
        submitButton.disabled = false;
        
        // Clear error message after delay
        setTimeout(function() {
            message.innerHTML = "";
            message.style.color = "#61b752"; // Reset to success color
        }, 3000);
    });
})

// Download resume button animation
const downloadButton = document.querySelector('a[href="AmanJain_Resume.pdf"]');
if (downloadButton) {
    downloadButton.addEventListener('click', function() {
        // Add download pulse animation
        this.classList.add('downloading');
        
        // Remove animation after download started
        setTimeout(() => {
            this.classList.remove('downloading');
        }, 1500);
    });
}   