'use client'

import { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Bold, 
  Italic, 
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Type,
  Eye,
  Edit3,
  Save
} from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

type CommandType = string | (() => void)

interface ToolbarButton {
  icon: any
  command?: CommandType
  title: string
  type?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Start writing...", className = "" }: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const formatBlock = useCallback((tag: string) => {
    execCommand('formatBlock', tag)
  }, [execCommand])

  const insertImage = useCallback(() => {
    const url = prompt('Enter image URL:')
    if (url) {
      execCommand('insertImage', url)
    }
  }, [execCommand])

  const insertLink = useCallback(() => {
    const selection = window.getSelection()
    if (selection && selection.toString()) {
      setLinkText(selection.toString())
    }
    setShowLinkDialog(true)
  }, [])

  const handleLinkInsert = useCallback(() => {
    if (linkText && linkUrl) {
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${linkText}</a>`
      execCommand('insertHTML', linkHtml)
    }
    setShowLinkDialog(false)
    setLinkUrl('')
    setLinkText('')
  }, [linkText, linkUrl, execCommand])

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const handleButtonClick = (command: CommandType | undefined) => {
    if (!command) return
    
    if (typeof command === 'string') {
      execCommand(command)
    } else {
      command()
    }
  }

  const toolbarButtons: ToolbarButton[] = [
    { icon: Undo, command: 'undo', title: 'Undo (Ctrl+Z)' },
    { icon: Redo, command: 'redo', title: 'Redo (Ctrl+Y)' },
    { type: 'separator', icon: null, title: '' },
    { icon: Heading1, command: () => formatBlock('h1'), title: 'Heading 1' },
    { icon: Heading2, command: () => formatBlock('h2'), title: 'Heading 2' },
    { icon: Heading3, command: () => formatBlock('h3'), title: 'Heading 3' },
    { icon: Type, command: () => formatBlock('p'), title: 'Paragraph' },
    { type: 'separator', icon: null, title: '' },
    { icon: Bold, command: 'bold', title: 'Bold (Ctrl+B)' },
    { icon: Italic, command: 'italic', title: 'Italic (Ctrl+I)' },
    { icon: Underline, command: 'underline', title: 'Underline (Ctrl+U)' },
    { icon: Strikethrough, command: 'strikeThrough', title: 'Strikethrough' },
    { type: 'separator', icon: null, title: '' },
    { icon: AlignLeft, command: () => execCommand('justifyLeft'), title: 'Align Left' },
    { icon: AlignCenter, command: () => execCommand('justifyCenter'), title: 'Align Center' },
    { icon: AlignRight, command: () => execCommand('justifyRight'), title: 'Align Right' },
    { type: 'separator', icon: null, title: '' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: Quote, command: () => formatBlock('blockquote'), title: 'Quote' },
    { icon: Code, command: () => formatBlock('pre'), title: 'Code Block' },
    { type: 'separator', icon: null, title: '' },
    { icon: Link, command: insertLink, title: 'Insert Link (Ctrl+K)' },
    { icon: Image, command: insertImage, title: 'Insert Image' },
  ]

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-lg">Content Editor</CardTitle>
              {isSaving && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Save className="h-4 w-4 animate-pulse" />
                  <span>Auto-saving...</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={!isPreview ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsPreview(false)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant={isPreview ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsPreview(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>

          {!isPreview && (
            <div className="flex flex-wrap gap-1 pt-3 border-t border-border">
              {toolbarButtons.map((button, index) => {
                if (button.type === 'separator') {
                  return <div key={index} className="w-px h-6 bg-border mx-1" />
                }

                const Icon = button.icon
                if (!Icon) return null

                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                    onClick={() => handleButtonClick(button.command)}
                    title={button.title}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                )
              })}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {isPreview ? (
            <div className="min-h-96 p-4 border border-border rounded-lg bg-background">
              <div 
                className="prose prose-lg max-w-none dark:prose-invert prose-headings:gradient-text prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          ) : (
            <div
              ref={editorRef}
              contentEditable
              className="min-h-96 p-4 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent prose prose-lg max-w-none dark:prose-invert"
              onInput={handleContentChange}
              dangerouslySetInnerHTML={{ __html: content }}
              data-placeholder={placeholder}
              style={{
                minHeight: '24rem',
              }}
            />
          )}

          {/* Link Dialog */}
          {showLinkDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md glass">
                <CardHeader>
                  <CardTitle>Insert Link</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Link Text</label>
                    <Input
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      placeholder="Enter link text..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">URL</label>
                    <Input
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowLinkDialog(false)
                        setLinkUrl('')
                        setLinkText('')
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleLinkInsert}>
                      Insert Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Word Count Component
export function WordCount({ content }: { content: string }) {
  const getWordCount = (html: string) => {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    return text ? text.split(' ').length : 0
  }

  const getCharCount = (html: string) => {
    return html.replace(/<[^>]*>/g, '').length
  }

  const getReadingTime = (html: string) => {
    const wordCount = getWordCount(html)
    const wordsPerMinute = 200
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const readingTime = getReadingTime(content)

  return (
    <Card className="glass">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              {getWordCount(content)} words
            </span>
            <span>{getCharCount(content)} characters</span>
            <span className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {readingTime} min read
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Press Ctrl+B for bold, Ctrl+I for italic, Ctrl+K for links
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
