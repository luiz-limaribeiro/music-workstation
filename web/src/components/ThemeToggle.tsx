import './styles/ThemeToggle.css'

interface Props {
  onChange: () => void
}

export default function ThemeToggle({ onChange}: Props) {
  return <button className='theme-toggle' onClick={onChange}>theme</button>

}