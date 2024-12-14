import { BaseBoxShapeUtil, TLBaseShape, HTMLContainer, toDomPrecision, Rectangle2d } from 'tldraw'

// Define the shape's props type
export type WebViewIFrameShapeProps = {
  url: string
  w: number
  h: number
}

// Define the shape type
export type TLWebViewIFrameShape = TLBaseShape<'webview-iframe', WebViewIFrameShapeProps>

// Create the shape util
export class WebViewIFrameShape extends BaseBoxShapeUtil<TLWebViewIFrameShape> {
  static type = 'webview-iframe' as const

  getDefaultProps(): WebViewIFrameShapeProps {
    return {
      url: 'about:blank',
      w: 600,
      h: 400,
    }
  }

  getBounds(shape: TLWebViewIFrameShape): Rectangle2d {
    return new Rectangle2d({
      x: shape.x,
      y: shape.y,
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true
    })
  }

  component(shape: TLWebViewIFrameShape) {
    const bounds = this.getBounds(shape)
    
    return (
      <HTMLContainer
        id={shape.id}
        style={{
          width: toDomPrecision(bounds.bounds.width),
          height: toDomPrecision(bounds.bounds.height),
        }}
      >
        <div 
          style={{ 
            width: '100%', 
            height: '100%',
            background: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 0 0 1px rgba(0,0,0,.05), 0 3px 8px rgba(0,0,0,.15)',
          }}
        >
          <iframe
            src={shape.props.url}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            sandbox="allow-scripts allow-same-origin allow-forms"
            referrerPolicy="no-referrer"
          />
        </div>
      </HTMLContainer>
    )
  }

  indicator(shape: TLWebViewIFrameShape) {
    return this.getBounds(shape)
  }

  canResize = () => true
  canBind = () => false
} 