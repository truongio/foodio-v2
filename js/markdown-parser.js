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
  
  const lines = markdown.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Handle h1 headers (#)
    if (line.startsWith('# ')) {
      const title = line.substring(2);
      html += `<h1>${title}</h1>`;
      continue;
    }
    
    // Handle h2 headers (##) - check if it has following list items
    if (line.startsWith('## ')) {
      const title = line.substring(3);
      
      // Look ahead to see if this has list items (making it a category)
      let j = i + 1;
      let hasListItems = false;
      while (j < lines.length && (lines[j].trim() === '' || lines[j].trim().startsWith('- ['))) {
        if (lines[j].trim().startsWith('- [')) {
          hasListItems = true;
          break;
        }
        j++;
      }
      
      if (hasListItems) {
        // This is a category with items
        html += `<p><b>${title}</b><br />`;
        
        // Process the list items
        const links = [];
        j = i + 1;
        while (j < lines.length && (lines[j].trim() === '' || lines[j].trim().startsWith('- ['))) {
          const linkLine = lines[j].trim();
          if (linkLine.startsWith('- [')) {
            const linkMatch = linkLine.match(/- \[(.*?)\]\((.*?)\)/);
            if (linkMatch) {
              const [, text, url] = linkMatch;
              links.push(`<a href="${url}">${text}</a>`);
            }
          }
          j++;
        }
        
        html += links.join('<br />\n');
        html += '</p>';
        i = j - 1; // Skip processed list items
      } else {
        // This is a regular header
        html += `<h2>${title}</h2>`;
      }
      continue;
    }
    
    // Handle h3 headers (###) - check if it has following list items
    if (line.startsWith('### ')) {
      const title = line.substring(4);
      
      // Look ahead to see if this has list items (making it a category)
      let j = i + 1;
      let hasListItems = false;
      while (j < lines.length && (lines[j].trim() === '' || lines[j].trim().startsWith('- ['))) {
        if (lines[j].trim().startsWith('- [')) {
          hasListItems = true;
          break;
        }
        j++;
      }
      
      if (hasListItems) {
        // This is a category with items
        html += `<p><b>${title}</b><br />`;
        
        // Process the list items
        const links = [];
        j = i + 1;
        while (j < lines.length && (lines[j].trim() === '' || lines[j].trim().startsWith('- ['))) {
          const linkLine = lines[j].trim();
          if (linkLine.startsWith('- [')) {
            const linkMatch = linkLine.match(/- \[(.*?)\]\((.*?)\)/);
            if (linkMatch) {
              const [, text, url] = linkMatch;
              links.push(`<a href="${url}">${text}</a>`);
            }
          }
          j++;
        }
        
        html += links.join('<br />\n');
        html += '</p>';
        i = j - 1; // Skip processed list items
      } else {
        // This is a regular header
        html += `<h5>${title}</h5>`;
      }
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