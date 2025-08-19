function SuggestionButton({Name}){
    return <div className="inline">
    <button className="h-[8vw] w-[22vw] md:h-[1.7vw] md:w-[auto] px-[1.2vw] border-[1px] border-[#b0b0b0] text-[#a0a0a0] text-[3.4vw]  md:text-[0.85vw] rounded-xl ml-[1.5vw] mt-[0.5vw] hover:cursor-pointer hover:bg-[#f5f5f5]">{Name}</button>
    </div>
}
export default SuggestionButton;