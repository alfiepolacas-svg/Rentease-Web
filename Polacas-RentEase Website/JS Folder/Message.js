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
        
        // Close all dropdowns utility function
        function closeAllDropdowns() {
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }

        // Profile Dropdown Functions
        function toggleProfileDropdown() {
            const dropdown = document.getElementById('profileDropdown');
            const isVisible = dropdown.classList.contains('show');
            
            closeAllDropdowns();
            
            if (!isVisible) {
                dropdown.classList.add('show');
            }
        }

        function closeProfileDropdown() {
            const dropdown = document.getElementById('profileDropdown');
            dropdown.classList.remove('show');
        }

        // Notification Functions
        function toggleNotifications() {
            const dropdown = document.getElementById('notificationDropdown');
            const isVisible = dropdown.classList.contains('show');
            
            closeAllDropdowns();
            
            if (!isVisible) {
                dropdown.classList.add('show');
            }
        }

        function closeNotificationDropdown() {
            const dropdown = document.getElementById('notificationDropdown');
            dropdown.classList.remove('show');
        }

        function handleNotification(type) {
            const messages = {
                inquiry: 'Opening property inquiry details...',
                payment: 'Opening payment details...',
                maintenance: 'Opening maintenance schedule...'
            };
            
            alert(messages[type] || 'Opening notification...');
            closeNotificationDropdown();
            
            // Update notification count
            const count = document.getElementById('notificationCount');
            const currentCount = parseInt(count.textContent);
            if (currentCount > 0) {
                count.textContent = currentCount - 1;
                if (currentCount - 1 === 0) {
                    count.style.display = 'none';
                }
            }
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

        // Search function
        function handleSearch(event) {
            if (event.key === 'Enter') {
                const searchTerm = event.target.value;
                alert('Searching for: ' + searchTerm);
            }
        }

        const chatData = {
            1: {
                name: "Sanny Sabio",
                avatar: "./assetsFilesImages/sanny.jpg",
                status: "Online",
                messages: [
                    {
                        id: 1,
                        text: "Good evening pre Salamat sa service nindut! kaayu ang apartment!!!",
                        sent: false,
                        time: "8:30 PM",
                        reactions: ["👍", "👏", "❤️"]
                    },
                    {
                        id: 2,
                        text: "Hi, Mr. Sanny Sabio Thanks for your great so far. The apartment neighbourhood is perfect",
                        sent: true,
                        time: "8:30 PM"
                    }
                ]
            },
            2: {
                name: "John Paul Dacer",
                avatar: "./assetsFilesImages/dacer.jpg",
                status: "Online",
                messages: [
                    {
                        id: 1,
                        text: "How About sa Kuyente ug tubig?",
                        sent: false,
                        time: "7:12 AM"
                    },
                    {
                        id: 2,
                        text: "The utilities are included in the rent. Water and electricity are covered.",
                        sent: true,
                        time: "7:15 AM"
                    }
                ]
            },
            3: {
                name: "Andrei Besañez",
                avatar: "./assetsFilesImages/Andrei.jpg",
                status: "Last seen 2 hours ago",
                messages: [
                    {
                        id: 1,
                        text: "Thank you for your help yesterday!",
                        sent: false,
                        time: "Yesterday"
                    }
                ]
            },
            4: {
                name: "Julios Dumagan",
                avatar: "./assetsFilesImages/Julios.jpg",
                status: "Last seen 1 day ago",
                messages: [
                    {
                        id: 1,
                        text: "Can we schedule a meeting?",
                        sent: false,
                        time: "Monday"
                    }
                ]
            }
        };

        let currentChatId = null;
        let typingTimeout = null;

        // DOM elements
        const chatItems = document.querySelectorAll('.chat-item');
        const noChatSelected = document.getElementById('noChatSelected');
        const chatContainer = document.getElementById('chatContainer');
        const chatHeaderAvatar = document.getElementById('chatHeaderAvatar');
        const chatHeaderName = document.getElementById('chatHeaderName');
        const chatHeaderStatus = document.getElementById('chatHeaderStatus');
        const messagesArea = document.getElementById('messagesArea');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const typingIndicator = document.getElementById('typingIndicator');
        const typingUser = document.getElementById('typingUser');
        const chatSearch = document.getElementById('chatSearch');

        // Initialize event listeners
        function initializeEventListeners() {
            // Chat item click handlers
            chatItems.forEach(item => {
                item.addEventListener('click', () => {
                    const chatId = item.dataset.chatId;
                    selectChat(chatId);
                });
            });

            // Message input handlers
            messageInput.addEventListener('input', handleMessageInput);
            messageInput.addEventListener('keypress', handleKeyPress);
            sendButton.addEventListener('click', sendMessage);

            // Chat search
            chatSearch.addEventListener('input', handleChatSearch);

            // Close dropdowns when clicking outside
            document.addEventListener('click', function(event) {
                if (!event.target.closest('.notification-btn') && !event.target.closest('.profile-btn')) {
                    closeAllDropdowns();
                }
            });

            // Close modal when clicking outside
            window.addEventListener('click', function(event) {
                const modal = document.getElementById('privacyModal');
                if (event.target === modal) {
                    closePrivacyModal();
                }
            });
        }

        // Select and load a chat
        function selectChat(chatId) {
            currentChatId = chatId;
            
            // Update active chat item
            chatItems.forEach(item => item.classList.remove('active'));
            document.querySelector(`[data-chat-id="${chatId}"]`).classList.add('active');

            // Hide no chat selected and show chat container
            noChatSelected.style.display = 'none';
            chatContainer.style.display = 'flex';

            // Load chat data
            const chat = chatData[chatId];
            chatHeaderAvatar.src = chat.avatar;
            chatHeaderName.textContent = chat.name;
            chatHeaderStatus.textContent = chat.status;

            // Load messages
            loadMessages(chatId);

            // Remove unread badge
            const unreadBadge = document.querySelector(`[data-chat-id="${chatId}"] .unread-badge`);
            if (unreadBadge) {
                unreadBadge.style.display = 'none';
            }
        }

        // Load messages for a chat
        function loadMessages(chatId) {
            const chat = chatData[chatId];
            messagesArea.innerHTML = '';

            chat.messages.forEach(message => {
                const messageElement = createMessageElement(message);
                messagesArea.appendChild(messageElement);
            });

            // Scroll to bottom
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }

        // Create message element
        function createMessageElement(message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${message.sent ? 'sent' : 'received'}`;

            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'message-bubble';
            
            const textDiv = document.createElement('div');
            textDiv.textContent = message.text;
            bubbleDiv.appendChild(textDiv);

            const timeDiv = document.createElement('div');
            timeDiv.className = 'message-time';
            timeDiv.textContent = message.time;
            bubbleDiv.appendChild(timeDiv);

            messageDiv.appendChild(bubbleDiv);

            // Add emoji reactions if they exist
            if (message.reactions && message.reactions.length > 0) {
                const reactionsDiv = document.createElement('div');
                reactionsDiv.className = 'message-reactions';
                
                message.reactions.forEach(emoji => {
                    const emojiSpan = document.createElement('span');
                    emojiSpan.className = 'reaction-emoji';
                    emojiSpan.textContent = emoji;
                    emojiSpan.addEventListener('click', () => {
                        console.log('Emoji reaction clicked:', emoji);
                    });
                    reactionsDiv.appendChild(emojiSpan);
                });
                
                messageDiv.appendChild(reactionsDiv);
            }

            return messageDiv;
        }

        // Handle message input
        function handleMessageInput() {
            const text = messageInput.value.trim();
            sendButton.disabled = text.length === 0;

            // Auto-resize textarea
            messageInput.style.height = 'auto';
            messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';

            // Show typing indicator to other user (simulated)
            if (currentChatId && text.length > 0) {
                showTypingIndicator();
            } else {
                hideTypingIndicator();
            }
        }

        // Handle key press (Enter to send)
        function handleKeyPress(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        }

        // Send message
        function sendMessage() {
            if (!currentChatId || !messageInput.value.trim()) return;

            const messageText = messageInput.value.trim();
            const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            // Create message object
            const newMessage = {
                id: Date.now(),
                text: messageText,
                sent: true,
                time: currentTime
            };

            // Add to chat data
            chatData[currentChatId].messages.push(newMessage);

            // Create and append message element
            const messageElement = createMessageElement(newMessage);
            messagesArea.appendChild(messageElement);

            // Clear input and reset height
            messageInput.value = '';
            messageInput.style.height = 'auto';
            sendButton.disabled = true;

            // Scroll to bottom
            messagesArea.scrollTop = messagesArea.scrollHeight;

            // Update chat preview
            updateChatPreview(currentChatId, messageText);

            // Simulate response after 2-3 seconds
            setTimeout(() => {
                simulateResponse();
            }, Math.random() * 2000 + 1000);
        }

        // Update chat preview in sidebar
        function updateChatPreview(chatId, text) {
            const chatItem = document.querySelector(`[data-chat-id="${chatId}"]`);
            const previewElement = chatItem.querySelector('.chat-preview');
            previewElement.textContent = text;

            const timeElement = chatItem.querySelector('.chat-time');
            timeElement.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }

        // Simulate typing indicator
        function showTypingIndicator() {
            if (currentChatId && typingIndicator) {
                typingUser.textContent = chatData[currentChatId].name;
                typingIndicator.style.display = 'flex';
                
                clearTimeout(typingTimeout);
                typingTimeout = setTimeout(() => {
                    hideTypingIndicator();
                }, 3000);
            }
        }

        function hideTypingIndicator() {
            if (typingIndicator) {
                typingIndicator.style.display = 'none';
            }
        }

        // Simulate response from other user
        function simulateResponse() {
            if (!currentChatId) return;

            const responses = [
                "Thanks for your message!",
                "I'll get back to you soon.",
                "That sounds good to me.",
                "Let me check and confirm.",
                "Sure, no problem!",
                "I understand. Let's discuss this further.",
                "Great! Looking forward to it."
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            // Show typing indicator first
            if (typingUser && typingIndicator) {
                typingUser.textContent = chatData[currentChatId].name;
                typingIndicator.style.display = 'flex';
            }

            setTimeout(() => {
                // Hide typing indicator
                if (typingIndicator) {
                    typingIndicator.style.display = 'none';
                }

                // Create response message
                const responseMessage = {
                    id: Date.now(),
                    text: randomResponse,
                    sent: false,
                    time: currentTime
                };

                // Add to chat data
                chatData[currentChatId].messages.push(responseMessage);

                // Create and append message element
                const messageElement = createMessageElement(responseMessage);
                messagesArea.appendChild(messageElement);

                // Scroll to bottom
                messagesArea.scrollTop = messagesArea.scrollHeight;

                // Update chat preview
                updateChatPreview(currentChatId, randomResponse);
            }, 1500);
        }

        // Handle chat search
        function handleChatSearch() {
            const searchTerm = chatSearch.value.toLowerCase();
            const chatItems = document.querySelectorAll('.chat-item');

            chatItems.forEach(item => {
                const name = item.querySelector('.chat-name').textContent.toLowerCase();
                const preview = item.querySelector('.chat-preview').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || preview.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Mobile responsiveness
        function handleMobileToggle() {
            const sidebar = document.querySelector('.sidebar');
            const chatHeader = document.querySelector('.chat-header');
            
            if (window.innerWidth <= 768) {
                // Add mobile menu toggle button to chat header
                const mobileToggle = document.createElement('button');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                mobileToggle.style.cssText = `
                    background: none;
                    border: none;
                    font-size: 18px;
                    color: #4ecdc4;
                    cursor: pointer;
                    margin-right: 10px;
                `;
                
                mobileToggle.addEventListener('click', () => {
                    sidebar.classList.toggle('mobile-open');
                });
                
                if (chatHeader && !chatHeader.querySelector('.mobile-toggle')) {
                    mobileToggle.className = 'mobile-toggle';
                    chatHeader.insertBefore(mobileToggle, chatHeader.firstChild);
                }
            }
        }

        // Initialize all functionality
        function initialize() {
            initializeEventListeners();
            handleMobileToggle();
            initializeTheme();
            
            // Auto-select first pinned chat on load
            setTimeout(() => {
                selectChat('1');
            }, 500);
            
            // Handle window resize
            window.addEventListener('resize', handleMobileToggle);
        }

        // Start the application
        document.addEventListener('DOMContentLoaded', initialize);