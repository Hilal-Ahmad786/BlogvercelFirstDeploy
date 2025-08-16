// apps/admin/components/blog-content-blocks.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Image, 
  Video, 
  Quote, 
  Code, 
  List, 
  FileText,
  ExternalLink,
  Download,
  MessageSquare,
  Star,
  TrendingUp,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Info,
  Zap
} from 'lucide-react'

interface ContentBlock {
  id: string
  type: string
  content: any
}

interface BlogContentBlocksProps {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
}

export function BlogContentBlocks({ blocks, onChange }: BlogContentBlocksProps) {
  const [selectedBlockType, setSelectedBlockType] = useState<string>('')

  const addBlock = (type: string) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type)
    }
    onChange([...blocks, newBlock])
    setSelectedBlockType('')
  }

  const updateBlock = (id: string, content: any) => {
    const updatedBlocks = blocks.map(block => 
      block.id === id ? { ...block, content } : block
    )
    onChange(updatedBlocks)
  }

  const removeBlock = (id: string) => {
    onChange(blocks.filter(block => block.id !== id))
  }

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(block => block.id === id)
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < blocks.length - 1)
    ) {
      const newBlocks = [...blocks]
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      ;[newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]]
      onChange(newBlocks)
    }
  }

  function getDefaultContent(type: string) {
    switch (type) {
      case 'paragraph':
        return { text: 'Start writing your paragraph here...' }
      case 'heading':
        return { text: 'Your Heading', level: 2 }
      case 'image':
        return { url: '', alt: '', caption: '', width: '100%' }
      case 'quote':
        return { text: 'Your inspirational quote here...', author: 'Author Name' }
      case 'code':
        return { code: '// Your code here\nconsole.log("Hello World!");', language: 'javascript' }
      case 'callout':
        return { text: 'Important information here...', type: 'info', title: 'Note' }
      case 'list':
        return { items: ['Item 1', 'Item 2', 'Item 3'], ordered: false }
      case 'embed':
        return { url: '', type: 'youtube', title: 'Embedded Content' }
      case 'divider':
        return { style: 'line' }
      case 'button':
        return { text: 'Click Here', url: '', style: 'primary' }
      default:
        return {}
    }
  }

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <div className="space-y-2">
            <Textarea
              value={block.content.text}
              onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
              placeholder="Write your paragraph..."
              className="min-h-[100px]"
            />
          </div>
        )

      case 'heading':
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                value={block.content.level}
                onChange={(e) => updateBlock(block.id, { ...block.content, level: parseInt(e.target.value) })}
                className="p-2 border rounded"
              >
                <option value={1}>H1</option>
                <option value={2}>H2</option>
                <option value={3}>H3</option>
                <option value={4}>H4</option>
              </select>
              <Input
                value={block.content.text}
                onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
                placeholder="Heading text..."
                className="flex-1"
              />
            </div>
          </div>
        )

      case 'image':
        return (
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Image URL</Label>
                <Input
                  value={block.content.url}
                  onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label>Alt Text</Label>
                <Input
                  value={block.content.alt}
                  onChange={(e) => updateBlock(block.id, { ...block.content, alt: e.target.value })}
                  placeholder="Image description"
                />
              </div>
            </div>
            <div>
              <Label>Caption (Optional)</Label>
              <Input
                value={block.content.caption}
                onChange={(e) => updateBlock(block.id, { ...block.content, caption: e.target.value })}
                placeholder="Image caption"
              />
            </div>
            <div>
              <Label>Width</Label>
              <select
                value={block.content.width}
                onChange={(e) => updateBlock(block.id, { ...block.content, width: e.target.value })}
                className="p-2 border rounded w-full"
              >
                <option value="100%">Full Width</option>
                <option value="75%">75% Width</option>
                <option value="50%">50% Width</option>
                <option value="25%">25% Width</option>
              </select>
            </div>
            {block.content.url && (
              <div className="mt-2">
                <img 
                  src={block.content.url} 
                  alt={block.content.alt}
                  style={{ width: block.content.width, maxWidth: '100%' }}
                  className="rounded border"
                />
                {block.content.caption && (
                  <p className="text-sm text-gray-600 text-center mt-1 italic">
                    {block.content.caption}
                  </p>
                )}
              </div>
            )}
          </div>
        )

      case 'quote':
        return (
          <div className="space-y-2">
            <Textarea
              value={block.content.text}
              onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
              placeholder="Enter your quote..."
              className="min-h-[80px]"
            />
            <Input
              value={block.content.author}
              onChange={(e) => updateBlock(block.id, { ...block.content, author: e.target.value })}
              placeholder="Author name"
            />
          </div>
        )

      case 'code':
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                value={block.content.language}
                onChange={(e) => updateBlock(block.id, { ...block.content, language: e.target.value })}
                className="p-2 border rounded"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
                <option value="bash">Bash</option>
              </select>
            </div>
            <Textarea
              value={block.content.code}
              onChange={(e) => updateBlock(block.id, { ...block.content, code: e.target.value })}
              placeholder="Enter your code..."
              className="font-mono min-h-[120px]"
            />
          </div>
        )

      case 'callout':
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                value={block.content.type}
                onChange={(e) => updateBlock(block.id, { ...block.content, type: e.target.value })}
                className="p-2 border rounded"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="tip">Tip</option>
              </select>
              <Input
                value={block.content.title}
                onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                placeholder="Callout title"
                className="flex-1"
              />
            </div>
            <Textarea
              value={block.content.text}
              onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
              placeholder="Callout content..."
              className="min-h-[80px]"
            />
          </div>
        )

      case 'list':
        return (
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={block.content.ordered}
                  onChange={(e) => updateBlock(block.id, { ...block.content, ordered: e.target.checked })}
                />
                <span>Numbered List</span>
              </label>
            </div>
            <div className="space-y-2">
              {block.content.items.map((item: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...block.content.items]
                      newItems[index] = e.target.value
                      updateBlock(block.id, { ...block.content, items: newItems })
                    }}
                    placeholder={`Item ${index + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = block.content.items.filter((_: any, i: number) => i !== index)
                      updateBlock(block.id, { ...block.content, items: newItems })
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newItems = [...block.content.items, '']
                  updateBlock(block.id, { ...block.content, items: newItems })
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
          </div>
        )

      case 'embed':
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                value={block.content.type}
                onChange={(e) => updateBlock(block.id, { ...block.content, type: e.target.value })}
                className="p-2 border rounded"
              >
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
                <option value="codepen">CodePen</option>
                <option value="iframe">Custom iFrame</option>
              </select>
              <Input
                value={block.content.title}
                onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                placeholder="Embed title"
                className="flex-1"
              />
            </div>
            <Input
              value={block.content.url}
              onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
              placeholder="Embed URL or ID"
            />
          </div>
        )

      case 'button':
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={block.content.text}
                onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
                placeholder="Button text"
              />
              <Input
                value={block.content.url}
                onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                placeholder="Button URL"
              />
            </div>
            <select
              value={block.content.style}
              onChange={(e) => updateBlock(block.id, { ...block.content, style: e.target.value })}
              className="p-2 border rounded w-full"
            >
              <option value="primary">Primary Button</option>
              <option value="secondary">Secondary Button</option>
              <option value="outline">Outline Button</option>
              <option value="ghost">Ghost Button</option>
            </select>
          </div>
        )

      default:
        return <div>Unknown block type</div>
    }
  }

  const blockTypes = [
    { type: 'paragraph', label: 'Paragraph', icon: FileText },
    { type: 'heading', label: 'Heading', icon: FileText },
    { type: 'image', label: 'Image', icon: Image },
    { type: 'quote', label: 'Quote', icon: Quote },
    { type: 'code', label: 'Code Block', icon: Code },
    { type: 'callout', label: 'Callout Box', icon: AlertCircle },
    { type: 'list', label: 'List', icon: List },
    { type: 'embed', label: 'Embed', icon: Video },
    { type: 'divider', label: 'Divider', icon: FileText },
    { type: 'button', label: 'Button', icon: ExternalLink },
  ]

  return (
    <div className="space-y-4">
      {/* Block Addition Menu */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-medium mb-3">Add Content Block</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {blockTypes.map(({ type, label, icon: Icon }) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => addBlock(type)}
              className="flex flex-col h-16 gap-1"
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Render Blocks */}
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div key={block.id} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium capitalize">{block.type} Block</span>
                <span className="text-xs text-gray-500">#{index + 1}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveBlock(block.id, 'up')}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveBlock(block.id, 'down')}
                  disabled={index === blocks.length - 1}
                >
                  ↓
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBlock(block.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  ✕
                </Button>
              </div>
            </div>
            
            {renderBlock(block)}
          </div>
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No content blocks yet. Add your first block above!</p>
        </div>
      )}
    </div>
  )
}