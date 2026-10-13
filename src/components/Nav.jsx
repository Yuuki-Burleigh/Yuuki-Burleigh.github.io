export default function Nav({ light, onTheme }) {
  return <header className="nav"><a className="brand" href="#top">YB / Home lab</a><nav aria-label="Main"><a href="#work">Labs</a><a href="#certs">Certifications</a><a href="#experience">Experience</a></nav><button onClick={onTheme} aria-label="Light mode" aria-pressed={light}>{light ? 'Evening' : 'Daylight'}</button></header>
}
