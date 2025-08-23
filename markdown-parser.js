// markdown-parser.js - Simple markdown to HTML converter
function parseMarkdown(markdown) {
  let html = markdown;
  
  // Headers with animations
  html = html.replace(/^### (.*$)/gim, '<h3 class="slide-in-left">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="slide-in-right">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="fade-in">$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>');
  
  // Code blocks (simple)
  html = html.replace(/```([\s\S]*?)```/gim, '<pre class="scale-in"><code>$1</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
  
  // Line breaks and paragraphs
  html = html.replace(/\n\n/gim, '</p><p class="fade-in">');
  html = html.replace(/\n/gim, '<br>');
  
  // Wrap in paragraphs with animation
  html = '<p class="fade-in">' + html + '</p>';
  
  // Clean up empty paragraphs
  html = html.replace(/<p class="fade-in"><\/p>/gim, '');
  html = html.replace(/<p class="fade-in"><h/gim, '<h');
  html = html.replace(/<\/h([1-6])><\/p>/gim, '</h$1>');
  
  return html;
}

// Function to load and display blog post
async function loadBlogPost(filename) {
  try {
    const response = await fetch(`/blog/${filename}`);
    if (!response.ok) {
      throw new Error('Blog post not found');
    }
    
    const markdown = await response.text();
    const html = parseMarkdown(markdown);
    
    // Display in popup
    popupwindowstart(html);
    
    // Initialize scroll animations for popup content
    setTimeout(() => {
      const popupContent = document.getElementById('popup-content');
      if (popupContent) {
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            } else {
              // Remove visible class when element goes out of view (replayable animations)
              entry.target.classList.remove('visible');
            }
          });
        }, observerOptions);

        // Observe all animated elements in the popup
        const animatedElements = popupContent.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
        animatedElements.forEach(el => observer.observe(el));
      }
    }, 100); // Small delay to ensure popup is fully rendered
    
  } catch (error) {
    console.error('Error loading blog post:', error);
    popupwindowstart('<h2>Error</h2><p>Sorry, could not load the blog post.</p>');
  }
}
