// Enhanced User Flow Implementation

// 1. Onboarding Flow
interface OnboardingStep {
  id: string
  title: string
  description: string
  component: React.ComponentType
  optional: boolean
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to InterviewAce',
    description: 'Let\'s set up your personalized interview experience',
    component: WelcomeStep,
    optional: false
  },
  {
    id: 'role-setup',
    title: 'Your Target Role',
    description: 'Tell us about the role you\'re preparing for',
    component: RoleSetupStep,
    optional: false
  },
  {
    id: 'experience-level',
    title: 'Experience Level',
    description: 'Help us tailor questions to your skill level',
    component: ExperienceLevelStep,
    optional: false
  },
  {
    id: 'preferences',
    title: 'Interview Preferences',
    description: 'Customize your interview settings',
    component: PreferencesStep,
    optional: true
  }
]

// 2. Session State Management
interface SessionState {
  currentStep: 'setup' | 'interview' | 'review'
  config?: InterviewConfig
  messages: Message[]
  startTime: number
  pausedTime?: number
  elapsedTime: number
}

export function useSessionState() {
  const [state, setState] = useState<SessionState | null>(null)
  
  useEffect(() => {
    // Restore session from localStorage on mount
    const saved = localStorage.getItem('active-interview-session')
    if (saved) {
      try {
        setState(JSON.parse(saved))
      } catch (e) {
        console.warn('Failed to restore session state')
      }
    }
  }, [])
  
  const saveState = useCallback((newState: SessionState) => {
    setState(newState)
    localStorage.setItem('active-interview-session', JSON.stringify(newState))
  }, [])
  
  const clearState = useCallback(() => {
    setState(null)
    localStorage.removeItem('active-interview-session')
  }, [])
  
  return { state, saveState, clearState }
}

// 3. Progress Tracking
interface UserProgress {
  sessionsCompleted: number
  skillLevels: Record<string, number>
  achievements: Achievement[]
  streakDays: number
  lastSessionDate: string
}

export const ACHIEVEMENTS = [
  {
    id: 'first-session',
    title: 'Getting Started',
    description: 'Complete your first interview session',
    icon: '🎯',
    requirement: (progress: UserProgress) => progress.sessionsCompleted >= 1
  },
  {
    id: 'week-streak',
    title: 'Consistent Practice',
    description: 'Practice for 7 consecutive days',
    icon: '🔥',
    requirement: (progress: UserProgress) => progress.streakDays >= 7
  },
  {
    id: 'high-scorer',
    title: 'Excellence',
    description: 'Score 90+ on a session',
    icon: '⭐',
    requirement: (progress: UserProgress) => 
      Object.values(progress.skillLevels).some(level => level >= 90)
  }
]