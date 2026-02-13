"use client"

import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  StickyNote, 
  Calendar,
  Tag
} from "lucide-react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

// Client-side types (avoiding server imports)
const NOTE_CATEGORIES = [
  { value: "general", label: "General", description: "General notes and thoughts" },
  { value: "algorithm", label: "Algorithms", description: "Algorithm concepts and solutions" },
  { value: "system-design", label: "System Design", description: "Architecture and design patterns" },
  { value: "behavioral", label: "Behavioral", description: "Behavioral interview preparation" },
  { value: "interview-prep", label: "Interview Prep", description: "Interview strategies and tips" },
] as const

type Note = {
  _id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

type CreateNoteData = {
  title: string
  content: string
  category: string
  tags: string[]
}

export default function NotesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTag, setSelectedTag] = useState("")
  
  // Create/Edit form state
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [formData, setFormData] = useState<CreateNoteData>({
    title: "",
    content: "",
    category: "general",
    tags: []
  })
  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      loadNotes()
    }
  }, [status, router])

  const loadNotes = async (params?: { category?: string; tag?: string; search?: string }) => {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.category && params.category !== "all") {
        queryParams.append("category", params.category)
      }
      if (params?.tag) queryParams.append("tag", params.tag)
      if (params?.search) queryParams.append("search", params.search)

      const response = await fetch(`/api/notes?${queryParams.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setNotes(data.notes)
      }
    } catch (err) {
      console.error("Failed to load notes:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadNotes({ 
      category: selectedCategory, 
      tag: selectedTag,
      search: searchTerm 
    })
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    loadNotes({ 
      category,
      tag: selectedTag,
      search: searchTerm 
    })
  }

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag)
    loadNotes({ 
      category: selectedCategory, 
      tag,
      search: searchTerm 
    })
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "general", 
      tags: []
    })
    setEditingNote(null)
    setShowForm(false)
    setTagInput("")
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) return

    try {
      const method = editingNote ? "PUT" : "POST"
      const url = editingNote ? `/api/notes?id=${editingNote._id}` : "/api/notes"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        resetForm()
        loadNotes({ 
          category: selectedCategory, 
          tag: selectedTag,
          search: searchTerm 
        })
      }
    } catch (err) {
      console.error("Failed to save note:", err)
    }
  }

  const handleEdit = (note: Note) => {
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags
    })
    setEditingNote(note)
    setShowForm(true)
  }

  const handleDelete = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return

    try {
      const response = await fetch(`/api/notes?id=${noteId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        loadNotes({ 
          category: selectedCategory, 
          tag: selectedTag,
          search: searchTerm 
        })
      }
    } catch (err) {
      console.error("Failed to delete note:", err)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "algorithm": return "bg-blue-900/30 text-blue-300 border border-blue-600/30"
      case "system-design": return "bg-orange-900/30 text-orange-300 border border-orange-600/30"
      case "behavioral": return "bg-green-900/30 text-green-300 border border-green-600/30"
      case "interview-prep": return "bg-purple-900/30 text-purple-300 border border-purple-600/30"
      case "general": return "bg-neutral-700 text-neutral-300 border border-neutral-600"
      default: return "bg-neutral-700 text-neutral-300 border border-neutral-600"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    })
  }

  // Get unique tags from all notes for filter
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags))).sort()

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-neutral-900 -m-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-900 -m-8">
      <div className="max-w-7xl mx-auto p-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <StickyNote className="h-8 w-8 text-blue-400" />
                Notes
              </h1>
              <p className="text-neutral-400">
                Organize your interview preparation notes and key insights
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {showForm ? "Cancel" : "New Note"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 pr-4 py-2 w-full bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-neutral-400"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="py-2 px-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              >
                <option value="all">All Categories</option>
                {NOTE_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              {/* Tag Filter */}
              <select
                value={selectedTag}
                onChange={(e) => handleTagFilter(e.target.value)}
                className="py-2 px-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between text-sm text-neutral-400">
              <span>{notes.length} notes</span>
              {(searchTerm || selectedCategory !== "all" || selectedTag) && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedTag("")
                    loadNotes()
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="mb-8">
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                {editingNote ? "Edit Note" : "Create New Note"}
              </h2>
              
              <div className="space-y-4">
                {/* Title */}
                <input
                  type="text"
                  placeholder="Note title..."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full py-2 px-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-neutral-400"
                />

                {/* Category */}
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full py-2 px-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  {NOTE_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>

                {/* Tags */}
                <div>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      className="flex-1 py-2 px-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-neutral-400"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-700 text-neutral-300 rounded border border-neutral-600"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="text-neutral-400 hover:text-red-400"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <textarea
                  placeholder="Write your note content..."
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="w-full py-2 px-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-neutral-400"
                />

                {/* Form Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={!formData.title.trim() || !formData.content.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {editingNote ? "Update" : "Save"} Note
                  </button>
                  <button
                    onClick={resetForm}
                    className="bg-neutral-600 hover:bg-neutral-700 text-neutral-300 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        {notes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div key={note._id} className="bg-neutral-800 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-colors">
                <div className="p-6">
                  {/* Note Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white truncate flex-1">
                      {note.title}
                    </h3>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(note)}
                        className="p-1 text-neutral-400 hover:text-blue-400 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="p-1 text-neutral-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Category */}
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${getCategoryColor(note.category)}`}>
                    {NOTE_CATEGORIES.find(cat => cat.value === note.category)?.label || note.category}
                  </span>

                  {/* Content Preview */}
                  <p className="text-neutral-300 text-sm mb-4 line-clamp-4">
                    {note.content}
                  </p>

                  {/* Tags */}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {note.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-700 text-neutral-300 rounded text-xs cursor-pointer hover:bg-neutral-600 transition-colors border border-neutral-600"
                          onClick={() => handleTagFilter(tag)}
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="text-xs text-neutral-400">
                          +{note.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-1 text-xs text-neutral-400">
                    <Calendar className="h-3 w-3" />
                    {formatDate(note.updatedAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {notes.length === 0 && !loading && (
          <div className="text-center py-12">
            <StickyNote className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {searchTerm || selectedCategory !== "all" || selectedTag ? "No notes found" : "No notes yet"}
            </h3>
            <p className="text-neutral-400 mb-6">
              {searchTerm || selectedCategory !== "all" || selectedTag 
                ? "Try adjusting your search or filters"
                : "Create your first note to start organizing your interview preparation"
              }
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Create Note
            </button>
          </div>
        )}
      </div>
    </div>
  )
}