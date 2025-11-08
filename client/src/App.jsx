import { useState, useEffect } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [welcomeText, setWelcomeText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');

  const fullWelcome = 'WELCOME';
  const fullSubtitle = 'PASTE ANY URL, MAKE IT SHORT AND ENJOY';

  useEffect(() => {
    let welcomeIndex = 0;
    let subtitleIndex = 0;

    const welcomeTimer = setInterval(() => {
      if (welcomeIndex < fullWelcome.length) {
        setWelcomeText(fullWelcome.slice(0, welcomeIndex + 1));
        welcomeIndex++;
      } else {
        clearInterval(welcomeTimer);

        const subtitleTimer = setInterval(() => {
          if (subtitleIndex < fullSubtitle.length) {
            setSubtitleText(fullSubtitle.slice(0, subtitleIndex + 1));
            subtitleIndex++;
          } else {
            clearInterval(subtitleTimer);
          }
        }, 50);
      }
    }, 100);

    return () => clearInterval(welcomeTimer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setCopied(false);

    if (!url) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longUrl: url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to shorten URL');
      }

      setShortUrl(`http://localhost:5000/api/${data.urlCode}`);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header Logo */}
      <header className="absolute top-6 left-6 flex items-center gap-2">
        <h2 className="text-lg font-medium text-white">URL Shortener</h2>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Typing Animation Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-3 min-h-16">
              {welcomeText}
            </h1>
            <p className="text-base md:text-lg text-white/70 min-h-8">
              {subtitleText}
              {subtitleText.length < fullSubtitle.length && (
                <span className="animate-blink">|</span>
              )}
            </p>
          </div>

          {/* URL Shortener Card */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter your URL..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-medium py-3 px-4 rounded hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Shortening...
                  </span>
                ) : (
                  'Shorten URL'
                )}
              </button>

              {error && (
                <div className="text-white/70 text-sm px-4 py-2">
                  {error}
                </div>
              )}

              {shortUrl && (
                <div className="rounded p-4 border border-white/20 animate-fadeIn">
                  <p className="text-white/70 text-xs mb-2">Shortened URL</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={shortUrl}
                      readOnly
                      className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="bg-white text-black px-4 py-2 rounded text-sm hover:bg-white/90 transition-colors font-medium"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Easy Feature */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 text-center">
            <h3 className="text-lg font-medium text-white mb-2">Easy</h3>
            <p className="text-white/60 text-sm">
              Enter the long link to get your shortened link
            </p>
          </div>

          {/* Shortened Feature */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 text-center">
            <h3 className="text-lg font-medium text-white mb-2">Shortened</h3>
            <p className="text-white/60 text-sm">
              Use any link, ShortURL always shortens
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-white text-lg font-bold">
          MADE WITH 🤍
        </p>
      </footer>
    </div>
  );
}

export default App;
