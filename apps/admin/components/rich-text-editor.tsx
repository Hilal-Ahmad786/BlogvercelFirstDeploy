// apps/admin/components/rich-text-editor.tsx - IMPROVED VERSION
'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link2, 
  Image as ImageIcon,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
    editorRef.current?.focus()
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
    handleInput()
  }

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      executeCommand('createLink', url)
    }
  }

  const insertImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      executeCommand('insertImage', url)
    }
  }

  const formatBlock = (tag: string) => {
    executeCommand('formatBlock', tag)
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className || ''}`}>
      {/* Toolbar - IMPROVED WITH LARGER ICONS */}
      <div className="border-b bg-gray-50 p-3 flex flex-wrap gap-2">
        {/* Headings Group */}
        <div className="flex gap-1 border-r pr-3 mr-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatBlock('h1')}
            className="h-10 w-10 p-0 hover:bg-gray-200"
            title="Heading 1"
          >
            <Heading1 className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatBlock('h2')}
            className="h-10 w-10 p-0 hover:bg-gray-200"
            title="Heading 2"
          >
            <Heading2 className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatBlock('h3')}
            className="h-10 w-10 p-0 hover:bg-gray-200"
            title="Heading 3"
          >
            <Heading3 className="h-5 w-5" />
          </Button>
        </div>

        {/* Text Formatting Group */}
        <div className="flex gap-1 border-r pr-3 mr-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => executeCommand('bold')}
            className="h-10 w-10 p-0 font-bold hover:bg-gray-200"
            title="Bold"
          >
            <Bold className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => executeCommand('italic')}
            className="h-10 w-10 p-0 hover:bg-gray-200"
            title="Italic"
          >
            <Italic className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => executeCommand('underline')}
            className="h-10 w-10 p-0 hover:bg-gray-200"
            title="Underline"
          >
            <Underline className="h-5 w-5" />
          </Button>
        </div>

        {/* Lists and Quote Group */}
        <div className="flex gap-1 border-r pr-3 mr-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => executeCommand('insertUnorderedList')}
            className="h-10 w-10 p-0 hover:bg-gray-200"
            title="Bullet List"
          >
            <List className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => executeCommand('insertOrderedList')}
            className="h-10 w-10 p-0 hover:bg-gray-200"
            title="Numbered List"
          >
            <ListOrdered className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatBlock('blockquote')}
            className="h-10 w-10 p-0 hover:bg-gray-200"
            title="Quote"
          >
            <Quote className="h-5 w-5" />
          </Button>
        </div>

        {/* Media and Code Group */}
        <div className="flex gap-1 border-r pr-3 mr-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertLink}
            className="h-10 w-10 p-0 hover:bg-gray-200"
            title="Insert Link"
          >
            <Link2 className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertImage}
            className="h-10 w-10 p-0 hover:bg-gray-200"
            title="Insert Image"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => executeCommand('formatBlock', 'pre')}
            className="h-10 w-10 p-0 hover:bg-gray-200"
            title="Code Block"
          >
            <Code className="h-5 w-5" />
          </Button>
        </div>

        {/* Actions Group */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => executeCommand('undo')}
            className="h-10 px-4 text-sm hover:bg-gray-200"
            title="Undo"
          >
            Undo
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => executeCommand('redo')}
            className="h-10 px-4 text-sm hover:bg-gray-200"
            title="Redo"
          >
            Redo
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none"
          style={{
            direction: 'ltr',
            textAlign: 'left',
            unicodeBidi: 'normal'
          }}
          data-placeholder={placeholder}
        />

        {!value && !isEditing && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none text-base">
            {placeholder || 'Start writing your content...'}
          </div>
        )}
      </div>
    </div>
  )
}