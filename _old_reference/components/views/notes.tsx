"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Trash2, Edit3, Save, X, FileText, Clock } from "lucide-react"
import { CardCustom } from "@/components/ui-custom/card-custom"
import { ButtonCustom } from "@/components/ui-custom/button-custom"
import { BadgeCustom } from "@/components/ui-custom/badge-custom"
import { VIEW_TRANSITION, type Note } from "@/lib/data"
import { getNotes, saveNotes } from "@/lib/storage"

const CATEGORIES = ["All", "Technical", "Behavioral", "System Design", "General"]

export function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [editCategory, setEditCategory] = useState("General")

  useEffect(() => {
    setNotes(getNotes())
  }, [])

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || note.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      category: "General",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updated = [newNote, ...notes]
    setNotes(updated)
    saveNotes(updated)
    setSelectedNote(newNote)
    setEditTitle(newNote.title)
    setEditContent(newNote.content)
    setEditCategory(newNote.category)
    setIsEditing(true)
  }

  const saveNote = () => {
    if (!selectedNote) return
    const updated = notes.map((n) =>
      n.id === selectedNote.id
        ? { ...n, title: editTitle, content: editContent, category: editCategory, updatedAt: new Date().toISOString() }
        : n,
    )
    setNotes(updated)
    saveNotes(updated)
    setSelectedNote({ ...selectedNote, title: editTitle, content: editContent, category: editCategory })
    setIsEditing(false)
  }

  const deleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id)
    setNotes(updated)
    saveNotes(updated)
    if (selectedNote?.id === id) {
      setSelectedNote(null)
      setIsEditing(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <motion.div {...VIEW_TRANSITION} className="h-[calc(100vh-100px)] flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">Notes</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">
          Capture insights, prepare answers, and track your learning journey.
        </p>
      </header>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Notes List */}
        <div className="w-80 shrink-0 flex flex-col">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white outline-none"
              />
            </div>
            <ButtonCustom onClick={createNewNote} className="px-4">
              <Plus className="w-4 h-4" />
            </ButtonCustom>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-sm">No notes yet. Create one to get started.</p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNote(note)
                    setEditTitle(note.title)
                    setEditContent(note.content)
                    setEditCategory(note.category)
                    setIsEditing(false)
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedNote?.id === note.id
                      ? "border-neutral-900 bg-neutral-50 dark:border-white dark:bg-neutral-900"
                      : "border-neutral-100 hover:border-neutral-200 dark:border-neutral-800 dark:hover:border-neutral-700"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm truncate flex-1">{note.title}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNote(note.id)
                      }}
                      className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{note.content || "No content"}</p>
                  <div className="flex items-center justify-between">
                    <BadgeCustom variant="default">{note.category}</BadgeCustom>
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Note Editor */}
        <CardCustom className="flex-1 flex flex-col min-h-0 p-0 overflow-hidden">
          {selectedNote ? (
            <>
              <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-xl font-semibold bg-transparent outline-none flex-1 mr-4"
                    placeholder="Note title..."
                  />
                ) : (
                  <h2 className="text-xl font-semibold">{selectedNote.title}</h2>
                )}
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <ButtonCustom variant="secondary" onClick={() => setIsEditing(false)} className="px-4">
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </ButtonCustom>
                      <ButtonCustom onClick={saveNote} className="px-4">
                        <Save className="w-4 h-4 mr-1" /> Save
                      </ButtonCustom>
                    </>
                  ) : (
                    <ButtonCustom onClick={() => setIsEditing(true)} className="px-4">
                      <Edit3 className="w-4 h-4 mr-1" /> Edit
                    </ButtonCustom>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="px-6 py-3 border-b border-neutral-100 dark:border-neutral-800 flex gap-2">
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setEditCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        editCategory === cat
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-6">
                {isEditing ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-full resize-none bg-transparent outline-none text-sm leading-relaxed"
                    placeholder="Write your notes here..."
                  />
                ) : (
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {selectedNote.content || "This note is empty. Click edit to add content."}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-500">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium mb-2">No note selected</p>
                <p className="text-sm">Select a note from the list or create a new one</p>
              </div>
            </div>
          )}
        </CardCustom>
      </div>
    </motion.div>
  )
}
