
export default function Module (props:any) {

    function toggle () {
        if (props.selected === props.ind) {
            props.setSelected(-1)
        } else {
            props.setSelected(props.ind)
        }
    }

    return (
        <div 
            onClick={toggle} 
            className={`relative h-[120px] w-[200px] flex border-2 ml-[20px] rounded-[15px] p-2 flex-col pb-[20px] duration-300 hover:bg-slate-100 ${props.selected == props.ind ? "border-blue-300" : "border-slate-200"}`}
        >
            <p className="font-bold relative left-[10px] w-[calc(100%-50px)] top-[5px]">{props.title}</p>
            <p className="text-[12px] relative left-[10px] max-h-[300px] overflow-y-auto w-[calc(100%-20px)] top-[6px]">{props.description}</p>
        </div>
    )
}