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

        // Privacy modal functions
        function openPrivacyModal() {
            document.getElementById('privacyModal').classList.add('show');
            closeAllDropdowns();
        }

        function closePrivacyModal() {
            document.getElementById('privacyModal').classList.remove('show');
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

        // Chart initialization
        function initializeCharts() {
            const chartOptions = {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: isDarkMode ? '#e0e0e0' : '#333'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: isDarkMode ? '#e0e0e0' : '#333'
                        },
                        grid: {
                            color: isDarkMode ? '#404040' : '#e1e5e9'
                        }
                    },
                    y: {
                        ticks: {
                            color: isDarkMode ? '#e0e0e0' : '#333'
                        },
                        grid: {
                            color: isDarkMode ? '#404040' : '#e1e5e9'
                        }
                    }
                }
            };

            // Revenue Chart
            const revenueCtx = document.getElementById('revenueChart').getContext('2d');
            revenueChart = new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    datasets: [{
                        label: 'Revenue (₱)',
                        data: [2100000, 2250000, 2180000, 2350000, 2280000, 2400000, 2450000],
                        borderColor: '#4ecdc4',
                        backgroundColor: 'rgba(78, 205, 196, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    ...chartOptions,
                    aspectRatio: 2.5,
                    scales: {
                        ...chartOptions.scales,
                        y: {
                            ...chartOptions.scales.y,
                            beginAtZero: false,
                            ticks: {
                                ...chartOptions.scales.y.ticks,
                                callback: function(value) {
                                    return '₱' + (value / 1000000).toFixed(1) + 'M';
                                }
                            }
                        }
                    }
                }
            });

            // Property Distribution Chart
            const propertyCtx = document.getElementById('propertyChart').getContext('2d');
            propertyChart = new Chart(propertyCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Sunset Apartments', 'Ocean View Condos', 'Downtown Plaza'],
                    datasets: [{
                        data: [45, 35, 20],
                        backgroundColor: ['#4ecdc4', '#44a08d', '#5cb3cc']
                    }]
                },
                options: {
                    ...chartOptions,
                    aspectRatio: 1.2,
                }
            });

            // Occupancy Chart
            const occupancyCtx = document.getElementById('occupancyChart').getContext('2d');
            occupancyChart = new Chart(occupancyCtx, {
                type: 'bar',
                data: {
                    labels: ['Sunset Apartments', 'Ocean View Condos', 'Downtown Plaza', 'City Heights', 'Riverside Manor'],
                    datasets: [{
                        label: 'Occupancy Rate (%)',
                        data: [95, 88, 92, 85, 90],
                        backgroundColor: 'rgba(78, 205, 196, 0.8)',
                        borderColor: '#4ecdc4',
                        borderWidth: 2
                    }]
                },
                options: {
                    ...chartOptions,
                    aspectRatio: 3,
                    scales: {
                        ...chartOptions.scales,
                        y: {
                            ...chartOptions.scales.y,
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                ...chartOptions.scales.y.ticks,
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Update charts theme
        function updateChartsTheme() {
            const textColor = isDarkMode ? '#e0e0e0' : '#333';
            const gridColor = isDarkMode ? '#404040' : '#e1e5e9';

            [revenueChart, propertyChart, occupancyChart].forEach(chart => {
                if (chart) {
                    // Update legend colors
                    if (chart.options.plugins.legend) {
                        chart.options.plugins.legend.labels.color = textColor;
                    }
                    
                    // Update scale colors
                    if (chart.options.scales) {
                        ['x', 'y'].forEach(axis => {
                            if (chart.options.scales[axis]) {
                                if (chart.options.scales[axis].ticks) {
                                    chart.options.scales[axis].ticks.color = textColor;
                                }
                                if (chart.options.scales[axis].grid) {
                                    chart.options.scales[axis].grid.color = gridColor;
                                }
                            }
                        });
                    }
                    
                    chart.update();
                }
            });
        }

        // Report generation
        function generateReport() {
            const dateRange = document.getElementById('dateRange').value;
            const reportType = document.getElementById('reportType').value;
            const property = document.getElementById('property').value;

            const generateBtn = document.querySelector('.generate-btn');
            const originalText = generateBtn.innerHTML;
            generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            generateBtn.disabled = true;

            setTimeout(() => {
                updateReportData(dateRange, reportType, property);
                
                generateBtn.innerHTML = originalText;
                generateBtn.disabled = false;
                
                showNotification('Report generated successfully!', 'success');
            }, 2000);
        }

        // Update report data
        function updateReportData(dateRange, reportType, property) {
            const stats = {
                revenue: Math.floor(Math.random() * 1000000) + 2000000,
                occupancy: Math.floor(Math.random() * 20) + 80,
                tenants: Math.floor(Math.random() * 50) + 120,
                maintenance: Math.floor(Math.random() * 30) + 10
            };

            document.getElementById('totalRevenue').textContent = '₱' + stats.revenue.toLocaleString();
            document.getElementById('occupancyRate').textContent = stats.occupancy + '%';
            document.getElementById('activeTenants').textContent = stats.tenants;
            document.getElementById('maintenanceRequests').textContent = stats.maintenance;

            // Update charts with new data
            revenueChart.data.datasets[0].data = generateRandomData(7, 2000000, 3000000);
            revenueChart.update();

            propertyChart.data.datasets[0].data = [
                Math.floor(Math.random() * 30) + 30,
                Math.floor(Math.random() * 30) + 25,
                Math.floor(Math.random() * 30) + 15
            ];
            propertyChart.update();

            occupancyChart.data.datasets[0].data = generateRandomData(5, 75, 100);
            occupancyChart.update();
        }

        // Generate random data
        function generateRandomData(count, min, max) {
            return Array.from({length: count}, () => Math.floor(Math.random() * (max - min)) + min);
        }

        // Export data
        function exportData() {
            const table = document.getElementById('transactionTable');
            let csv = [];
            
            const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);
            csv.push(headers.join(','));
            
            const rows = Array.from(table.querySelectorAll('tbody tr'));
            rows.forEach(row => {
                const cells = Array.from(row.querySelectorAll('td')).map(td => {
                    return td.textContent.trim().replace(/,/g, ';');
                });
                csv.push(cells.join(','));
            });
            
            const csvContent = csv.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'property_report_' + new Date().toISOString().split('T')[0] + '.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            showNotification('Report exported successfully!', 'success');
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
            // Search functionality
            const searchInput = document.querySelector('.search-input');
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const tableRows = document.querySelectorAll('#transactionTable tbody tr');
                
                tableRows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            });

            // Close dropdowns when clicking outside
            document.addEventListener('click', function(event) {
                if (!event.target.closest('.profile') && !event.target.closest('.notification')) {
                    closeAllDropdowns();
                }
            });

            // Close modal when clicking outside
            document.getElementById('privacyModal').addEventListener('click', function(event) {
                if (event.target === this) {
                    closePrivacyModal();
                }
            });

            // Keyboard shortcuts
            document.addEventListener('keydown', function(event) {
                // Escape key closes modals and dropdowns
                if (event.key === 'Escape') {
                    closePrivacyModal();
                    closeAllDropdowns();
                }
                
                // Ctrl/Cmd + D for dark mode toggle
                if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
                    event.preventDefault();
                    toggleTheme();
                }
            });
        }