import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './MarkdownMessage.css';

const EXTERNAL_URL_PATTERN = /^(https?:)?\/\//i;

function MarkdownLink({ href, title, children }) {
  const isExternal = EXTERNAL_URL_PATTERN.test(href || '');

  return (
    <a
      href={href}
      title={title}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

function MarkdownImage({ alt }) {
  return (
    <span className="markdown-image-placeholder">
      {alt ? `[이미지: ${alt}]` : '[이미지]'}
    </span>
  );
}

const markdownComponents = {
  a: MarkdownLink,
  img: MarkdownImage,
};

function MarkdownMessage({ content }) {
  const markdown = typeof content === 'string' ? content : '';

  return (
    <div className="markdown-message">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
        skipHtml
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownMessage;
