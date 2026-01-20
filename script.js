/**
 * CBU Math & Econ - 6-Week Intensive Program
 * Main JavaScript File
 * Version: 1.0.0
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeWeekTabs();
    initializeRegistrationForm();
    initializeLoginModal();
    initializeResourceModal();
    initializeBackToTop();
    initializeThemeToggle();
    initializeProgressTracker();
    initializeScheduleResources();
    initializeMobileMenu();
    
    // Initialize animations
    initializeAnimations();
    
    // Set current year in footer
    updateCurrentYear();
    
    // Initialize tooltips
    initializeTooltips();
    
    console.log('CBU Math & Econ website initialized successfully');
});

// ====================
// CORE FUNCTIONALITIES
// ====================

/**
 * Navigation Initialization
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath || 
            (currentPath === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Mobile Menu Toggle
 */
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

/**
 * Week Tabs Functionality
 */
function initializeWeekTabs() {
    const weekTabs = document.querySelectorAll('.week-tab');
    const weekSchedules = document.querySelectorAll('.week-schedule');
    
    if (weekTabs.length > 0 && weekSchedules.length > 0) {
        weekTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const week = this.getAttribute('data-week');
                
                // Remove active class from all tabs
                weekTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Hide all week schedules
                weekSchedules.forEach(schedule => {
                    schedule.classList.remove('active');
                });
                
                // Show selected week schedule
                const selectedSchedule = document.getElementById(`week${week}`);
                if (selectedSchedule) {
                    selectedSchedule.classList.add('active');
                    
                    // Update URL hash
                    history.pushState(null, '', `#week${week}`);
                    
                    // Update progress tracker
                    updateProgressTracker(week);
                }
            });
        });
        
        // Check for hash in URL on page load
        const hash = window.location.hash;
        if (hash) {
            const weekTab = document.querySelector(`.week-tab[data-week="${hash.replace('#week', '')}"]`);
            if (weekTab) {
                weekTab.click();
            }
        }
    }
}

/**
 * Registration Form Handling
 */
function initializeRegistrationForm() {
    const registrationForm = document.getElementById('registrationForm');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateRegistrationForm(data)) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Show success message
                    showNotification('Registration submitted successfully! We will contact you shortly.', 'success');
                    
                    // Reset form
                    registrationForm.reset();
                    
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // Store in localStorage for demo purposes
                    const registrations = JSON.parse(localStorage.getItem('cbuRegistrations') || '[]');
                    registrations.push({
                        ...data,
                        timestamp: new Date().toISOString(),
                        status: 'pending'
                    });
                    localStorage.setItem('cbuRegistrations', JSON.stringify(registrations));
                    
                }, 1500);
            }
        });
    }
}

/**
 * Validate Registration Form
 */
function validateRegistrationForm(data) {
    let isValid = true;
    const errors = [];
    
    // Check full name
    if (!data.fullName || data.fullName.trim().length < 2) {
        errors.push('Please enter your full name');
        isValid = false;
    }
    
    // Check email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
        isValid = false;
    }
    
    // Check program type
    if (!data.program) {
        errors.push('Please select a program type');
        isValid = false;
    }
    
    // Check courses
    const courses = Array.from(document.querySelectorAll('input[name="courses"]:checked'));
    if (courses.length === 0) {
        errors.push('Please select at least one course');
        isValid = false;
    }
    
    // Show errors if any
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
    }
    
    return isValid;
}

/**
 * Login Modal
 */
function initializeLoginModal() {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.querySelector('.close-modal');
    const loginForm = document.getElementById('loginForm');
    
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeModal && loginModal) {
        closeModal.addEventListener('click', function() {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close modal when clicking outside
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const studentId = this.querySelector('#studentId').value;
            const password = this.querySelector('#password').value;
            
            // Simple validation
            if (!studentId || !password) {
                showNotification('Please enter both student ID and password', 'error');
                return;
            }
            
            // Show loading
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            submitBtn.disabled = true;
            
            // Simulate login process
            setTimeout(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Close modal
                loginModal.classList.remove('active');
                document.body.style.overflow = '';
                
                // Show success message
                showNotification('Login successful! Welcome back.', 'success');
                
                // For demo purposes, store login state
                localStorage.setItem('cbuLoggedIn', 'true');
                localStorage.setItem('cbuStudentId', studentId);
                
                // Update login button
                updateLoginButton(true);
                
            }, 1500);
        });
    }
}

/**
 * Update Login Button State
 */
function updateLoginButton(isLoggedIn) {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        if (isLoggedIn) {
            loginBtn.innerHTML = '<i class="fas fa-user-circle"></i><span>DASHBOARD</span>';
            loginBtn.href = '#dashboard';
            loginBtn.removeAttribute('id');
            loginBtn.classList.add('dashboard-btn');
        }
    }
}

/**
 * Resource Modal
 */
function initializeResourceModal() {
    const resourceModal = document.getElementById('resourceModal');
    const resourceLinks = document.querySelectorAll('.resource-link');
    const closeModal = resourceModal?.querySelector('.close-modal');
    
    if (resourceLinks.length > 0) {
        resourceLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const type = this.getAttribute('data-type');
                const course = this.getAttribute('data-course');
                const week = this.getAttribute('data-week');
                const day = this.getAttribute('data-day');
                
                loadResourceContent(type, course, week, day);
                
                if (resourceModal) {
                    resourceModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }
    
    if (closeModal && resourceModal) {
        closeModal.addEventListener('click', function() {
            resourceModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (resourceModal) {
        resourceModal.addEventListener('click', function(e) {
            if (e.target === resourceModal) {
                resourceModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

/**
 * Load Resource Content
 */
function loadResourceContent(type, course, week, day) {
    const contentDiv = document.getElementById('resourceContent');
    if (!contentDiv) return;
    
    // Show loading
    contentDiv.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin fa-2x"></i>
            <p>Loading resource...</p>
        </div>
    `;
    
    // Simulate API call
    setTimeout(() => {
        const resources = {
            notes: {
                math: 'Mathematical Methods 1 - Chapter Notes',
                econ: 'Economics 110 - Lecture Notes'
            },
            problems: {
                math: 'Problem Set with Solutions',
                econ: 'Economic Analysis Exercises'
            },
            solutions: {
                math: 'Step-by-step Solutions',
                econ: 'Economic Model Solutions'
            },
            review: 'Comprehensive Review Materials',
            practice: 'Additional Practice Problems'
        };
        
        let title = '';
        let content = '';
        
        if (type === 'notes' || type === 'problems' || type === 'solutions') {
            title = `${resources[type][course]} - Week ${week}, Day ${day}`;
            content = `
                <h3>${title}</h3>
                <div class="resource-meta">
                    <span><i class="fas fa-calendar"></i> Week ${week}, Day ${day}</span>
                    <span><i class="fas fa-book"></i> ${course === 'math' ? 'Mathematical Methods 1' : 'Economics 110'}</span>
                    <span><i class="fas fa-file"></i> PDF Document</span>
                </div>
                <div class="resource-preview">
                    <p>This resource contains comprehensive materials for Week ${week}, Day ${day} of the ${course === 'math' ? 'Mathematical Methods 1' : 'Economics 110'} course.</p>
                    <ul>
                        <li>Detailed explanations and examples</li>
                        <li>Step-by-step solutions</li>
                        <li>Practice exercises</li>
                        <li>Additional references</li>
                    </ul>
                </div>
                <div class="resource-actions">
                    <button class="btn btn-primary"><i class="fas fa-download"></i> Download PDF</button>
                    <button class="btn btn-secondary"><i class="fas fa-print"></i> Print</button>
                </div>
            `;
        } else {
            title = resources[type];
            content = `
                <h3>${title}</h3>
                <div class="resource-preview">
                    <p>Additional ${type} materials for comprehensive learning.</p>
                    <p>These resources are designed to reinforce your understanding and provide additional practice opportunities.</p>
                </div>
                <div class="resource-actions">
                    <button class="btn btn-primary"><i class="fas fa-external-link-alt"></i> Access Resource</button>
                </div>
            `;
        }
        
        contentDiv.innerHTML = content;
        
    }, 500);
}

/**
 * Initialize Schedule Resources
 */
function initializeScheduleResources() {
    // Add download functionality to resource links
    document.querySelectorAll('.resource-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                
                const resourceType = this.getAttribute('data-type');
                const course = this.getAttribute('data-course');
                const week = this.getAttribute('data-week');
                const day = this.getAttribute('data-day');
                
                // Track download in analytics
                trackResourceDownload(resourceType, course, week, day);
                
                // Show download notification
                showNotification(`Downloading ${resourceType} for ${course === 'math' ? 'Math' : 'Econ'}...`, 'info');
            }
        });
    });
}

/**
 * Track Resource Download
 */
function trackResourceDownload(type, course, week, day) {
    const downloads = JSON.parse(localStorage.getItem('cbuResourceDownloads') || '[]');
    downloads.push({
        type,
        course,
        week,
        day,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('cbuResourceDownloads', JSON.stringify(downloads));
}

/**
 * Back to Top Button
 */
function initializeBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Theme Toggle (Dark/Light Mode)
 */
function initializeThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    document.body.appendChild(themeToggle);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('cbuTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('cbuTheme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('cbuTheme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

/**
 * Progress Tracker
 */
function initializeProgressTracker() {
    // Only create on schedule page
    if (document.querySelector('.week-schedule')) {
        const progressTracker = document.createElement('div');
        progressTracker.className = 'progress-tracker';
        progressTracker.innerHTML = `
            <div class="progress-header">
                <h4>Course Progress</h4>
                <span class="progress-percentage">0%</span>
            </div>
            <div class="progress-list">
                ${Array.from({ length: 6 }, (_, i) => i + 1).map(week => `
                    <div class="progress-item" data-week="${week}">
                        <span>Week ${week}</span>
                        <span class="progress-status">Not Started</span>
                    </div>
                `).join('')}
            </div>
        `;
        document.body.appendChild(progressTracker);
        
        // Load saved progress
        loadProgress();
    }
}

/**
 * Update Progress Tracker
 */
function updateProgressTracker(currentWeek) {
    const progressItems = document.querySelectorAll('.progress-item');
    const progressPercentage = document.querySelector('.progress-percentage');
    
    if (!progressItems.length || !progressPercentage) return;
    
    progressItems.forEach(item => {
        const week = parseInt(item.getAttribute('data-week'));
        const status = item.querySelector('.progress-status');
        
        if (week < currentWeek) {
            item.classList.add('completed');
            item.classList.remove('current');
            status.textContent = 'Completed';
            status.classList.add('completed');
        } else if (week == currentWeek) {
            item.classList.add('current');
            item.classList.remove('completed');
            status.textContent = 'In Progress';
            status.classList.add('current');
        } else {
            item.classList.remove('completed', 'current');
            status.textContent = 'Not Started';
            status.classList.remove('completed', 'current');
        }
    });
    
    // Calculate percentage
    const completedWeeks = document.querySelectorAll('.progress-item.completed').length;
    const percentage = Math.round((completedWeeks / 6) * 100);
    progressPercentage.textContent = `${percentage}%`;
    
    // Save progress
    saveProgress(currentWeek);
}

/**
 * Save Progress to LocalStorage
 */
function saveProgress(currentWeek) {
    const progress = JSON.parse(localStorage.getItem('cbuProgress') || '{}');
    progress[currentWeek] = {
        completed: true,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('cbuProgress', JSON.stringify(progress));
}

/**
 * Load Progress from LocalStorage
 */
function loadProgress() {
    const progress = JSON.parse(localStorage.getItem('cbuProgress') || '{}');
    const completedWeeks = Object.keys(progress).length;
    
    if (completedWeeks > 0) {
        const latestWeek = Math.max(...Object.keys(progress).map(Number));
        updateProgressTracker(latestWeek + 1);
    }
}

/**
 * Initialize Animations
 */
function initializeAnimations() {
    // Add animation class to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.option-card, .info-item, .schedule-row').forEach(el => {
        observer.observe(el);
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .loading {
            text-align: center;
            padding: 2rem;
            color: #6b7280;
        }
        
        .resource-meta {
            display: flex;
            gap: 1rem;
            margin: 1rem 0;
            color: #6b7280;
            font-size: 0.875rem;
        }
        
        .resource-meta span {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .resource-preview {
            margin: 1.5rem 0;
            line-height: 1.6;
        }
        
        .resource-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .dashboard-btn {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
        }
        
        .dashboard-btn:hover {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Show Notification
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            padding: 1rem 1.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            border-left: 4px solid #3b82f6;
        }
        
        .dark-mode .notification {
            background: #1e293b;
            border-color: #3b82f6;
        }
        
        .notification-success {
            border-left-color: #10b981;
        }
        
        .notification-error {
            border-left-color: #ef4444;
        }
        
        .notification-warning {
            border-left-color: #f59e0b;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex: 1;
        }
        
        .notification-content i {
            font-size: 1.25rem;
        }
        
        .notification-success .notification-content i {
            color: #10b981;
        }
        
        .notification-error .notification-content i {
            color: #ef4444;
        }
        
        .notification-warning .notification-content i {
            color: #f59e0b;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #6b7280;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
        }
        
        .notification-close:hover {
            background: #f3f4f6;
        }
        
        .dark-mode .notification-close:hover {
            background: #374151;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }
    
    // Add close functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Add slideOutRight animation
    if (!document.querySelector('#notification-animations')) {
        const animStyle = document.createElement('style');
        animStyle.id = 'notification-animations';
        animStyle.textContent = `
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(animStyle);
    }
}

/**
 * Update Current Year in Footer
 */
function updateCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

/**
 * Initialize Tooltips
 */
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.position = 'fixed';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
    
    // Add tooltip styles
    const style = document.createElement('style');
    style.textContent = `
        .tooltip {
            position: absolute;
            background: #1f2937;
            color: white;
            padding: 0.5rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            white-space: nowrap;
            z-index: 9999;
            pointer-events: none;
        }
        
        .tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 5px;
            border-style: solid;
            border-color: #1f2937 transparent transparent transparent;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Export Progress Data
 */
function exportProgressData() {
    const progress = JSON.parse(localStorage.getItem('cbuProgress') || '{}');
    const registrations = JSON.parse(localStorage.getItem('cbuRegistrations') || '[]');
    const downloads = JSON.parse(localStorage.getItem('cbuResourceDownloads') || '[]');
    
    const data = {
        progress,
        registrations,
        downloads,
        exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cbu-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Progress data exported successfully!', 'success');
}

/**
 * Import Progress Data
 */
function importProgressData(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.progress) localStorage.setItem('cbuProgress', JSON.stringify(data.progress));
            if (data.registrations) localStorage.setItem('cbuRegistrations', JSON.stringify(data.registrations));
            if (data.downloads) localStorage.setItem('cbuResourceDownloads', JSON.stringify(data.downloads));
            
            showNotification('Progress data imported successfully!', 'success');
            location.reload();
        } catch (error) {
            showNotification('Invalid progress data file', 'error');
        }
    };
    
    reader.readAsText(file);
}

/**
 * Reset All Data
 */
function resetAllData() {
    if (confirm('Are you sure you want to reset all progress and data? This action cannot be undone.')) {
        localStorage.removeItem('cbuProgress');
        localStorage.removeItem('cbuRegistrations');
        localStorage.removeItem('cbuResourceDownloads');
        localStorage.removeItem('cbuTheme');
        localStorage.removeItem('cbuLoggedIn');
        localStorage.removeItem('cbuStudentId');
        
        showNotification('All data has been reset.', 'success');
        setTimeout(() => location.reload(), 1000);
    }
}

// ====================
// KEYBOARD SHORTCUTS
// ====================

document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S: Save progress
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveProgress(document.querySelector('.week-tab.active')?.getAttribute('data-week') || 1);
        showNotification('Progress saved!', 'success');
    }
    
    // Ctrl/Cmd + D: Toggle dark mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        document.querySelector('.theme-toggle')?.click();
    }
    
    // Ctrl/Cmd + 1-6: Jump to week
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const weekTab = document.querySelector(`.week-tab[data-week="${e.key}"]`);
        if (weekTab) weekTab.click();
    }
    
    // Escape: Close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});

// ====================
// SERVICE WORKER FOR PWA
// ====================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(
            function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            },
            function(err) {
                console.log('ServiceWorker registration failed: ', err);
            }
        );
    });
}

// ====================
// OFFLINE DETECTION
// ====================

window.addEventListener('online', function() {
    showNotification('You are back online!', 'success');
});

window.addEventListener('offline', function() {
    showNotification('You are offline. Some features may not work.', 'warning');
});

// ====================
// PERFORMANCE MONITORING
// ====================

if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfEntries = performance.getEntriesByType('navigation');
            if (perfEntries.length > 0) {
                const navEntry = perfEntries[0];
                console.log('Page load time:', navEntry.loadEventEnd - navEntry.startTime, 'ms');
            }
        }, 0);
    });
}

// Export functions for global access
window.CBU = {
    exportProgressData,
    importProgressData,
    resetAllData,
    showNotification,
    saveProgress: function() {
        saveProgress(document.querySelector('.week-tab.active')?.getAttribute('data-week') || 1);
    }
};