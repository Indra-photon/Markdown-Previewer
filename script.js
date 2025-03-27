document.addEventListener('DOMContentLoaded', function() {
    
    const markdownInput = document.getElementById('markdown-input');
    const previewOutput = document.getElementById('preview-output');
    const clearButton = document.getElementById('clear-button');
    const editorSection = document.querySelector('.editor-section');

  
    marked.setOptions({
        breaks: true,        
        gfm: true,          
        headerIds: true,     
        sanitize: false,     
        mangle: false,       
        smartLists: true,    
        smartypants: true,   
        xhtml: false         
    });

    
    function updatePreview() {       
        const markdownText = markdownInput.value;
        const htmlOutput = marked.parse(markdownText);
        previewOutput.innerHTML = htmlOutput;
    }

    markdownInput.addEventListener('input', updatePreview);
    clearButton.addEventListener('click', function() {
        markdownInput.value = '';
        updatePreview();
    });

    // Initial sample markdown for first-time users
    const sampleMarkdown = `# Welcome to Markdown Previewer!

## Try out some markdown:

### Headers

#### Different sizes

### Formatting
**This text is bold**
*This text is italic*
~~This text is strikethrough~~

### Lists
#### Unordered List:
* Item 1
* Item 2
  * Nested Item 2.1
  * Nested Item 2.2

#### Ordered List:
1. First item
2. Second item
3. Third item

### Links
[Visit OpenAI](https://www.openai.com)

### Blockquotes
> This is a blockquote
> It can span multiple lines

### Code
Inline code: \`const example = "hello world";\`

Code block:
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Tables
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

`;

    
    createToolbar();
    markdownInput.value = sampleMarkdown;
    updatePreview();
    function createToolbar() {
        // Create toolbar container
        const toolbar = document.createElement('div');
        toolbar.className = 'markdown-toolbar';
        
        // Define toolbar buttons
        const buttons = [
            { icon: 'B', title: 'Bold', action: () => insertFormat('**', '**') },
            { icon: 'I', title: 'Italic', action: () => insertFormat('*', '*') },
            { icon: 'U', title: 'Underline', action: () => insertFormat('<u>', '</u>') },
            { icon: 'S', title: 'Strikethrough', action: () => insertFormat('~~', '~~') },
            { icon: '🔗', title: 'Link', action: () => insertLink() },
            // { icon: '📷', title: 'Image', action: () => insertImage() },
            { separator: true },
            { icon: 'H1', title: 'Heading 1', action: () => insertHeading(1) },
            { icon: 'H2', title: 'Heading 2', action: () => insertHeading(2) },
            { icon: 'H3', title: 'Heading 3', action: () => insertHeading(3) },
            { separator: true },
            { icon: '•', title: 'Unordered List', action: () => insertList('* ') },
            { icon: '1.', title: 'Ordered List', action: () => insertList('1. ') },
            { icon: '❝', title: 'Blockquote', action: () => insertBlockquote() },
            { icon: '⌨️', title: 'Code Block', action: () => insertCodeBlock() },
            { icon: '📏', title: 'Horizontal Rule', action: () => insertHorizontalRule() },
            { icon: '⌫', title: 'Clear Formatting', action: () => clearFormatting() }
        ];
        
        buttons.forEach(button => {
            if (button.separator) {
                const separator = document.createElement('span');
                separator.className = 'toolbar-separator';
                toolbar.appendChild(separator);
                return;
            }
            
            const btnElement = document.createElement('button');
            btnElement.type = 'button';
            btnElement.className = 'toolbar-button';
            btnElement.textContent = button.icon;
            btnElement.title = button.title;
            btnElement.addEventListener('click', button.action);
            toolbar.appendChild(btnElement);
        });
        
        editorSection.insertBefore(toolbar, markdownInput);
    }
    
    
    function insertFormat(startChars, endChars) {
        const start = markdownInput.selectionStart;
        const end = markdownInput.selectionEnd;
        const selectedText = markdownInput.value.substring(start, end);
        
        const textBefore = markdownInput.value.substring(0, start);
        const textAfter = markdownInput.value.substring(end);
        
        markdownInput.value = textBefore + startChars + selectedText + endChars + textAfter;
        updatePreview();
        
        markdownInput.focus();
        markdownInput.selectionStart = start + startChars.length;
        markdownInput.selectionEnd = start + startChars.length + selectedText.length;
    }
    
    
    function insertLink() {
        const start = markdownInput.selectionStart;
        const end = markdownInput.selectionEnd;
        const selectedText = markdownInput.value.substring(start, end);
        
        const textBefore = markdownInput.value.substring(0, start);
        const textAfter = markdownInput.value.substring(end);
        
        const linkText = selectedText || 'Link Text';
        markdownInput.value = textBefore + '[' + linkText + '](https://example.com)' + textAfter;
        
        updatePreview();
        markdownInput.focus();
    }
    

    function insertImage() {
        const start = markdownInput.selectionStart;
        const textBefore = markdownInput.value.substring(0, start);
        const textAfter = markdownInput.value.substring(start);
        
        markdownInput.value = textBefore + '![Image Alt Text](https://example.com/image.jpg)' + textAfter;
        
        updatePreview();
        markdownInput.focus();
    }
    
    // Function to insert heading
    function insertHeading(level) {
        const start = markdownInput.selectionStart;
        const end = markdownInput.selectionEnd;
        const selectedText = markdownInput.value.substring(start, end);
        
        const textBefore = markdownInput.value.substring(0, start);
        const textAfter = markdownInput.value.substring(end);
        
        const prefix = '#'.repeat(level) + ' ';
        markdownInput.value = textBefore + prefix + selectedText + textAfter;
        
        updatePreview();
        markdownInput.focus();
    }
    
   
    function insertList(prefix) {
        const start = markdownInput.selectionStart;
        const end = markdownInput.selectionEnd;
        const selectedText = markdownInput.value.substring(start, end);
        
        const textBefore = markdownInput.value.substring(0, start);
        const textAfter = markdownInput.value.substring(end);
        
        if (selectedText) {
            const lines = selectedText.split('\n');
            const formattedText = lines.map(line => prefix + line).join('\n');
            markdownInput.value = textBefore + formattedText + textAfter;
        } else {
            markdownInput.value = textBefore + prefix + textAfter;
        }
        
        updatePreview();
        markdownInput.focus();
    }
    
    
    function insertBlockquote() {
        const start = markdownInput.selectionStart;
        const end = markdownInput.selectionEnd;
        const selectedText = markdownInput.value.substring(start, end);
        
        const textBefore = markdownInput.value.substring(0, start);
        const textAfter = markdownInput.value.substring(end);
        
        if (selectedText) {
            const lines = selectedText.split('\n');
            const formattedText = lines.map(line => '> ' + line).join('\n');
            markdownInput.value = textBefore + formattedText + textAfter;
        } else {
            markdownInput.value = textBefore + '> ' + textAfter;
        }
        
        updatePreview();
        markdownInput.focus();
    }
    
    function insertCodeBlock() {
        const start = markdownInput.selectionStart;
        const end = markdownInput.selectionEnd;
        const selectedText = markdownInput.value.substring(start, end);
        
        const textBefore = markdownInput.value.substring(0, start);
        const textAfter = markdownInput.value.substring(end);
        
        markdownInput.value = textBefore + '```\n' + selectedText + '\n```' + textAfter;
        
        updatePreview();
        markdownInput.focus();
    }
    

    function insertHorizontalRule() {
        const start = markdownInput.selectionStart;
        const textBefore = markdownInput.value.substring(0, start);
        const textAfter = markdownInput.value.substring(start);
        
        markdownInput.value = textBefore + '\n---\n' + textAfter;
        
        updatePreview();
        markdownInput.focus();
    }
    
    function clearFormatting() {
        const start = markdownInput.selectionStart;
        const end = markdownInput.selectionEnd;
        const selectedText = markdownInput.value.substring(start, end);
        
        let cleanText = selectedText
            .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
            .replace(/\*(.*?)\*/g, '$1')     // Italic
            .replace(/~~(.*?)~~/g, '$1')     // Strikethrough
            .replace(/^#+\s+/gm, '')         // Headings
            .replace(/^\s*[*+-]\s+/gm, '')   // Unordered lists
            .replace(/^\s*\d+\.\s+/gm, '')   // Ordered lists
            .replace(/^\s*>\s+/gm, '')       // Blockquotes
            .replace(/`{3}[\s\S]*?`{3}/g, function(match) {
                return match.replace(/^```\s*\n?|```$/g, ''); // Code blocks
            })
            .replace(/`(.*?)`/g, '$1')       // Inline code
            .replace(/!\[(.*?)\]\((.*?)\)/g, '$1') // Images
            .replace(/\[(.*?)\]\((.*?)\)/g, '$1'); // Links
        
        const textBefore = markdownInput.value.substring(0, start);
        const textAfter = markdownInput.value.substring(end);
        
        markdownInput.value = textBefore + cleanText + textAfter;
        
        updatePreview();
        markdownInput.focus();
    }
});