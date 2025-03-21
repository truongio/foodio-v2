// Function to fetch and parse markdown content
async function fetchAndParseMarkdown() {
  try {
    const response = await fetch('recommendations.md');
    if (!response.ok) {
      throw new Error('Failed to fetch markdown');
    }
    const markdownText = await response.text();
    return parseMarkdown(markdownText);
  } catch (error) {
    console.error('Error fetching markdown:', error);
    return '<p>Error loading recommendations</p>';
  }
}

// Parse markdown and convert to HTML
function parseMarkdown(markdown) {
  let html = '<div class="story-container">';
  html += '<div class="page-title">recommendations</div>';
  
  const lines = markdown.split('\n');
  let inFood = false;
  let inStockholm = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Handle main sections (# headings)
    if (line.startsWith('# ')) {
      const title = line.substring(2);
      if (title.toLowerCase() === 'food') {
        inFood = true;
        html += `<h2>${title}</h2>`;
      } else {
        // Main title is already added as page-title
        if (title.toLowerCase() !== 'recommendations') {
          html += `<h2>${title}</h2>`;
        }
      }
      continue;
    }
    
    // Handle stockholm section
    if (line.startsWith('## —')) {
      const location = line.substring(4);
      inStockholm = true;
      html += `<h5>${location}</h5>`;
      continue;
    }
    
    // Handle categories (## or ### headings)
    if (line.startsWith('## ') || line.startsWith('### ')) {
      const category = line.substring(line.startsWith('## ') ? 3 : 4);
      
      // Start a new recommendation item list
      html += `<p class="recommendation-item-list">`;
      html += `<b>${category}</b>`;
      
      // Look ahead for list items
      let j = i + 1;
      while (j < lines.length && lines[j].trim().startsWith('- [')) {
        const linkLine = lines[j].trim();
        const linkMatch = linkLine.match(/- \[(.*?)\]\((.*?)\)/);
        
        if (linkMatch) {
          const [, text, url] = linkMatch;
          html += `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
        }
        
        j++;
      }
      
      html += '</p>';
      i = j - 1; // Skip processed list items
      continue;
    }
  }
  
  html += '</div>';
  return html;
}

// Inject the parsed content into the page
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.querySelector('.container');
  if (container) {
    const html = await fetchAndParseMarkdown();
    container.innerHTML = html;
  }
}); 