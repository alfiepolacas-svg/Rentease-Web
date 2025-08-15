 // Global variables
        let revenueChart, propertyChart, occupancyChart;
        let isDarkMode = localStorage.getItem('darkMode') === 'true';

        // Initialize theme on page load
        document.addEventListener('DOMContentLoaded', function() {
            if (isDarkMode) {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.getElementById('themeSwitch').classList.add('active');
            }
            
            initializeCharts();
            setupEventListeners();
        });

        // Theme toggle functionality
        function toggleTheme() {
            isDarkMode = !isDarkMode;
            const themeSwitch = document.getElementById('themeSwitch');
            
            if (isDarkMode) {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeSwitch.classList.add('active');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.documentElement.removeAttribute('data-theme');
                themeSwitch.classList.remove('active');
                localStorage.setItem('darkMode', 'false');
            }
            
            // Update charts with new theme colors
            updateChartsTheme();
        }

        // Profile dropdown toggle
        function toggleProfileDropdown() {
            const dropdown = document.getElementById('profileDropdown');
            const isShown = dropdown.classList.contains('show');
            
            // Close all dropdowns first
            closeAllDropdowns();
            
            if (!isShown) {
                dropdown.classList.add('show');
            }
        }

        // Notification dropdown toggle
        function toggleNotifications() {
            const dropdown = document.getElementById('notificationDropdown');
            const isShown = dropdown.classList.contains('show');
            
            // Close all dropdowns first
            closeAllDropdowns();
            
            if (!isShown) {
                dropdown.classList.add('show');
            }
        }

        // Close all dropdowns
        function closeAllDropdowns() {
            document.getElementById('profileDropdown').classList.remove('show');
            document.getElementById('notificationDropdown').classList.remove('show');
        }

       // Privacy Policy Functions
function showPrivacyPolicy() {
    const modal = document.getElementById('privacyModal');
    modal.style.display = 'block';
    closeProfileDropdown();
}

function closePrivacyModal() {
    const modal = document.getElementById('privacyModal');
    modal.style.display = 'none';
}

      // Logout Function
function handleLogout() {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
        // Add logout animation
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '0.3';
        
        setTimeout(() => {
            alert('✅ Successfully logged out!\n\nRedirecting to login page...');
            // In a real app: window.location.href = 'login.html';
            window.location.href = 'login.html';
        }, 1500);
    }
    closeProfileDropdown();
}
        // Navigation function
        function navigateTo(page) {
            // Simulate navigation
            setTimeout(() => {
                window.location.href = `${page}.html`;
            }, 200);
        }

        // Search function for header
        function handleSearch(event) {
            if (event.key === 'Enter') {
                const searchTerm = event.target.value.toLowerCase();
                showNotification(`Searching for: ${searchTerm}`, 'info');
                // Add your search logic here
            }
        }

        // Initialize charts function
        function initializeCharts() {
            // Doughnut Chart Setup
            const ctx = document.getElementById('doughnutChart');
            if (ctx) {
                new Chart(ctx.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: ['Completed', 'Pending'],
                        datasets: [{
                            data: [76, 24],
                            backgroundColor: ['#3b976c', '#e6e6e6'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        cutout: '70%',
                        plugins: {
                            legend: { display: false },
                        }
                    }
                });
            }
        }

        // Download Table as CSV
        function downloadCSV() {
            const rows = document.querySelectorAll("table tr");
            let csv = [];
            for (let row of rows) {
                let cols = row.querySelectorAll("td, th");
                let rowData = [...cols].map(e => `"${e.innerText.replace(/"/g, '""')}"`).join(",");
                csv.push(rowData);
            }
            let blob = new Blob([csv.join("\n")], { type: 'text/csv' });
            let a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "transactions.csv";
            a.click();
            
            showNotification('CSV file downloaded successfully!', 'success');
        }

        // Filter Table
        function filterTable() {
            const input = document.getElementById("searchInput");
            if (!input) return;
            
            const filter = input.value.toLowerCase();
            const rows = document.querySelectorAll("#transactionTable tbody tr");
            
            rows.forEach((row) => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(filter) ? "" : "none";
            });
        }

        // Show notification
        function showNotification(message, type) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#27ae60' : type === 'info' ? '#3498db' : '#e74c3c'};
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                z-index: 1000;
                font-weight: 500;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);

            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }

        // Setup event listeners
        function setupEventListeners() {
            // Close dropdowns when clicking outside
            document.addEventListener('click', function(event) {
                const profileBtn = event.target.closest('.profile-btn');
                const notificationBtn = event.target.closest('.notification-btn');
                const profileDropdown = document.getElementById('profileDropdown');
                const notificationDropdown = document.getElementById('notificationDropdown');
                
                // If click is not on profile button or inside profile dropdown
                if (!profileBtn && profileDropdown && !profileDropdown.contains(event.target)) {
                    closeProfileDropdown();
                }
                
                // If click is not on notification button or inside notification dropdown
                if (!notificationBtn && notificationDropdown && !notificationDropdown.contains(event.target)) {
                    closeNotificationDropdown();
                }
            });

            // Initialize status styling
            document.querySelectorAll('.status').forEach(function(statusEl) {
                const text = statusEl.textContent.trim().toLowerCase();
                if (text === 'pending') {
                    statusEl.classList.add('pending');
                } else if (text === 'completed') {
                    statusEl.classList.add('completed');
                }
            });

            // Search input event listener
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('input', filterTable);
            }

            // Close modal when clicking outside of it
            const modal = document.getElementById('privacyModal');
            if (modal) {
                window.onclick = function(event) {
                    if (event.target == modal) {
                        closePrivacyModal();
                    }
                }
            }
        }