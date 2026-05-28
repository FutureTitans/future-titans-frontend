'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { upload } from '@vercel/blob/client';

if (typeof window !== 'undefined') {
  const BlockEmbed = Quill.import('blots/block/embed');
  
  class VideoBlot extends BlockEmbed {
    static create(url) {
      let node = super.create();
      node.setAttribute('src', url);
      node.setAttribute('controls', '');
      node.setAttribute('width', '100%');
      node.setAttribute('class', 'rounded-2xl shadow-md my-6 mx-auto block max-h-[500px] bg-black');
      return node;
    }
    static value(node) {
      return node.getAttribute('src');
    }
  }
  VideoBlot.blotName = 'htmlVideo';
  VideoBlot.tagName = 'video';
  
  try {
    Quill.register(VideoBlot, true);
  } catch (e) {}

  class ImageBlot extends BlockEmbed {
    static create(url) {
      let node = super.create();
      node.setAttribute('src', url);
      node.setAttribute('class', 'rounded-2xl shadow-md my-6 mx-auto block max-w-full h-auto');
      return node;
    }
    static value(node) {
      return node.getAttribute('src');
    }
  }
  ImageBlot.blotName = 'image';
  ImageBlot.tagName = 'img';
  
  try {
    Quill.register(ImageBlot, true);
  } catch (e) {}

  class LinkPreviewBlot extends BlockEmbed {
    static create(data) {
      let node = super.create();
      node.setAttribute('contenteditable', 'false');
      
      const html = `
        <a href="${data.url}" target="_blank" rel="noopener noreferrer" class="not-prose flex flex-col sm:flex-row bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 my-8 no-underline group max-w-3xl mx-auto cursor-pointer">
          ${data.image ? `<div class="sm:w-1/3 h-48 sm:h-auto overflow-hidden bg-gray-50 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-gray-200">
            <img src="${data.image}" alt="${data.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 m-0" />
          </div>` : ''}
          <div class="p-6 flex flex-col justify-center flex-1 min-w-0 bg-white">
            <h3 class="text-xl font-bold text-gray-900 line-clamp-2 mb-2 leading-tight group-hover:text-[#D4AF37] transition-colors">${data.title}</h3>
            ${data.description ? `<p class="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">${data.description}</p>` : ''}
            <div class="flex items-center text-xs text-gray-400 font-medium mt-auto uppercase tracking-wide">
              <span class="truncate">${data.domain}</span>
            </div>
          </div>
        </a>
      `;
      node.innerHTML = html;
      node.setAttribute('data-url', data.url);
      node.setAttribute('data-title', data.title);
      node.setAttribute('data-description', data.description || '');
      node.setAttribute('data-image', data.image || '');
      node.setAttribute('data-domain', data.domain);
      
      return node;
    }
    
    static value(node) {
      return {
        url: node.getAttribute('data-url'),
        title: node.getAttribute('data-title'),
        description: node.getAttribute('data-description'),
        image: node.getAttribute('data-image'),
        domain: node.getAttribute('data-domain')
      };
    }
  }
  LinkPreviewBlot.blotName = 'linkPreview';
  LinkPreviewBlot.tagName = 'div';
  LinkPreviewBlot.className = 'ql-link-preview-container';

  try {
    Quill.register(LinkPreviewBlot, true);
  } catch (e) {}
}

export default function RichTextEditor({ value, onChange }) {
  const quillRef = useRef(null);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*, video/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection(true);
          
          editor.insertText(range.index, 'Uploading media...', { color: '#D4AF37' });

          const result = await upload(`blog-media-${Date.now()}-${file.name}`, file, {
            access: 'public',
            handleUploadUrl: '/api/upload',
          });
          
          editor.deleteText(range.index, 18);
          
          if (file.type.startsWith('video/')) {
            editor.insertEmbed(range.index, 'htmlVideo', result.url);
          } else {
            editor.insertEmbed(range.index, 'image', result.url);
          }
          editor.insertText(range.index + 1, '\n');
          editor.setSelection(range.index + 2);
        } catch (err) {
          console.error('Upload failed', err);
          alert('Failed to upload media. Please try again.');
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          editor.deleteText(range.index - 18, 18);
        }
      }
    };
  };

  const linkPreviewHandler = async () => {
    const url = prompt('Enter the URL to generate a rich preview card:');
    if (!url) return;

    const editor = quillRef.current.getEditor();
    const range = editor.getSelection(true);
    editor.insertText(range.index, 'Generating preview...', { color: '#D4AF37' });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/api/blogs/preview-link?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      editor.deleteText(range.index, 21);
      
      if (response.ok) {
        editor.insertEmbed(range.index, 'linkPreview', data);
        editor.insertText(range.index + 1, '\n');
        editor.setSelection(range.index + 2);
      } else {
        alert(data.message || 'Could not generate preview.');
      }
    } catch (e) {
      editor.deleteText(range.index, 21);
      alert('Error fetching link preview. Make sure the URL is accessible.');
    }
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'linkPreview', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
        video: imageHandler,
        linkPreview: linkPreviewHandler
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  return (
    <div className="rich-text-editor-container">
      <style dangerouslySetInnerHTML={{__html: `
        .ql-toolbar .ql-linkPreview {
          width: auto !important;
          padding: 0 5px !important;
          font-weight: bold;
          color: #4b5563;
        }
        .ql-toolbar .ql-linkPreview::after {
          content: 'Card';
        }
        .ql-toolbar .ql-linkPreview:hover {
          color: #D4AF37;
        }
      `}} />
      <ReactQuill 
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="h-[400px] rounded-xl"
        placeholder="Write your story here..."
      />
    </div>
  );
}
