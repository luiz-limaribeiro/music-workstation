import './Footer.css'

export default function Footer() {
  return (
    <footer>
      <div className='icons'>
        <a href='https://github.com/luiz-limaribeiro' target='_blank'>GitHub</a>
        <a href='https://linkedin.com/in/luizdelimaribeiro' target='_blank'>LinkedIn</a>
      </div>
      <div className='contact-info'>
        <span><b className='material-symbols-rounded'>call</b>+55 (81) 98939-7456</span>
        <span><b className='material-symbols-rounded'>mail</b>de.limaribeiroluiz@gmail.com</span>
      </div>
    </footer>
  )
}