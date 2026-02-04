"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Video, FileText, ArrowRight, BookOpen, Play, Search, Filter, Target, TrendingUp, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { CardCustom } from "@/components/ui-custom/card-custom"
import { BadgeCustom } from "@/components/ui-custom/badge-custom"
import { ButtonCustom } from "@/components/ui-custom/button-custom"
import { LEARNING_RESOURCES, VIEW_TRANSITION, SKILL_GAPS } from "@/lib/data"
import { Progress } from "@/components/ui/progress"

export function ResourcesView() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Technical", "System Design", "Behavioral", "Backend"]

  const filteredResources = LEARNING_RESOURCES.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory || (selectedCategory === "Frontend" && resource.category === "Technical") // Mapping "Frontend" to Technical if not explicit, though we might want strict matching
    return matchesSearch && matchesCategory
  })

  const handleStartPractice = (skill: string) => {
    router.push(`/setup?focus=${encodeURIComponent(skill)}`)
  }

  const handleOpenResource = (url: string) => {
    if (url && url !== "#") {
      window.open(url, "_blank")
    }
  }

  const handleTopicClick = (topic: string) => {
    // Map topic to available categories or expand categories
    if (categories.includes(topic)) {
      setSelectedCategory(topic)
    } else {
      // For now, reset to All or handle specific mapping
      // Since our mock data is limited, we'll search for it
      setSearchQuery(topic)
      setSelectedCategory("All")
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const PlatformIcon = ({ platform }: { platform?: string }) => {
    switch (platform) {
      case "YouTube":
        return <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg"><Play className="w-4 h-4 fill-current" /></div>
      case "GeeksforGeeks":
        return <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-bold text-xs">GfG</div>
      case "Javatpoint":
        return <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-bold text-xs">JP</div>
      case "Official Docs":
        return <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><FileText className="w-4 h-4" /></div>
      case "Atlassian":
        return <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-lg font-bold text-xs">At</div>
      default:
        return <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg"><BookOpen className="w-4 h-4 text-neutral-500" /></div>
    }
  }

  return (
    <motion.div {...VIEW_TRANSITION} className="max-w-6xl mx-auto space-y-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">Learning Hub</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">
          Curated resources to bridge your skill gaps and accelerate your interview prep.
        </p>
      </header>

      <CardCustom className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">Your Learning Path</h2>
            <p className="text-sm text-neutral-500">Personalized recommendations based on your performance</p>
          </div>
          <BadgeCustom variant="neutral">AI-Powered</BadgeCustom>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILL_GAPS.slice(0, 3).map((skill) => (
            <div
              key={skill.skill}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm">{skill.skill}</span>
                <BadgeCustom
                  variant={skill.priority === "high" ? "warning" : skill.priority === "medium" ? "neutral" : "success"}
                >
                  {skill.priority}
                </BadgeCustom>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Current: {skill.current}%</span>
                  <span>Target: {skill.target}%</span>
                </div>
                <div className="relative">
                  <Progress value={skill.current} className="h-2" />
                  <div
                    className="absolute top-0 h-2 w-0.5 bg-neutral-900 dark:bg-white"
                    style={{ left: `${skill.target}%` }}
                  />
                </div>
              </div>
              <ButtonCustom
                variant="secondary"
                className="w-full mt-4 text-xs py-2"
                onClick={() => handleStartPractice(skill.skill)}
              >
                <Target className="w-3 h-3 mr-1" /> Start Practice
              </ButtonCustom>
            </div>
          ))}
        </div>
      </CardCustom>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${selectedCategory === cat
                ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                }`}
            >
              {cat === "All" && <Filter className="w-4 h-4" />}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Resource */}
      <CardCustom className="p-8 bg-neutral-900 text-white dark:bg-white dark:text-black relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <BadgeCustom variant="neutral" className="mb-4 bg-white/20 dark:bg-black/20 text-white dark:text-black">
              Featured
            </BadgeCustom>
            <h2 className="text-2xl font-bold mb-3">Complete System Design Masterclass</h2>
            <p className="text-white/70 dark:text-black/70 mb-4">
              A comprehensive guide covering all major system design concepts from basics to advanced distributed
              systems.
            </p>
            <div className="flex items-center gap-4 text-sm text-white/60 dark:text-black/60">
              <span className="flex items-center gap-1">
                <Video className="w-4 h-4" /> 12 videos
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> 3 hours
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> +15% avg improvement
              </span>
            </div>
          </div>
          <button
            className="p-4 bg-white/10 dark:bg-black/10 rounded-full hover:scale-110 transition-transform shrink-0"
            onClick={() => handleOpenResource("https://www.youtube.com/watch?v=SqcY0GlETPk")} // Example System Design Video
          >
            <Play className="w-8 h-8 fill-current" />
          </button>
        </div>
      </CardCustom>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource: any) => (
          <CardCustom
            key={resource.id}
            className="flex flex-col h-full hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer p-6"
            onClick={() => handleOpenResource(resource.url)}
          >
            <div className="flex justify-between items-start mb-4">
              <BadgeCustom variant="neutral">{resource.category}</BadgeCustom>
              <PlatformIcon platform={resource.platform} />
            </div>
            <h3 className="text-lg font-bold mb-3 leading-tight">{resource.title}</h3>
            <p className="text-sm text-neutral-500 mb-4 flex-1">{resource.reason}</p>
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900 flex justify-between items-center text-sm">
              <span className="text-neutral-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {resource.duration}
              </span>
              <span className="flex items-center gap-2 font-medium text-neutral-900 dark:text-white group">
                Start <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </CardCustom>
        ))}
      </div>

      {/* Explore Topics */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">Explore Topics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Algorithms", "System Design", "Behavioral", "Frontend", "Backend", "DevOps", "Security", "Mobile"].map(
            (topic) => (
              <div
                key={topic}
                onClick={() => handleTopicClick(topic)}
                className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer text-center font-semibold transition-colors hover:border-neutral-400 dark:hover:border-neutral-600"
              >
                {topic}
              </div>
            ),
          )}
        </div>
      </div>
    </motion.div >
  )
}
