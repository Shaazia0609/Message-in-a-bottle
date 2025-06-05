// Message in a Bottle - JavaScript Functionality

class MessageBottleGame {
    constructor() {
        this.messages = [];
        this.floatingBottles = [];
        this.init();
    }

    init() {
        this.loadMessages();
        this.bindEvents();
        this.startFloatingBottles();
        this.updateCharCounter();
    }

    // Load existing messages from localStorage
    loadMessages() {
        const saved = localStorage.getItem('bottleMessages');
        if (saved) {
            this.messages = JSON.parse(saved);
        } else {
            // Add some starter messages so the ocean isn't empty
            this.messages = [
                {
                    text: "Hello stranger! I hope you're having a wonderful day. Remember that you matter and someone out there is thinking good thoughts about you. 🌟",
                    timestamp: Date.now() - (1000 * 60 * 60 * 24 * 2), // 2 days ago
                    id: 'starter1'
                },
                {
                    text: "If you're reading this, know that you're not alone. Whatever you're going through, there's always hope on the horizon. Keep going! 💙",
                    timestamp: Date.now() - (1000 * 60 * 60 * 6), // 6 hours ago
                    id: 'starter2'
                },
                {
                    text: "Dear future self or kind stranger - I'm sending this message on a rainy Tuesday. I hope whenever you find this, the sun is shining in your life. ☀️",
                    timestamp: Date.now() - (1000 * 60 * 30), // 30 minutes ago
                    id: 'starter3'
                },
                {
                    text: "Sometimes the smallest acts of kindness make the biggest difference. I hope this message brings a smile to your face! 😊",
                    timestamp: Date.now() - (1000 * 60 * 60 * 12), // 12 hours ago
                    id: 'starter4'
                },
                {
                    text: "To whoever finds this: You are stronger than you know, braver than you feel, and more loved than you realize. ❤️",
                    timestamp: Date.now() - (1000 * 60 * 60 * 48), // 2 days ago
                    id: 'starter5'
                }
            ];
            this.saveMessages();
        }
    }

    // Save messages to localStorage
    saveMessages() {
        localStorage.setItem('bottleMessages', JSON.stringify(this.messages));
    }

    // Bind event listeners
    bindEvents() {
        // Send bottle button
        document.getElementById('sendBottleBtn').addEventListener('click', () => {
            this.sendMessage();
        });

        // Find bottle button
        document.getElementById('findBottleBtn').addEventListener('click', () => {
            this.findMessage();
        });

        // Close message button
        document.getElementById('closeMessageBtn').addEventListener('click', () => {
            this.closeMessage();
        });

        // Character counter for textarea
        document.getElementById('messageText').addEventListener('input', () => {
            this.updateCharCounter();
        });

        // Enter key in textarea (Ctrl+Enter to send)
        document.getElementById('messageText').addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    // Update character counter
    updateCharCounter() {
        const textarea = document.getElementById('messageText');
        const counter = document.getElementById('charCount');
        const count = textarea.value.length;
        counter.textContent = count;
        
        // Change color as approaching limit
        if (count > 450) {
            counter.style.color = '#f97316'; // coral color
        } else if (count > 400) {
            counter.style.color = '#f59e0b'; // sand color
        } else {
            counter.style.color = '#e0f2fe'; // wave foam color
        }
    }

    // Send a message
    sendMessage() {
        const messageText = document.getElementById('messageText').value.trim();
        
        if (!messageText) {
            this.showNotification('Please write a message first! 📝');
            return;
        }

        if (messageText.length < 10) {
            this.showNotification('Your message is too short. Share a bit more! 💭');
            return;
        }

        // Create new message object
        const newMessage = {
            text: messageText,
            timestamp: Date.now(),
            id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        };

        // Add to messages array
        this.messages.push(newMessage);
        this.saveMessages();

        // Clear textarea
        document.getElementById('messageText').value = '';
        this.updateCharCounter();

        // Show success notification
        this.showNotification('🍾 Your message has been cast into the ocean! Someone will find it soon...');

        // Create a special bottle animation for the sent message
        this.createSentBottleAnimation();
    }

    // Find a random message
    findMessage() {
        if (this.messages.length === 0) {
            this.showNotification('The ocean seems empty... Try sending a message first! 🌊');
            return;
        }

        // Show loading spinner
        this.showLoading();

        // Simulate searching delay for better UX
        setTimeout(() => {
            this.hideLoading();
            
            // Get random message (but not one sent in last 30 seconds to avoid getting your own immediately)
            const now = Date.now();
            const eligibleMessages = this.messages.filter(msg => 
                now - msg.timestamp > 30000 || msg.id.startsWith('starter')
            );
            
            if (eligibleMessages.length === 0) {
                this.showNotification('No bottles found right now. The ocean needs time to deliver messages! ⏰');
                return;
            }

            const randomMessage = eligibleMessages[Math.floor(Math.random() * eligibleMessages.length)];
            this.displayMessage(randomMessage);
        }, 1500 + Math.random() * 2000); // Random delay between 1.5-3.5 seconds
    }

    // Display a found message
    displayMessage(message) {
        const messageDisplay = document.getElementById('messageDisplay');
        const messageContent = document.getElementById('foundMessage');
        const messageTime = document.getElementById('messageTime');

        // Format timestamp
        const timeAgo = this.getTimeAgo(message.timestamp);
        
        messageContent.textContent = message.text;
        messageTime.textContent = timeAgo;
        
        messageDisplay.style.display = 'flex';
        
        // Add some sparkle effect
        this.addSparkleEffect();
    }

    // Close message display
    closeMessage() {
        const messageDisplay = document.getElementById('messageDisplay');
        messageDisplay.style.display = 'none';
    }

    // Show notification
    showNotification(text) {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');
        
        notificationText.textContent = text;
        notification.style.display = 'block';
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 4000);
    }

    // Show loading spinner
    showLoading() {
        document.getElementById('loadingSpinner').style.display = 'flex';
    }

    // Hide loading spinner
    hideLoading() {
        document.getElementById('loadingSpinner').style.display = 'none';
    }

    // Get human-readable time ago
    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
        if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
        return `${days} day${days === 1 ? '' : 's'} ago`;
    }

    // Create floating bottles animation
    startFloatingBottles() {
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance every interval
                this.createFloatingBottle();
            }
        }, 3000); // Check every 3 seconds

        // Create initial bottles
        setTimeout(() => this.createFloatingBottle(), 1000);
        setTimeout(() => this.createFloatingBottle(), 4000);
    }

    // Create a single floating bottle
    createFloatingBottle() {
        const container = document.getElementById('bottlesContainer');
        const bottle = document.createElement('div');
        
        bottle.className = 'floating-bottle';
        bottle.textContent = '🍾';
        
        // Random vertical position
        const topPosition = 20 + Math.random() * 60; // Between 20% and 80% from top
        bottle.style.top = topPosition + '%';
        
        // Random animation duration
        const duration = 12 + Math.random() * 8; // Between 12-20 seconds
        bottle.style.animationDuration = duration + 's';
        
        // Click handler for bottle
        bottle.addEventListener('click', () => {
            bottle.style.transform = 'scale(1.5) rotate(360deg)';
            bottle.style.opacity = '0';
            setTimeout(() => {
                bottle.remove();
                this.findMessage(); // Find message when bottle is clicked
            }, 500);
        });
        
        container.appendChild(bottle);
        
        // Remove bottle after animation completes
        setTimeout(() => {
            if (bottle.parentNode) {
                bottle.remove();
            }
        }, duration * 1000 + 1000);
    }

    // Create special animation when message is sent
    createSentBottleAnimation() {
        const container = document.getElementById('bottlesContainer');
        const bottle = document.createElement('div');
        
        bottle.className = 'floating-bottle';
        bottle.textContent = '🍾';
        bottle.style.fontSize = '3rem';
        bottle.style.top = '70%';
        bottle.style.zIndex = '100';
        bottle.style.animation = 'float-drift 8s ease-out forwards';
        bottle.style.filter = 'drop-shadow(0 0 20px rgba(249, 115, 22, 0.6))';
        
        container.appendChild(bottle);
        
        setTimeout(() => {
            if (bottle.parentNode) {
                bottle.remove();
            }
        }, 8000);
    }

    // Add sparkle effect when message is found
    addSparkleEffect() {
        const sparkles = ['✨', '⭐', '💫', '🌟'];
        const container = document.body;
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
                sparkle.style.position = 'fixed';
                sparkle.style.left = Math.random() * window.innerWidth + 'px';
                sparkle.style.top = Math.random() * window.innerHeight + 'px';
                sparkle.style.fontSize = '1.5rem';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '9999';
                sparkle.style.animation = 'sparkle-fade 2s ease-out forwards';
                
                container.appendChild(sparkle);
                
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.remove();
                    }
                }, 2000);
            }, i * 200);
        }
    }
}

// Add sparkle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle-fade {
        0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MessageBottleGame();
});

// Add some fun console messages for developers who inspect the code
console.log('🌊 Welcome to Message in a Bottle! 🍾');
console.log('This game connects strangers through anonymous messages.');
console.log('Check out the code: https://github.com/your-username/your-repo-name');
console.log('Made with ❤️ for bringing people together.');
