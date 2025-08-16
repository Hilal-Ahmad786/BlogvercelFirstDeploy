// apps/admin/components/advanced-rich-text-editor.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Strikethrough,
  Table,
  Code2,
  Upload,
  X,
  Check,
  Minus
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onInsert: (imageData: { url: string; alt: string; caption?: string }) => void
}

function ImageUploadModal({ isOpen, onClose, onInsert }: ImageUploadModalProps) {
  const [imageUrl, setImageUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [caption, setCaption] = useState('')
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    if (imageUrl && altText) {
      onInsert({ url: imageUrl, alt: altText, caption })
      setImageUrl('')
      setAltText('')
      setCaption('')
      onClose()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      setAltText(file.name.split('.')[0])
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Insert Image</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={uploadMethod === 'url' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUploadMethod('url')}
            >
              URL
            </Button>
            <Button
              variant={uploadMethod === 'upload' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUploadMethod('upload')}
            >
              <Upload className="h-4 w-4 mr-1" />
              Upload
            </Button>
          </div>

          {uploadMethod === 'url' ? (
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="fileUpload">Choose Image File</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          <div>
            <Label htmlFor="altText">Alt Text (Required)</Label>
            <Input
              id="altText"
              placeholder="Describe the image for accessibility"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="caption">Caption (Optional)</Label>
            <Input
              id="caption"
              placeholder="Image caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          {imageUrl && (
            <div>
              <Label>Preview</Label>
              <img
                src={imageUrl}
                alt={altText}
                className="w-full h-32 object-cover rounded border"
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} disabled={!imageUrl || !altText}>
              <Check className="h-4 w-4 mr-1" />
              Insert Image
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdvancedRichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')

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
      const newContent = editorRef.current.innerHTML
      onChange(newContent)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
    handleInput()
  }

  const insertAdvancedImage = (imageData: { url: string; alt: string; caption?: string }) => {
    console.log('Inserting image:', imageData)
    
    // Focus the editor first
    editorRef.current?.focus()
    
    // Create the image HTML
    const imageHtml = imageData.caption 
      ? `<figure style="margin: 16px 0; text-align: center;">
           <img src="${imageData.url}" alt="${imageData.alt}" style="max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 0 auto;" />
           <figcaption style="text-align: center; font-style: italic; color: #666; margin-top: 8px; font-size: 14px;">${imageData.caption}</figcaption>
         </figure><p><br></p>`
      : `<img src="${imageData.url}" alt="${imageData.alt}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; display: block;" /><p><br></p>`
    
    try {
      // Method 1: Use document.execCommand
      const success = document.execCommand('insertHTML', false, imageHtml)
      console.log('execCommand success:', success)
      
      if (!success && editorRef.current) {
        // Method 2: Direct DOM manipulation
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          range.deleteContents()
          
          const tempDiv = document.createElement('div')
          tempDiv.innerHTML = imageHtml
          
          while (tempDiv.firstChild) {
            range.insertNode(tempDiv.firstChild)
          }
          
          range.collapse(false)
          selection.removeAllRanges()
          selection.addRange(range)
        } else {
          // Method 3: Append to editor content
          editorRef.current.innerHTML += imageHtml
        }
      }
      
      // Update the content state
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
      
      // Focus the editor again
      setTimeout(() => {
        editorRef.current?.focus()
      }, 100)
      
    } catch (error) {
      console.error('Error inserting image:', error)
      
      // Fallback: Just append to content
      if (editorRef.current) {
        editorRef.current.innerHTML += imageHtml
        onChange(editorRef.current.innerHTML)
      }
    }
  }

  const insertLink = () => {
    if (linkUrl && linkText) {
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">${linkText}</a>`
      document.execCommand('insertHTML', false, linkHtml)
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
      setLinkUrl('')
      setLinkText('')
      setShowLinkModal(false)
      editorRef.current?.focus()
    }
  }

  const formatBlock = (tag: string) => {
    executeCommand('formatBlock', tag)
  }

  const insertTable = () => {
    const tableHtml = `
      <table style="border-collapse: collapse; width: 100%; margin: 16px 0; border: 1px solid #e1e5e9;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #e1e5e9; padding: 12px; text-align: left; font-weight: 600;">Header 1</th>
            <th style="border: 1px solid #e1e5e9; padding: 12px; text-align: left; font-weight: 600;">Header 2</th>
            <th style="border: 1px solid #e1e5e9; padding: 12px; text-align: left; font-weight: 600;">Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #e1e5e9; padding: 12px;">Cell 1</td>
            <td style="border: 1px solid #e1e5e9; padding: 12px;">Cell 2</td>
            <td style="border: 1px solid #e1e5e9; padding: 12px;">Cell 3</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #e1e5e9; padding: 12px;">Cell 4</td>
            <td style="border: 1px solid #e1e5e9; padding: 12px;">Cell 5</td>
            <td style="border: 1px solid #e1e5e9; padding: 12px;">Cell 6</td>
          </tr>
        </tbody>
      </table><p><br></p>
    `
    document.execCommand('insertHTML', false, tableHtml)
    handleInput()
  }

  const insertDivider = () => {
    const dividerHtml = '<hr style="border: none; border-top: 2px solid #e5e5e5; margin: 32px 0; width: 100%;" /><p><br></p>'
    document.execCommand('insertHTML', false, dividerHtml)
    handleInput()
  }

  const insertCodeBlock = () => {
    const codeHtml = `
      <pre style="background-color: #f6f8fa; border: 1px solid #e1e5e9; border-radius: 6px; padding: 16px; margin: 16px 0; overflow-x: auto; font-family: 'Courier New', monospace;">
        <code>// Your code here
console.log('Hello, World!');

function example() {
  return 'This is a code block';
}
        </code>
      </pre><p><br></p>
    `
    document.execCommand('insertHTML', false, codeHtml)
    handleInput()
  }

  const insertCalloutBox = (type: 'info' | 'warning' | 'success' | 'error') => {
    const colors = {
      info: { bg: '#e7f3ff', border: '#3b82f6', icon: 'ℹ️', title: 'Info' },
      warning: { bg: '#fef3cd', border: '#f59e0b', icon: '⚠️', title: 'Warning' },
      success: { bg: '#d1fae5', border: '#10b981', icon: '✅', title: 'Success' },
      error: { bg: '#fee2e2', border: '#ef4444', icon: '❌', title: 'Error' }
    }
    
    const style = colors[type]
    const calloutHtml = `
      <div style="background-color: ${style.bg}; border-left: 4px solid ${style.border}; padding: 16px; margin: 16px 0; border-radius: 4px;">
        <div style="display: flex; align-items: flex-start; gap: 8px;">
          <span style="font-size: 18px; line-height: 1;">${style.icon}</span>
          <div style="flex: 1;">
            <strong style="color: ${style.border};">${style.title}:</strong> Add your important message here.
          </div>
        </div>
      </div><p><br></p>
    `
    document.execCommand('insertHTML', false, calloutHtml)
    handleInput()
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className || ''}`}>
      {/* Advanced Toolbar */}
      <div className="border-b bg-gray-50 p-3 space-y-2">
        {/* Row 1: Typography */}
        <div className="flex flex-wrap gap-2">
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => executeCommand('strikeThrough')}
              className="h-10 w-10 p-0 hover:bg-gray-200"
              title="Strikethrough"
            >
              <Strikethrough className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-1 border-r pr-3 mr-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => executeCommand('justifyLeft')}
              className="h-10 w-10 p-0 hover:bg-gray-200"
              title="Align Left"
            >
              <AlignLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => executeCommand('justifyCenter')}
              className="h-10 w-10 p-0 hover:bg-gray-200"
              title="Align Center"
            >
              <AlignCenter className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => executeCommand('justifyRight')}
              className="h-10 w-10 p-0 hover:bg-gray-200"
              title="Align Right"
            >
              <AlignRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => executeCommand('undo')}
              className="h-10 px-3 text-sm hover:bg-gray-200"
              title="Undo"
            >
              Undo
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => executeCommand('redo')}
              className="h-10 px-3 text-sm hover:bg-gray-200"
              title="Redo"
            >
              Redo
            </Button>
          </div>
        </div>

        {/* Row 2: Content Elements */}
        <div className="flex flex-wrap gap-2">
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

          <div className="flex gap-1 border-r pr-3 mr-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowImageModal(true)}
              className="h-10 w-10 p-0 hover:bg-gray-200"
              title="Insert Image"
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowLinkModal(true)}
              className="h-10 w-10 p-0 hover:bg-gray-200"
              title="Insert Link"
            >
              <Link2 className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={insertTable}
              className="h-10 w-10 p-0 hover:bg-gray-200"
              title="Insert Table"
            >
              <Table className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-1 border-r pr-3 mr-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={insertCodeBlock}
              className="h-10 w-10 p-0 hover:bg-gray-200"
              title="Code Block"
            >
              <Code2 className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={insertDivider}
              className="h-10 w-10 p-0 hover:bg-gray-200"
              title="Divider"
            >
              <Minus className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertCalloutBox('info')}
              className="h-10 px-3 text-sm hover:bg-gray-200"
              title="Info Box"
            >
              Info
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertCalloutBox('warning')}
              className="h-10 px-3 text-sm hover:bg-gray-200"
              title="Warning Box"
            >
              Warning
            </Button>
          </div>
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
            unicodeBidi: 'normal',
            lineHeight: '1.6'
          }}
        />

        {!value && !isEditing && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none text-base">
            {placeholder || 'Start writing your blog post... Use the toolbar to format your content.'}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageUploadModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onInsert={insertAdvancedImage}
      />

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Insert Link</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowLinkModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkText">Link Text</Label>
                <Input
                  id="linkText"
                  placeholder="Click here"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="linkUrl">URL</Label>
                <Input
                  id="linkUrl"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={insertLink} disabled={!linkUrl || !linkText}>
                  <Check className="h-4 w-4 mr-1" />
                  Insert Link
                </Button>
                <Button variant="outline" onClick={() => setShowLinkModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}