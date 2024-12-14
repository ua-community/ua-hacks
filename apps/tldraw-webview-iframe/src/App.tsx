import { Tldraw, Editor, TLRecord, createShapeId } from 'tldraw'
import 'tldraw/tldraw.css'
import { WebViewIFrameShape } from './WebViewIFrameShape'
import { useCallback } from 'react'

const customShapeUtils = [WebViewIFrameShape]

function App() {
  const handleMount = useCallback((editor: Editor) => {

    // Create a webview shape if none exists
    const webviewShapes = Object.values(editor.store.allRecords())
      .filter((record: TLRecord) => record.typeName === 'shape' && record.type === 'webview-iframe')
    
    if (webviewShapes.length === 0) {
      editor.createShape({
        id: createShapeId(),
        type: 'webview-iframe',
        x: 100,
        y: 100,
        props: {
          url: 'https://example.com',
          w: 600,
          h: 400,
        },
      })
    }
  }, [])
  
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw 
        persistenceKey="tldraw-webview-iframe"
        shapeUtils={customShapeUtils}
        onMount={handleMount}
      />
    </div>
  )
}

export default App
