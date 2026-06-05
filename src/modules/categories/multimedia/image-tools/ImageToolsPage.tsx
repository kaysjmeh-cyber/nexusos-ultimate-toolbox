import { useState, useRef } from 'react';

export function ImageToolsPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'convert' | 'edit'>('create');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageFormat, setImageFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [imageWidth, setImageWidth] = useState(800);
  const [imageHeight, setImageHeight] = useState(600);
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e');
  const [textOverlay, setTextOverlay] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, imageWidth, imageHeight);

    // Add some decorative elements
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.3)';
    ctx.lineWidth = 2;
    
    // Draw grid pattern
    for (let i = 0; i < imageWidth; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, imageHeight);
      ctx.stroke();
    }
    for (let i = 0; i < imageHeight; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(imageWidth, i);
      ctx.stroke();
    }

    // Add gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, imageWidth, imageHeight);
    gradient.addColorStop(0, 'rgba(0, 245, 255, 0.1)');
    gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 0, 136, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, imageWidth, imageHeight);

    // Add text overlay if provided
    if (textOverlay) {
      ctx.fillStyle = textColor;
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(textOverlay, imageWidth / 2, imageHeight / 2);
    }

    // Convert to data URL
    const mimeType = imageFormat === 'png' ? 'image/png' : imageFormat === 'jpeg' ? 'image/jpeg' : 'image/webp';
    const dataUrl = canvas.toDataURL(mimeType, 0.9);
    setGeneratedImage(dataUrl);
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `nexusos-image-${Date.now()}.${imageFormat}`;
    link.click();
  };

  const handleClearImage = () => {
    setGeneratedImage(null);
    setTextOverlay('');
  };

  return (
    <section className="nx-page">
      <div className="nx-page-header">
        <h1>Image Tools</h1>
        <p className="nx-muted">Outils de traitement d\'images - création, conversion, édition</p>
      </div>

      <div className="nx-settings-panel">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            type="button"
            className={`nx-btn ${activeTab === 'create' ? 'nx-btn-primary' : 'nx-btn-secondary'}`}
            onClick={() => setActiveTab('create')}
          >
            🎨 Créer
          </button>
          <button
            type="button"
            className={`nx-btn ${activeTab === 'convert' ? 'nx-btn-primary' : 'nx-btn-secondary'}`}
            onClick={() => setActiveTab('convert')}
          >
            🔄 Convertir
          </button>
          <button
            type="button"
            className={`nx-btn ${activeTab === 'edit' ? 'nx-btn-primary' : 'nx-btn-secondary'}`}
            onClick={() => setActiveTab('edit')}
          >
            ✏️ Éditer
          </button>
        </div>

        {activeTab === 'create' && (
          <div>
            <h2>Créer une image</h2>
            <p className="nx-muted">Générez des images personnalisées avec des options avancées</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <strong>Largeur (px)</strong>
                </label>
                <input
                  type="number"
                  min="100"
                  max="4000"
                  value={imageWidth}
                  onChange={(e) => setImageWidth(Number(e.target.value))}
                  className="nx-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <strong>Hauteur (px)</strong>
                </label>
                <input
                  type="number"
                  min="100"
                  max="4000"
                  value={imageHeight}
                  onChange={(e) => setImageHeight(Number(e.target.value))}
                  className="nx-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <strong>Format</strong>
                </label>
                <select
                  value={imageFormat}
                  onChange={(e) => setImageFormat(e.target.value as 'png' | 'jpeg' | 'webp')}
                  className="nx-input"
                  style={{ width: '100%' }}
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <strong>Couleur de fond</strong>
                </label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <strong>Texte (optionnel)</strong>
                </label>
                <input
                  type="text"
                  value={textOverlay}
                  onChange={(e) => setTextOverlay(e.target.value)}
                  placeholder="Votre texte ici..."
                  className="nx-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <strong>Couleur du texte</strong>
                </label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button type="button" className="nx-btn" onClick={handleGenerateImage}>
                🎨 Générer l\'image
              </button>
              {generatedImage && (
                <>
                  <button type="button" className="nx-btn nx-btn-secondary" onClick={handleDownloadImage}>
                    📥 Télécharger
                  </button>
                  <button type="button" className="nx-btn nx-btn-secondary" onClick={handleClearImage}>
                    🗑️ Effacer
                  </button>
                </>
              )}
            </div>

            {/* Hidden canvas for image generation */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Preview */}
            {generatedImage && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <h3>Aperçu</h3>
                <img
                  src={generatedImage}
                  alt="Generated image"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '500px',
                    border: '2px solid var(--nx-border)',
                    borderRadius: 'var(--nx-radius)',
                  }}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'convert' && (
          <div>
            <h2>Convertir une image</h2>
            <p className="nx-muted">Convertissez des images entre différents formats</p>
            
            <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--nx-surface-2)', borderRadius: 'var(--nx-radius)' }}>
              <p className="nx-muted">Fonctionnalité de conversion d\'images</p>
              <p>Sélectionnez une image pour la convertir</p>
              <input
                type="file"
                accept="image/*"
                className="nx-input"
                style={{ margin: '1rem auto', display: 'block' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'edit' && (
          <div>
            <h2>Éditer une image</h2>
            <p className="nx-muted">Éditez et manipulez vos images</p>
            
            <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--nx-surface-2)', borderRadius: 'var(--nx-radius)' }}>
              <p className="nx-muted">Fonctionnalité d\'édition d\'images</p>
              <p>Sélectionnez une image pour l\'éditer</p>
              <input
                type="file"
                accept="image/*"
                className="nx-input"
                style={{ margin: '1rem auto', display: 'block' }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
