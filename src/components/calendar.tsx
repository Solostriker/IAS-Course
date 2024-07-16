import React, { useState } from "react";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";

function daysInThisMonth (dateReference:Date) {
  return new Date(dateReference.getFullYear(), dateReference.getMonth()+1, 0).getDate();
}

function calendarOffset (dateReference:Date) {
    var firstDay = new Date(dateReference.getFullYear(), dateReference.getMonth(), 1)
    return firstDay.getDay()
}

function Day (props:any) {    
    const day = props.indx + 1
    const currentDate = new Date()
    var isTodayDay = false

    var isSelected = false

    if (props.date.getFullYear() == currentDate.getFullYear() && 
        day == currentDate.getDate() && 
        props.date.getMonth() == currentDate.getMonth()) {
        isTodayDay = true;
    }

    if (props.selectedDate != undefined &&  
        props.selectedDate.getDate() == day) {
        isSelected = true;
    }

    return (
        <div onClick={() => {props.onClick(day)}} className={`h-[40px] w-[40px] border-2 hover:border-[3px] hover:border-orange-400  text-center rounded-full cursor-pointer ${isTodayDay ? "bg-blue-400 border-none text-white" : "transition-all"} ${isSelected ? "bg-orange-400 text-white border-orange-400" : ""}`}>
            <p className="relative top-[50%] translate-y-[-50%] text-[12px] select-none">
                {day}
            </p>
        </div>
    )
}

export default function Calendar (props:any) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date>(undefined as any)
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];

    function dateIncrDecr (isIncr:boolean) { 
        if (isIncr) {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()))
            setSelectedDate(undefined as any)
            props.datePressed(undefined as any)
        } else {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()))
            setSelectedDate(undefined as any)
            props.datePressed(undefined as any)
        }
    }

    function dayClick (day:number) {
        var d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        
        if (selectedDate != undefined && selectedDate.getFullYear() == d.getFullYear() && 
            selectedDate.getDate() == d.getDate() && 
            selectedDate.getMonth() == d.getMonth()) {
            d = undefined as any;
        }
        setSelectedDate(d)
        props.datePressed(d)
    }

    return (
        <div className="absolute left-[610px] top-[30px] right-[30px] h-[370px] rounded-[15px] border-2 p-[6px] min-w-[400px]">

            <div className="absolute h-[30px] top-[20px] w-auto flex direction-column items-center left-[50%] translate-x-[-50%]"> 
                <IoArrowBackOutline className="h-[15px] w-[15px] mx-2 cursor-pointer" onClick={() => {dateIncrDecr(false)}} /> 
                <p className="w-[120px] text-[14px] text-center select-none">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
                <IoArrowForwardOutline className="h-[15px] w-[15px] mx-2 cursor-pointer" onClick={() => {dateIncrDecr(true)}}/> 
            </div>

            <div className="relative w-full top-[55px] h-[25px] grid grid-cols-7 place-items-center">
                <p className="text-[12px] text-center text-slate-500 select-none">Sun</p>
                <p className="text-[12px] text-center text-slate-500 select-none">Mon</p>
                <p className="text-[12px] text-center text-slate-500 select-none">Tue</p>
                <p className="text-[12px] text-center text-slate-500 select-none">Wed</p>
                <p className="text-[12px] text-center text-slate-500 select-none">Thur</p>
                <p className="text-[12px] text-center text-slate-500 select-none">Fri</p>
                <p className="text-[12px] text-center text-slate-500 select-none">Sat</p>
            </div>

            <div className="relative width-full top-[55px] h-[calc(100%-80px)] grid grid-cols-7 place-items-center">
                {[...Array(calendarOffset(currentDate))].map((value:any, index:number) => {
                    return (<div key={index} className="col-span-1"/>)
                })}
                {[...Array(daysInThisMonth(currentDate))].map((value:any, index:number) => {
                    return (<Day key={index} indx={index} date={currentDate} selectedDate={selectedDate} onClick={dayClick} />)
                })}
            </div>
        </div>
    ) 
}