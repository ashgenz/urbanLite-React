import './header.css'

function Header(){
    return <>
    <div id="headbox" className='w-full h-[4vw] left-0 top-0 fixed bg-black'>
      <a id="user" className='text-[#8956ff] text-[1vw] absolute top-[1vw] left-[50vw] ' href="https://4x07dkrh-8600.inc1.devtunnels.ms/" >user</a>
      <a id="w-user" className='text-[#8956ff] text-[1vw] absolute top-[1vw] left-[55vw] ' href="https://4x07dkrh-9600.inc1.devtunnels.ms/" >w-user</a>
      <div id="urbanLite" className='font-[Open_Sans] top-0 ml-[50px] absolute text-white text-[2vw] font-bold break-words'><p>UrbanLite</p></div>
      <span className="material-symbols-outlined">    
      account_circle    
      </span>
    </div>
    </>
}
export default Header;