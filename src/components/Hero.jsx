import { profile } from '../data/certs'

export default function Hero() {
  return (
    <header className="hero">
      <div className="terminal">
        <div className="term-bar">
          <i /><i /><i />
          <span>session — operator profile</span>
        </div>
        <div className="term-body">
          <p className="boot-line">$ initializing operator profile<span className="ok"> ...</span></p>
          <p className="boot-line">$ loading credentials<span className="ok"> [ OK ]</span></p>
          <p className="boot-line">$ link established<span className="ok"> [ ONLINE ]</span></p>

          <h1 className="hero-name">
            {profile.first}
            <br />
            <span className="amber">{profile.last}</span>
          </h1>
          <p className="hero-title">{profile.title}</p>
          <div className="hero-links">
            <a className="hero-link" href={`mailto:${profile.email}`}>email</a>
            <a className="hero-link" href={profile.linkedin} target="_blank" rel="noreferrer">linkedin</a>
            <a className="hero-link" href={profile.github} target="_blank" rel="noreferrer">github</a>
          </div>
        </div>
      </div>
    </header>
  )
}
