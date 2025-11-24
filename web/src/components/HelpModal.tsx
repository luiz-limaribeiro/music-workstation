import './styles/HelpModal.css'

interface Props {
  onCloseClick: () => void;
}

export default function HelpModal({ onCloseClick }: Props) {
  return (
    <div className="help-modal">
      <span>add note <b>click</b></span>
      <span>delete note <b>shift + click / select + del</b></span>
      <span>duplicate note(s) <b>select + ctrl-d</b></span>
      <span>move note <b>hold click + drag</b></span>
      <span>resize note <b>hold click at the right of the note + drag</b></span>
      <span>select note(s) <b>ctrl + click</b></span>
      <button
        className="material-symbols-outlined close"
        onClick={onCloseClick}
      >
        close
      </button>
    </div>
  )
}