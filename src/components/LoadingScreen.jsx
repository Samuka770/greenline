import React from 'react';
import '../styles/loading.css';

export default function LoadingScreen({ label = 'Carregando…', fullscreen = false, size = 88, variant = 'satellite' }) {
  return (
    <div className={fullscreen ? 'loading-screen fullscreen' : 'loading-screen inline'} role="status" aria-live="polite">
      <div className="loading-inner">
        {variant === 'forest' ? (
          <div className="forest-loader" style={{ ['--sz']: `${size}px` }} aria-hidden="true">
            <div className="fog" />
            <div className="leaf-ring">
              {Array.from({ length: 12 }).map((_, i) => (
                <span className="leaf" key={`leaf-${i}`} style={{ ['--i']: i }} />
              ))}
            </div>
            <div className="fireflies">
              {Array.from({ length: 8 }).map((_, i) => (
                <span className="fly" key={`fly-${i}`} />
              ))}
            </div>
          </div>
        ) : (
          <div className="satellite-loader" style={{ ['--sz']: `${size}px` }} aria-hidden="true">
            <div className="space-bg" />
            <div className="planet-rings" />
            <div className="earth">
              <div className="earth-glow" />
              <div className="earth-core" />
              {/* Continents as simple SVG blobs (keeps performance and clarity at small sizes) */}
              <svg className="continents" viewBox="0 0 100 100" focusable="false" aria-hidden="true">
                <g className="land">
                  {/* Africa + Europe (center-right) */}
                  <ellipse cx="60" cy="56" rx="10.5" ry="13.5"/>
                  <ellipse cx="60" cy="43" rx="5.2" ry="4.6"/>
                  <ellipse cx="66.5" cy="58" rx="6.2" ry="7.6"/>
                  <ellipse cx="54" cy="60" rx="7.4" ry="9.4"/>
                  {/* South America (left-bottom) */}
                  <ellipse cx="42" cy="74" rx="6.4" ry="8.2"/>
                  <ellipse cx="45" cy="83" rx="3.6" ry="4.8"/>
                  {/* North America (left-top) */}
                  <ellipse cx="34.5" cy="44" rx="11.8" ry="9.2"/>
                  <ellipse cx="27" cy="39.5" rx="4.6" ry="3.2"/>
                  {/* Asia (top-right) */}
                  <ellipse cx="74" cy="41.5" rx="12.2" ry="9.8"/>
                  <ellipse cx="78" cy="52.5" rx="9.2" ry="7.2"/>
                  {/* Australia (bottom-right) */}
                  <ellipse cx="80.5" cy="75.5" rx="5.6" ry="3.4"/>
                  {/* Greenland (top-left) */}
                  <ellipse cx="38" cy="24.5" rx="4.2" ry="3.6"/>
                </g>
              </svg>
              <div className="cloud-patches">
                {[
                  { w: 18, h: 8, x: 42, y: 28 },
                  { w: 24, h: 10, x: 56, y: 30 },
                  { w: 20, h: 10, x: 50, y: 50 },
                  { w: 14, h: 8, x: 38, y: 56 },
                  { w: 22, h: 10, x: 62, y: 52 },
                  { w: 16, h: 8, x: 52, y: 62 },
                ].map((p, i) => (
                  <span
                    key={`cloud-${i}`}
                    className="patch cloud"
                    style={{ ['--w']: `${p.w}%`, ['--h']: `${p.h}%`, ['--x']: `${p.x}%`, ['--y']: `${p.y}%` }}
                  />
                ))}
              </div>
              <div className="clouds" />
              <div className="terminator" />
            </div>
            <div className="orbit">
              <div className="satellite">
                <span className="body" />
                <span className="panel left" />
                <span className="panel right" />
                <span className="signal" />
              </div>
            </div>
            <div className="stars">
              {Array.from({ length: 14 }).map((_, i) => (
                <span key={`star-${i}`} className={`s s${i+1}`} />
              ))}
            </div>
          </div>
        )}
        {label && <div className="loading-label">{label}</div>}
      </div>
    </div>
  );
}
