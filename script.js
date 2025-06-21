// Facebook Clone Interactive Features
class FacebookClone {
    constructor() {
        this.currentStoryIndex = 0;
        this.stories = [];
        this.isStoryViewerOpen = false;
        this.storyTimer = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupStories();
        this.setupInfiniteScroll();
        this.setupLikeAnimations();
        this.setupCommentSystem();
        this.setupPostMenus();
        this.setupResponsiveFeatures();
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('searchBtn').addEventListener('click', () => this.openSearch());
        document.getElementById('menuBtn').addEventListener('click', () => this.openMenu());
        document.getElementById('closeSearch').addEventListener('click', () => this.closeSearch());
        document.getElementById('closeMenu').addEventListener('click', () => this.closeMenu());

        // Navigation tabs
        document.querySelectorAll('.middle-content i').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target));
        });

        // Story viewer
        document.getElementById('closeStoryViewer').addEventListener('click', () => this.closeStoryViewer());
        document.getElementById('prevStory').addEventListener('click', () => this.previousStory());
        document.getElementById('nextStory').addEventListener('click', () => this.nextStory());

        // Post interactions
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleLike(e.currentTarget));
        });

        document.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleComments(e.currentTarget));
        });

        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.sharePost(e.currentTarget));
        });

        // Post menu buttons
        document.querySelectorAll('.post-menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.openPostMenu(e));
        });

        // Close modals on outside click
        document.addEventListener('click', (e) => this.handleOutsideClick(e));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Touch gestures for mobile
        this.setupTouchGestures();
    }

    setupStories() {
        this.stories = Array.from(document.querySelectorAll('.stories[data-story="view"]'));
        
        document.querySelectorAll('.stories').forEach((story, index) => {
            story.addEventListener('click', () => {
                if (story.dataset.story === 'add') {
                    this.addStory();
                } else {
                    this.openStoryViewer(index - 1); // -1 because first story is "add story"
                }
            });
        });
    }

    openStoryViewer(index) {
        if (index < 0 || index >= this.stories.length) return;
        
        this.currentStoryIndex = index;
        this.isStoryViewerOpen = true;
        
        const storyViewer = document.getElementById('storyViewer');
        const story = this.stories[index];
        const img = story.querySelector('img');
        const name = story.querySelector('p').textContent.trim();
        
        document.getElementById('storyImage').src = img.src;
        document.getElementById('storyUserImg').src = img.src;
        document.getElementById('storyUserName').textContent = name;
        
        storyViewer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        this.startStoryTimer();
        this.animateProgressBar();
    }

    closeStoryViewer() {
        this.isStoryViewerOpen = false;
        document.getElementById('storyViewer').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.clearStoryTimer();
    }

    nextStory() {
        if (this.currentStoryIndex < this.stories.length - 1) {
            this.openStoryViewer(this.currentStoryIndex + 1);
        } else {
            this.closeStoryViewer();
        }
    }

    previousStory() {
        if (this.currentStoryIndex > 0) {
            this.openStoryViewer(this.currentStoryIndex - 1);
        }
    }

    startStoryTimer() {
        this.clearStoryTimer();
        this.storyTimer = setTimeout(() => {
            this.nextStory();
        }, 5000);
    }

    clearStoryTimer() {
        if (this.storyTimer) {
            clearTimeout(this.storyTimer);
            this.storyTimer = null;
        }
    }

    animateProgressBar() {
        const progressBar = document.getElementById('progressBar');
        progressBar.style.animation = 'none';
        progressBar.offsetHeight; // Trigger reflow
        progressBar.style.animation = 'progress 5s linear forwards';
    }

    addStory() {
        // Simulate adding a story
        this.showNotification('Story feature coming soon!', 'info');
    }

    openSearch() {
        document.getElementById('searchOverlay').style.display = 'block';
        setTimeout(() => {
            document.getElementById('searchInput').focus();
        }, 100);
    }

    closeSearch() {
        document.getElementById('searchOverlay').style.display = 'none';
    }

    openMenu() {
        document.getElementById('menuOverlay').style.display = 'block';
    }

    closeMenu() {
        document.getElementById('menuOverlay').style.display = 'none';
    }

    switchTab(tab) {
        // Remove active class from all tabs
        document.querySelectorAll('.middle-content i').forEach(t => {
            t.classList.remove('active');
        });
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Add haptic feedback on mobile
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Simulate tab switching
        this.showNotification(`Switched to ${this.getTabName(tab)}`, 'success');
    }

    getTabName(tab) {
        if (tab.classList.contains('fa-home')) return 'Home';
        if (tab.classList.contains('fa-user-friends')) return 'Friends';
        if (tab.classList.contains('fa-comment')) return 'Messages';
        if (tab.classList.contains('fa-bell')) return 'Notifications';
        if (tab.classList.contains('fa-desktop')) return 'Watch';
        if (tab.classList.contains('fa-box')) return 'Marketplace';
        return 'Unknown';
    }

    toggleLike(button) {
        const isLiked = button.dataset.liked === 'true';
        const icon = button.querySelector('i');
        const countSpan = button.querySelector('span');
        const post = button.closest('.post');
        const likeCountElement = post.querySelector('.like-count');
        
        let currentCount = parseInt(countSpan.textContent.replace(/[^\d]/g, '')) || 0;
        
        if (isLiked) {
            // Unlike
            button.dataset.liked = 'false';
            icon.className = 'far fa-thumbs-up';
            icon.style.color = '';
            currentCount = Math.max(0, currentCount - 1);
            this.createLikeAnimation(button, false);
        } else {
            // Like
            button.dataset.liked = 'true';
            icon.className = 'fas fa-thumbs-up';
            icon.style.color = '#3e60fa';
            currentCount += 1;
            this.createLikeAnimation(button, true);
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        }
        
        // Update counts
        countSpan.textContent = this.formatCount(currentCount);
        if (likeCountElement) {
            likeCountElement.textContent = this.formatCount(currentCount);
        }
    }

    createLikeAnimation(button, isLike) {
        const animation = document.createElement('div');
        animation.className = 'like-animation';
        animation.innerHTML = isLike ? '👍' : '💔';
        animation.style.cssText = `
            position: absolute;
            font-size: 20px;
            pointer-events: none;
            z-index: 1000;
            animation: likeFloat 1s ease-out forwards;
        `;
        
        const rect = button.getBoundingClientRect();
        animation.style.left = rect.left + rect.width / 2 + 'px';
        animation.style.top = rect.top + 'px';
        
        document.body.appendChild(animation);
        
        // Add CSS animation if not exists
        if (!document.querySelector('#like-animation-style')) {
            const style = document.createElement('style');
            style.id = 'like-animation-style';
            style.textContent = `
                @keyframes likeFloat {
                    0% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-50px) scale(1.5);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            animation.remove();
        }, 1000);
    }

    toggleComments(button) {
        const post = button.closest('.post');
        const commentsSection = post.querySelector('.comments-section');
        
        if (commentsSection.style.display === 'none' || !commentsSection.style.display) {
            commentsSection.style.display = 'block';
            setTimeout(() => {
                const input = commentsSection.querySelector('input');
                input.focus();
            }, 100);
        } else {
            commentsSection.style.display = 'none';
        }
    }

    sharePost(button) {
        const post = button.closest('.post');
        const postId = post.dataset.postId;
        
        if (navigator.share) {
            navigator.share({
                title: 'Check out this post on Facebook',
                text: 'Shared from Facebook Clone',
                url: window.location.href + '#post-' + postId
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href + '#post-' + postId)
                .then(() => {
                    this.showNotification('Link copied to clipboard!', 'success');
                })
                .catch(() => {
                    this.showNotification('Unable to share post', 'error');
                });
        }
    }

    setupCommentSystem() {
        document.querySelectorAll('.send-comment').forEach(btn => {
            btn.addEventListener('click', (e) => this.sendComment(e));
        });
        
        document.querySelectorAll('.comment-input input').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendComment(e);
                }
            });
        });
    }

    sendComment(e) {
        const input = e.target.closest('.comment-input').querySelector('input');
        const commentText = input.value.trim();
        
        if (!commentText) return;
        
        const commentsList = e.target.closest('.comments-section').querySelector('.comments-list');
        const newComment = this.createCommentElement(commentText);
        
        commentsList.appendChild(newComment);
        input.value = '';
        
        // Update comment count
        const post = e.target.closest('.post');
        const commentBtn = post.querySelector('.comment-btn span');
        const currentCount = parseInt(commentBtn.textContent.replace(/[^\d]/g, '')) || 0;
        commentBtn.textContent = this.formatCount(currentCount + 1);
        
        this.showNotification('Comment posted!', 'success');
    }

    createCommentElement(text) {
        const comment = document.createElement('div');
        comment.className = 'comment';
        comment.innerHTML = `
            <img src="images/profile4.png" alt="">
            <div class="comment-content">
                <span class="comment-author">You</span>
                <p>${text}</p>
                <div class="comment-actions">
                    <span>Like</span>
                    <span>Reply</span>
                    <span>now</span>
                </div>
            </div>
        `;
        
        comment.style.animation = 'slideInUp 0.3s ease-out';
        return comment;
    }

    setupPostMenus() {
        document.querySelectorAll('.post-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.querySelector('span').textContent;
                this.handlePostMenuAction(action);
                this.closePostMenu();
            });
        });
    }

    openPostMenu(e) {
        e.stopPropagation();
        document.getElementById('postMenuModal').style.display = 'block';
    }

    closePostMenu() {
        document.getElementById('postMenuModal').style.display = 'none';
    }

    handlePostMenuAction(action) {
        switch (action) {
            case 'Save post':
                this.showNotification('Post saved!', 'success');
                break;
            case 'Hide post':
                this.showNotification('Post hidden', 'info');
                break;
            case 'Unfollow':
                this.showNotification('Unfollowed user', 'info');
                break;
            case 'Report post':
                this.showNotification('Post reported', 'warning');
                break;
        }
    }

    setupInfiniteScroll() {
        let isLoading = false;
        
        window.addEventListener('scroll', () => {
            if (isLoading) return;
            
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            
            if (scrollTop + clientHeight >= scrollHeight - 1000) {
                isLoading = true;
                this.loadMorePosts();
                
                setTimeout(() => {
                    isLoading = false;
                }, 2000);
            }
        });
    }

    loadMorePosts() {
        const loadingIndicator = document.getElementById('loadingIndicator');
        loadingIndicator.style.display = 'flex';
        
        // Simulate loading delay
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
            this.showNotification('No more posts to load', 'info');
        }, 2000);
    }

    setupLikeAnimations() {
        // Double-tap to like on mobile
        let lastTap = 0;
        
        document.querySelectorAll('.post-image').forEach(img => {
            img.addEventListener('touchend', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                
                if (tapLength < 500 && tapLength > 0) {
                    e.preventDefault();
                    const post = img.closest('.post');
                    const likeBtn = post.querySelector('.like-btn');
                    
                    if (likeBtn.dataset.liked !== 'true') {
                        this.toggleLike(likeBtn);
                        this.createHeartAnimation(img);
                    }
                }
                
                lastTap = currentTime;
            });
        });
    }

    createHeartAnimation(element) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.cssText = `
            position: absolute;
            font-size: 60px;
            pointer-events: none;
            z-index: 1000;
            animation: heartPop 1s ease-out forwards;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        `;
        
        element.style.position = 'relative';
        element.appendChild(heart);
        
        // Add CSS animation if not exists
        if (!document.querySelector('#heart-animation-style')) {
            const style = document.createElement('style');
            style.id = 'heart-animation-style';
            style.textContent = `
                @keyframes heartPop {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0);
                    }
                    50% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1.2);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }

    setupTouchGestures() {
        let startX, startY, currentX, currentY;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', () => {
            if (!startX || !startY || !currentX || !currentY) return;
            
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Swipe detection
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        // Swipe left
                        if (this.isStoryViewerOpen) {
                            this.nextStory();
                        }
                    } else {
                        // Swipe right
                        if (this.isStoryViewerOpen) {
                            this.previousStory();
                        }
                    }
                }
            } else {
                if (Math.abs(diffY) > 50) {
                    if (diffY > 0) {
                        // Swipe up
                        if (this.isStoryViewerOpen) {
                            this.closeStoryViewer();
                        }
                    }
                }
            }
            
            startX = startY = currentX = currentY = null;
        });
    }

    setupResponsiveFeatures() {
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.adjustLayoutForOrientation();
            }, 100);
        });
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.adjustLayoutForViewport();
        });
        
        // Initial setup
        this.adjustLayoutForViewport();
    }

    adjustLayoutForOrientation() {
        const isLandscape = window.innerHeight < window.innerWidth;
        document.body.classList.toggle('landscape', isLandscape);
    }

    adjustLayoutForViewport() {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        const isDesktop = window.innerWidth >= 1024;
        
        document.body.classList.toggle('mobile', isMobile);
        document.body.classList.toggle('tablet', isTablet);
        document.body.classList.toggle('desktop', isDesktop);
    }

    handleOutsideClick(e) {
        // Close search overlay
        if (e.target === document.getElementById('searchOverlay')) {
            this.closeSearch();
        }
        
        // Close menu overlay
        if (e.target === document.getElementById('menuOverlay')) {
            this.closeMenu();
        }
        
        // Close post menu
        if (e.target === document.getElementById('postMenuModal')) {
            this.closePostMenu();
        }
        
        // Close story viewer
        if (e.target === document.getElementById('storyViewer')) {
            this.closeStoryViewer();
        }
    }

    handleKeyboard(e) {
        // Escape key closes modals
        if (e.key === 'Escape') {
            if (this.isStoryViewerOpen) {
                this.closeStoryViewer();
            } else if (document.getElementById('searchOverlay').style.display === 'block') {
                this.closeSearch();
            } else if (document.getElementById('menuOverlay').style.display === 'block') {
                this.closeMenu();
            } else if (document.getElementById('postMenuModal').style.display === 'block') {
                this.closePostMenu();
            }
        }
        
        // Arrow keys for story navigation
        if (this.isStoryViewerOpen) {
            if (e.key === 'ArrowLeft') {
                this.previousStory();
            } else if (e.key === 'ArrowRight') {
                this.nextStory();
            }
        }
        
        // Space bar to pause/resume story
        if (e.key === ' ' && this.isStoryViewerOpen) {
            e.preventDefault();
            if (this.storyTimer) {
                this.clearStoryTimer();
            } else {
                this.startStoryTimer();
            }
        }
    }

    formatCount(count) {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'k';
        }
        return count.toString();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 2000;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
        
        // Add CSS animations if not exists
        if (!document.querySelector('#notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
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
            document.head.appendChild(style);
        }
    }

    getNotificationColor(type) {
        switch (type) {
            case 'success': return '#42b883';
            case 'error': return '#e90000';
            case 'warning': return '#f39c12';
            case 'info':
            default: return '#3e60fa';
        }
    }
}

// Initialize the Facebook Clone when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FacebookClone();
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Performance monitoring
window.addEventListener('load', () => {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    }
});