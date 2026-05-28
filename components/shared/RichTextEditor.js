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

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
        video: imageHandler
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  return (
    <div className="rich-text-editor-container">
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
