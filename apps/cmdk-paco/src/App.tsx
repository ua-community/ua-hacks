import { useCallback, useState, useRef } from 'react'
import './cmdk/globals.scss'
import './cmdk/vercel.scss'
import { Command } from 'cmdk'

interface CommandEvent {
  type: string
  value?: string
  timestamp: number
}

const CommandMenu = () => {
  const [events, setEvents] = useState<CommandEvent[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Log events to state
  const logEvent = useCallback((type: string, value?: string) => {
    setEvents(prev => [{
      type,
      value,
      timestamp: Date.now()
    }, ...prev].slice(0, 10))
  }, [])

  // Event handlers
  const handleInput = useCallback((value: string) => {
    setInputValue(value)
    logEvent('input', value)
  }, [logEvent])

  const handleSelect = useCallback((value: string) => {
    logEvent('select', value)
    // Here you can add logic to handle different commands
    console.log('Selected:', value)
  }, [logEvent])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      logEvent('execute', inputValue)
      // Here you can add logic to execute commands
      console.log('Execute:', inputValue)
    }
  }, [inputValue, logEvent])

  // Voice input handlers
  const startListening = useCallback(() => {
    try {
      if (!('webkitSpeechRecognition' in window)) {
        alert('Speech recognition is not supported in this browser.')
        return
      }

      const SpeechRecognition = window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
        logEvent('voice', 'started listening')
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputValue(transcript)
        logEvent('voice', transcript)
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error)
        logEvent('voice-error', event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
        logEvent('voice', 'stopped listening')
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (error) {
      console.error('Speech recognition error:', error)
      setIsListening(false)
    }
  }, [logEvent])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  const toggleVoiceInput = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return (
    <div className="command-interface">
      <div className="command-wrapper">
        <Command 
          label="Command Menu"
          onKeyDown={handleKeyDown}
        >
          <div className="input-wrapper">
            <Command.Input 
              value={inputValue}
              onValueChange={handleInput}
              placeholder="Type a command or search..."
            />
            <button 
              className={`voice-input-button ${isListening ? 'listening' : ''}`}
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop voice input' : 'Start voice input'}
            >
              <MicrophoneIcon />
            </button>
          </div>
          <Command.List>
            <Command.Empty>No results found.</Command.Empty>
            
            <Command.Group heading="Actions">
              <Command.Item value="new" onSelect={handleSelect}>
                Create New
              </Command.Item>
              <Command.Item value="open" onSelect={handleSelect}>
                Open File
              </Command.Item>
              <Command.Separator />
              <Command.Item value="help" onSelect={handleSelect}>
                Help
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Tools">
              <Command.Item value="search" onSelect={handleSelect}>
                Search
              </Command.Item>
              <Command.Item value="settings" onSelect={handleSelect}>
                Settings
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>

      <div className="event-log">
        <h3>Event Log</h3>
        <div className="events">
          {events.map((event) => (
            <div key={event.timestamp} className="event">
              <span className="event-type">{event.type}</span>
              {event.value && <span className="event-value">{event.value}</span>}
              <span className="event-time">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Microphone icon component
const MicrophoneIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
)

function App() {
  return (
    <div className="vercel">
      <CommandMenu />
    </div>
  )
}

export default App
