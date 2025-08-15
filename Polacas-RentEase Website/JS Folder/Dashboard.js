// Dashboard.js 
let financialChart;
let performanceChart;
let currentTimeframe = 'Monthly';
let currentPerformance = 76;
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Sample data for different timeframes
const chartData = {
    Daily: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [450, 450, 500, 500, 500, 300, 200],
        backgroundColor: '#10b981'
    },
    Weekly: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        data: [800, 900, 600, 1000, 600],
        backgroundColor: '#10b981'
    },
    Monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [1000, 1350, 1200, 1320, 1350, 1500, 1700, 1750, 1790, 1800, 1550, 1200],
        backgroundColor: '#10b981'
    },
    Yearly: {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
        data: [15000, 18000, 22000, 25000, 30000, 32000],
        backgroundColor: '#10b981'
    }
};

// Performance data simulation
const performanceMetrics = {
    targets: 100,
    completed: 76,
    pending: 24
};

// Mo Initialize sa tanan kung mag load ang page
document.addEventListener('DOMContentLoaded', function() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library is not loaded. Please include Chart.js CDN in your HTML file.');
        showNotification('Chart.js library missing. Please refresh the page.', 'error');
        return;
    }
    
    initializeTheme();
    initializeCharts();
    simulateRealTimeUpdates();
    simulatePerformanceUpdates();
    setupEventListeners();
});

// Initializeion sa theme
function initializeTheme() {
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        const themeSwitch = document.getElementById('themeSwitch');
        if (themeSwitch) {
            themeSwitch.classList.add('active');
        }
    }
}

// Initializion sa tanang charts
function initializeCharts() {
    try {
        initializeFinancialChart();
        initializePerformanceChart();
    } catch (error) {
        console.error('Error initializing charts:', error);
        showNotification('Error loading charts. Please refresh the page.', 'error');
    }
}

// Financial Chart
function initializeFinancialChart() {
    const ctx = document.getElementById('financialChart');
    if (!ctx) {
        console.warn('Financial chart canvas not found');
        return;
    }

    if (financialChart) {
        financialChart.destroy();
    }

    financialChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData[currentTimeframe].labels,
            datasets: [{
                label: 'Revenue',
                data: chartData[currentTimeframe].data,
                backgroundColor: chartData[currentTimeframe].backgroundColor,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: getGridColor()
                    },
                    ticks: {
                        color: getTextColor(),
                        callback: function(value) {
                            return '₱' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: getTextColor()
                    }
                }
            }
        }
    });
}

// Performance Chart
function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) {
        console.warn('Performance chart canvas not found');
        return;
    }

    if (performanceChart) {
        performanceChart.destroy();
    }

    performanceChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [currentPerformance, 100 - currentPerformance],
                backgroundColor: [
                    getPerformanceColor(currentPerformance), 
                    '#e5e7eb'
                ],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        },
        plugins: [{
            beforeDraw: function(chart) {
                const ctx = chart.ctx;
                const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
                const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
                
                ctx.save();
                ctx.font = 'bold 24px Arial';
                ctx.fillStyle = getTextColor();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(currentPerformance + '%', centerX, centerY);
                ctx.restore();
            }
        }]
    });
}

// Helper functions for theme colors
function getGridColor() {
    return isDarkMode ? '#374151' : '#e5e7eb';
}

function getTextColor() {
    return isDarkMode ? '#d1d5db' : '#374151';
}

// Get performance color based on percentage
function getPerformanceColor(percentage) {
    if (percentage >= 80) return '#10b981'; // Green - Excellent
    if (percentage >= 75) return '#f59e0b'; // Amber - Good
    if (percentage >= 60) return '#f97316'; // Orange - Fair
    return '#ef4444'; // Red - Poor
}

// Update performance chart with new data
function updatePerformanceChart(newPerformance) {
    if (!performanceChart) return;
    
    currentPerformance = Math.max(0, Math.min(100, newPerformance));
    
    const newColor = getPerformanceColor(currentPerformance);
    
    performanceChart.data.datasets[0].data = [currentPerformance, 100 - currentPerformance];
    performanceChart.data.datasets[0].backgroundColor[0] = newColor;
    
    performanceChart.update('active');
    updatePerformanceMetrics();
}

// Update performance metrics in the UI
function updatePerformanceMetrics() {
    const performanceValueElement = document.getElementById('performanceValue');
    
    if (performanceValueElement) {
        performanceValueElement.textContent = currentPerformance + '%';
        performanceValueElement.style.color = getPerformanceColor(currentPerformance);
        
        performanceValueElement.style.transform = 'scale(1.1)';
        performanceValueElement.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            performanceValueElement.style.transform = 'scale(1)';
        }, 300);
    }
    
    const completedElement = document.getElementById('completedTasks');
    const pendingElement = document.getElementById('pendingTasks');
    const performanceStatusElement = document.getElementById('performanceStatus');
    
    if (completedElement) {
        performanceMetrics.completed = currentPerformance;
        completedElement.textContent = performanceMetrics.completed;
        completedElement.style.color = getPerformanceColor(currentPerformance);
        setTimeout(() => {
            completedElement.style.color = '';
        }, 1500);
    }
    
    if (pendingElement) {
        performanceMetrics.pending = 100 - currentPerformance;
        pendingElement.textContent = performanceMetrics.pending;
    }
    
    if (performanceStatusElement) {
        let status = 'Poor';
        if (currentPerformance >= 80) status = 'Excellent';
        else if (currentPerformance >= 75) status = 'Good';
        else if (currentPerformance >= 60) status = 'Fair';
        
        performanceStatusElement.textContent = status;
        performanceStatusElement.style.color = getPerformanceColor(currentPerformance);
    }
}

// Simulate real-time performance updates
function simulatePerformanceUpdates() {
    setInterval(() => {
        if (Math.random() > 0.6) {
            const change = (Math.random() - 0.5) * 6;
            const newPerformance = Math.round(currentPerformance + change);
            updatePerformanceChart(newPerformance);
            console.log(`Performance updated: ${currentPerformance}%`);
        }
    }, 3000);
}

// Theme toggle functionality
function toggleTheme() {
    isDarkMode = !isDarkMode;
    const themeSwitch = document.getElementById('themeSwitch');
    
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeSwitch) themeSwitch.classList.add('active');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeSwitch) themeSwitch.classList.remove('active');
        localStorage.setItem('darkMode', 'false');
    }
    
    updateChartsTheme();
}

// Update charts with new theme colors
function updateChartsTheme() {
    if (financialChart) {
        financialChart.options.scales.y.grid.color = getGridColor();
        financialChart.options.scales.y.ticks.color = getTextColor();
        financialChart.options.scales.x.ticks.color = getTextColor();
        financialChart.update();
    }
    
    if (performanceChart) {
        performanceChart.update();
    }
}

// Profile dropdown functions
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (!dropdown) return;
    
    const isVisible = dropdown.classList.contains('show');
    closeAllDropdowns();
    
    if (!isVisible) {
        dropdown.classList.add('show');
    }
}

function closeProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

// Notification functions
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) return;
    
    const isVisible = dropdown.classList.contains('show');
    closeAllDropdowns();
    
    if (!isVisible) {
        dropdown.classList.add('show');
    }
}

function closeNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

function handleNotification(type) {
    const messages = {
        inquiry: 'Opening property inquiry details...',
        payment: 'Opening payment details...',
        maintenance: 'Opening maintenance schedule...'
    };
    
    showNotification(messages[type] || 'Opening notification...', 'info');
    closeNotificationDropdown();
    
    const count = document.getElementById('notificationCount');
    if (count) {
        const currentCount = parseInt(count.textContent);
        if (currentCount > 0) {
            count.textContent = currentCount - 1;
            if (currentCount - 1 === 0) {
                count.style.display = 'none';
            }
        }
    }
}

// Chart functions
function toggleChartDropdown() {
    const dropdown = document.getElementById('chartDropdown');
    if (!dropdown) return;
    
    const isVisible = dropdown.classList.contains('show');
    closeAllDropdowns();
    
    if (!isVisible) {
        dropdown.classList.add('show');
    }
}

function selectTimeframe(timeframe) {
    currentTimeframe = timeframe;
    const selectedElement = document.getElementById('selectedTimeframe');
    if (selectedElement) {
        selectedElement.textContent = timeframe;
    }
    
    const dropdown = document.getElementById('chartDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
    
    updateFinancialChart(timeframe);
}

function updateFinancialChart(timeframe) {
    if (financialChart && chartData[timeframe]) {
        financialChart.data.labels = chartData[timeframe].labels;
        financialChart.data.datasets[0].data = chartData[timeframe].data;
        financialChart.update('active');
    }
}

// Filter functions
function filterByDate(period) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    const timeframeMap = {
        'all': 'Monthly',
        '1d': 'Daily', 
        '1w': 'Weekly',
        '1m': 'Monthly',
        '1y': 'Yearly'
    };
    
    if (timeframeMap[period]) {
        selectTimeframe(timeframeMap[period]);
    }
    
    if (event && event.target) {
        const filterBtn = event.target;
        filterBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            filterBtn.style.transform = 'translateY(-1px)';
        }, 100);
    }
}

// Privacy policy functions
function showPrivacyPolicy() {
    const modal = document.getElementById('privacyModal');
    if (modal) {
        modal.style.display = 'block';
    }
    closeProfileDropdown();
}

function closePrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Logout function
function handleLogout() {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '0.3';
        
        setTimeout(() => {
             window.location.href = 'login.html';
        }, 1500);
    }
    closeProfileDropdown();
}

// Utility functions
function closeAllDropdowns() {
    closeProfileDropdown();
    closeNotificationDropdown();
    
    const chartDropdown = document.getElementById('chartDropdown');
    if (chartDropdown) {
        chartDropdown.classList.remove('show');
    }
}

function handleGetPro() {
    showNotification('Upgrading to Pro! Directing to subscription page', 'info');
}

function handleSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value.trim();
        if (query) {
            showNotification(`Searching for: "${query}" - Found 3 properties!`, 'success');
        }
    }
}

// Real-time updates simulation
function simulateRealTimeUpdates() {
    setInterval(() => {
        if (Math.random() > 0.7) {
            const totalSalesElement = document.getElementById('totalSales');
            const viewersElement = document.getElementById('viewers');
            
            if (totalSalesElement) {
                const currentSalesText = totalSalesElement.textContent.replace(/[₱,]/g, '');
                const currentSales = parseInt(currentSalesText) || 12500;
                const newSales = currentSales + Math.floor(Math.random() * 1000) + 100;
                totalSalesElement.textContent = formatCurrency(newSales);
                
                totalSalesElement.style.color = '#10b981';
                totalSalesElement.style.transform = 'scale(1.05)';
                totalSalesElement.style.transition = 'all 0.2s ease';
                setTimeout(() => {
                    totalSalesElement.style.color = '';
                    totalSalesElement.style.transform = 'scale(1)';
                }, 1000);
            }
            
            if (viewersElement) {
                const currentViewersText = viewersElement.textContent.replace(/,/g, '');
                const currentViewers = parseInt(currentViewersText) || 4090;
                const newViewers = currentViewers + Math.floor(Math.random() * 50) + 5;
                viewersElement.textContent = newViewers.toLocaleString();
                
                viewersElement.style.color = '#f59e0b';
                viewersElement.style.transform = 'scale(1.05)';
                viewersElement.style.transition = 'all 0.2s ease';
                setTimeout(() => {
                    viewersElement.style.color = '';
                    viewersElement.style.transform = 'scale(1)';
                }, 1000);
            }
        }
    }, 3000);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Show notification helper
function showNotification(message, type = 'info') {
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(notification);
    }
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    notification.textContent = message;
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    document.addEventListener('click', function(e) {
        const profileBtn = document.querySelector('.profile-btn');
        const profileDropdown = document.getElementById('profileDropdown');
        const notificationBtn = document.querySelector('.notification-btn');
        const notificationDropdown = document.getElementById('notificationDropdown');
        const chartToggle = document.querySelector('.dropdown-toggle');
        const chartDropdown = document.getElementById('chartDropdown');
        const modal = document.getElementById('privacyModal');
        
        if (profileBtn && profileDropdown && !profileBtn.contains(e.target)) {
            profileDropdown.classList.remove('show');
        }
        
        if (notificationBtn && notificationDropdown && !notificationBtn.contains(e.target)) {
            notificationDropdown.classList.remove('show');
        }
        
        if (chartToggle && chartDropdown && !chartToggle.contains(e.target)) {
            chartDropdown.classList.remove('show');
        }
        
        if (modal && e.target === modal) {
            closePrivacyModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllDropdowns();
            closePrivacyModal();
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
    });
}