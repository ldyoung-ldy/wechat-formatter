import { useState, useEffect } from 'react';
import { marked } from 'marked';
import copy from 'copy-to-clipboard';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/default.css';
import './App.css';

hljs.registerLanguage('javascript', javascript);

function App() {
  const [markdown, setMarkdown] = useState(`# 标题

## 次级标题

这是一段普通的段落，包含一些**粗体**和*斜体*。

> 这是一个引用块。

\`\`\`javascript
// 这是一些代码
function hello() {
  console.log("Hello, world!");
}
\`\`\`

- 列表项 1
- 列表项 2
- 列表项 3
`);
  const [html, setHtml] = useState('');
  const [showThemes, setShowThemes] = useState(false);
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    setHtml(marked(markdown));
  }, [markdown]);

  useEffect(() => {
    document.querySelectorAll('.preview-area pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }, [html]);

  const handleCopy = () => {
    const plainText = document.querySelector('.preview-area').innerText;
    copy(plainText, {
        format: 'text/plain',
    });
    alert('已复制到剪贴板');
  };

  const handleCopyHtml = () => {
    const htmlContent = document.querySelector('.preview-area').innerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    navigator.clipboard.write([new ClipboardItem({ 'text/html': blob })])
      .then(() => {
        alert('HTML 已复制到剪贴板');
      })
      .catch(err => {
        console.error('无法复制 HTML: ', err);
        alert('复制 HTML 失败');
      });
  };

  const handleClear = () => {
    setMarkdown('');
  };


  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
  const charCount = markdown.length;

  return (
    <div className="app-container">
      <h1 className="app-title">微信公众号排版工具</h1>
      <div className="editor-container">
        <textarea
          className="markdown-input"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="在此输入 Markdown..."
        />
        <div
          className={`preview-area ${theme}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <div className="footer">
        <div className="word-counter">
          <span>字符数: {charCount}</span>
          <span> | </span>
          <span>字数: {wordCount}</span>
        </div>
        <div className="button-container">
          <div className="theme-selector">
            <button onClick={() => setShowThemes(!showThemes)} className="action-button">
              一键排版
            </button>
            {showThemes && (
              <div className="theme-options">
                <button onClick={() => setTheme('default')} className="theme-button">默认主题</button>
                <button onClick={() => setTheme('theme1')} className="theme-button">主题一</button>
                <button onClick={() => setTheme('theme2')} className="theme-button">主题二</button>
              </div>
            )}
          </div>
          <button onClick={handleCopy} className="action-button">
            复制纯文本
          </button>
          <button onClick={handleCopyHtml} className="action-button">
            复制HTML
          </button>
          <button onClick={handleClear} className="action-button clear-button">
            清空内容
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
