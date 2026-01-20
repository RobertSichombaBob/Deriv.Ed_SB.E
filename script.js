// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.querySelector('.close-modal');
const weekTabs = document.querySelectorAll('.week-tab');
const resourceLinks = document.querySelectorAll('.resource-link');
const resourceModal = document.getElementById('resourceModal');
const registrationForm = document.getElementById('registrationForm');

// Mock user database
const users = [
    { id: '2023001', email: 'student@cbu.ac.zm', password: 'password123', name: 'Test Student' }
];

// Mock resource database
const resources = {
    math: {
        notes: {
            'w1d1': 'https://drive.google.com/file/d/M-N-W1D1L1/notes',
            'w1d2': 'https://drive.google.com/file/d/M-N-W1D2L1/notes'
        },
        problems: {
            'w1d1': 'https://drive.google.com/file/d/M-P-W1D1L1/problems',
            'w1d2': 'https://drive.google.com/file/d/M-P-W1D2L1/problems'
        },
        solutions: {
            'w1d1': 'https://drive.google.com/file/d/M-S-W1D1L1/solutions',
            'w1d2': 'https://drive.google.com/file/d/M-S-W1D2L1/solutions'
        }
    },
    econ: {
        notes: {
            'w1d1': 'https://drive.google.com/file/d/E-N-W1D1L1/notes',
            'w1d2': 'https://drive.google.com/file/d/E-N-W1D2L1/notes'
        },
        problems: {
            'w1d1': 'https://drive.google.com/file/d/E-P-W1D1L1/problems',
            'w1d2': 'https://drive.google.com/file/d/E-P-W1D2L1/problems'
        },
        solutions: {
            'w1d1': 'https://drive.google.com/file/d/E-S-W1D1L1/solutions',
            'w1d2': 'https://drive.google.com/file/d/E-S-W1D2L1/solutions'
        }
    }
};

// Toggle mobile menu
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Login functionality
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'flex';
});

// Close modal
closeModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
    resourceModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal || e.target === resourceModal) {
        loginModal.style.display = 'none';
        resourceModal.style.display = 'none';
    }
});

// Week tab switching
weekTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        weekTabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Hide all week schedules
        document.querySelectorAll('.week-schedule').forEach(schedule => {
            schedule.classList.remove('active');
        });
        
        // Show selected week schedule
        const weekId = `week${tab.dataset.week}`;
        document.getElementById(weekId).classList.add('active');
    });
});

// Resource link handling
resourceLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const type = link.dataset.type;
        const course = link.dataset.course;
        const week = link.dataset.week;
        const day = link.dataset.day;
        
        if (type && course && week && day) {
            const resourceKey = `w${week}d${day}`;
            const resourceUrl = resources[course][type][resourceKey];
            
            if (resourceUrl) {
                // Load resource content in modal
                loadResourceContent(type, course, week, day, resourceUrl);
            }
        }
    });
});

// Load resource content
function loadResourceContent(type, course, week, day, url) {
    const contentDiv = document.getElementById('resourceContent');
    
    let title = '';
    let description = '';
    
    switch(type) {
        case 'notes':
            title = `${course === 'math' ? 'Mathematics' : 'Economics'} Notes`;
            description = `Week ${week}, Day ${day} - Detailed lecture notes`;
            break;
        case 'problems':
            title = `${course === 'math' ? 'Mathematics' : 'Economics'} Practice Problems`;
            description = `Week ${week}, Day ${day} - Problem set with solutions`;
            break;
        case 'solutions':
            title = `${course === 'math' ? 'Mathematics' : 'Economics'} Solutions`;
            description = `Week ${week}, Day ${day} - Step-by-step solutions`;
            break;
    }
    
    contentDiv.innerHTML = `
        <h2>${title}</h2>
        <p class="resource-description">${description}</p>
        <div class="resource-info">
            <p><strong>Course:</strong> ${course === 'math' ? 'Mathematical Methods 1' : 'Economics 110'}</p>
            <p><strong>Week:</strong> ${week}</p>
            <p><strong>Day:</strong> ${day}</p>
        </div>
        <div class="resource-actions">
            <a href="${url}" target="_blank" class="btn btn-primary">
                <i class="fas fa-download"></i> Download Resource
            </a>
            <button class="btn btn-secondary" onclick="addToStudyList('${type}', '${course}', ${week}, ${day})">
                <i class="fas fa-bookmark"></i> Add to Study List
            </button>
        </div>
        <div class="resource-preview">
            <p><em>Resource will open in Google Drive. Make sure you're logged into your CBU account.</em></p>
        </div>
    `;
    
    resourceModal.style.display = 'flex';
}

// Study list functionality
function addToStudyList(type, course, week, day) {
    const studyList = JSON.parse(localStorage.getItem('studyList') || '[]');
    const resource = {
        type,
        course,
        week,
        day,
        timestamp: new Date().toISOString()
    };
    
    studyList.push(resource);
    localStorage.setItem('studyList', JSON.stringify(studyList));
    
    alert('Added to study list!');
}

// Registration form handling
if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            program: document.getElementById('program').value,
            courses: Array.from(document.querySelectorAll('input[name="courses"]:checked'))
                .map(cb => cb.value)
        };
        
        // Save to localStorage (in real app, this would go to a server)
        localStorage.setItem('userRegistration', JSON.stringify(formData));
        
        // Show success message
        alert('Registration successful! Check your email for confirmation.');
        registrationForm.reset();
    });
}

// Login form handling
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const studentId = document.getElementById('studentId').value;
        const password = document.getElementById('password').value;
        
        // Mock authentication
        const user = users.find(u => 
            (u.id === studentId || u.email === studentId) && u.password === password
        );
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert(`Welcome back, ${user.name}!`);
            loginModal.style.display = 'none';
            updateLoginUI(user);
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });
}

// Update UI based on login status
function updateLoginUI(user) {
    const loginBtn = document.getElementById('loginBtn');
    if (user) {
        loginBtn.innerHTML = `
            <i class="fas fa-user-circle"></i>
            <span>${user.name}</span>
        `;
        loginBtn.href = '#';
        loginBtn.onclick = (e) => {
            e.preventDefault();
            showUserDashboard();
        };
    }
}

// User dashboard
function showUserDashboard() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;
    
    const studyList = JSON.parse(localStorage.getItem('studyList') || '[]');
    
    const modalContent = `
        <div class="user-dashboard">
            <h2>Student Dashboard</h2>
            <div class="user-info">
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>ID:</strong> ${user.id}</p>
            </div>
            
            <div class="dashboard-sections">
                <div class="dashboard-section">
                    <h3><i class="fas fa-book"></i> Study List</h3>
                    ${studyList.length > 0 ? 
                        `<ul class="study-list">
                            ${studyList.map(item => `
                                <li>${item.course === 'math' ? 'Mathematics' : 'Economics'} - 
                                Week ${item.week}, Day ${item.day} - ${item.type}</li>
                            `).join('')}
                        </ul>` : 
                        '<p>No items in study list yet.</p>'
                    }
                </div>
                
                <div class="dashboard-section">
                    <h3><i class="fas fa-chart-line"></i> Progress</h3>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <p class="progress-text">0% Complete</p>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-actions">
                <button class="btn btn-primary" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('resourceContent').innerHTML = modalContent;
    resourceModal.style.display = 'flex';
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    location.reload();
}

// Check login status on page load
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        updateLoginUI(user);
    }
});

// Initialize week tabs
if (weekTabs.length > 0) {
    weekTabs[0].click();
}