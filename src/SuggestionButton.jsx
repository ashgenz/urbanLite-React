function SuggestionButton({Name}){
    return <div className="inline">
    <button className="h-[1.7vw] w-[auto] px-[1.2vw] border-[1px] border-[#b0b0b0] text-[#a0a0a0] rounded-xl ml-[1.5vw] mt-[0.5vw] hover:cursor-pointer hover:bg-[#f5f5f5]">{Name}</button>
    </div>
}
export default SuggestionButton;