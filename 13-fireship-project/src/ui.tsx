import type { ComponentChildren } from "npm:preact";

/**
 * Esto no es React, no hay hooks ni funcionalidades de cliente
 * JSX se usa para templating
 */

/**
 * Esta es una multipage application
 * El Layout es un bloque reusable que ocupamos en todas las páginas
 *
 * En el medio se instancia el componente children
 */
export function Layout({ children }: { children: ComponentChildren }) {
  return (
    <html data-theme="light">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://cdn.jsdelivr.net/npm/daisyui@4.12.13/dist/full.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="icon" type="image/png" href="/static/logo.png" />
      </head>

      <div className="min-h-screen flex flex-col bg-base-100">
        <header className="navbar bg-primary text-primary-content shadow-lg">
          <div className="navbar-start">
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </label>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-primary"
              >
                <li>
                  <a href="/">Home</a>
                </li>

                <li>
                  <a href="/links">My Links</a>
                </li>

                <li>
                  <a href="/links/new">Create Links</a>
                </li>
              </ul>
            </div>
            {/* OUT OF Build-in JSX: */}
            <a href="/" className="btn btn-ghost normal-case text-xl">
              Fireship Deno Course
            </a>
          </div>
          {/* OUT OF Build-in JSX: */}
          <div className="navbar-end hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/links">My Links</a>
              </li>
              <li>
                <a href="/links/new">Create Links</a>
              </li>
            </ul>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="footer footer-center p-4 bg-base-200 text-base-content">
          <aside>
            <p>Copyright</p>
          </aside>
        </footer>
      </div>
    </html>
  );
}

export function HomePage({ user }: { user: any }) {
  return (
    <Layout>
      <div className="hero min-h-[500px] bg-base-200 rounded-box">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to link.fireship.app</h1>
            <p className="py-6">
              link.fireship.app is a Deno-powered URL shortening service.
              Create, manage, and track your links with enterprise-grade tools.
            </p>
            {user
              ? (
                <div className="space-y-4">
                  <div className="text-lg">Welcome back, {user.login}!</div>
                  <div className="space-x-4">
                    <a href="/links/new" className="btn btn-primary">
                      Create New Link
                    </a>
                    <a
                      href="/oauth/signout"
                      className="btn btn-outline btn-error"
                    >
                      Sign Out
                    </a>
                  </div>
                </div>
              )
              : (
                <a href="/oauth/signin" className="btn btn-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 mr-2 fill-current"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Sign In with GitHub
                </a>
              )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export function LinksPage({ shortLinkList }) {
}

export function CreateShortlinkPage() {
  return (
    <Layout>
      <div className="card shadow-xl max-w-2xl mx-auto">
        <div className="card-body">
          <h2 className="card-title mb-6">Create a New Shortlink</h2>
          {
            /**
             * Server side rendered html usually uses "form" instead of
             * clientside fancy stuff
             */
          }
          <form action="/links" method="POST" className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Long URL</span>
              </label>
              <input
                type="url"
                name="longUrl"
                required
                placeholder="https://example.com/your-long-url"
                className="input input-bordered w-full"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Create Shortlink
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export function UnauthorizedPage() {
  return (
    <Layout>
      <p>
        Please sign in to access this resource
      </p>
    </Layout>
  );
}
