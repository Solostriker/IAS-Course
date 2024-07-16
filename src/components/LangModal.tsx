import Modal from "react-modal"
import React from "react"

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: "500px",
    height: "80%",
    borderRadius: 25,
  },
};

const langs = {
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'am': 'Amharic',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'ny': 'Chichewa',
    'zh-cn': 'Chinese Simplified',
    'zh-tw': 'Chinese Traditional',
    'co': 'Corsican',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fy': 'Frisian',
    'gl': 'Galician',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'haw': 'Hawaiian',
    'iw': 'Hebrew',
    'hi': 'Hindi',
    'hmn': 'Hmong',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'jw': 'Javanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'ko': 'Korean',
    'ku': 'Kurdish (Kurmanji)',
    'ky': 'Kyrgyz',
    'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mi': 'Maori',
    'mr': 'Marathi',
    'mn': 'Mongolian',
    'my': 'Myanmar (Burmese)',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'ma': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sm': 'Samoan',
    'gd': 'Scots Gaelic',
    'sr': 'Serbian',
    'st': 'Sesotho',
    'sn': 'Shona',
    'sd': 'Sindhi',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sundanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tg': 'Tajik',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'yo': 'Yoruba',
    'zu': 'Zulu'
};


export default function LangModal (props:any) {
    const [search, setSearch] = React.useState("")
    const hiddenInput = React.useRef<HTMLInputElement>(null)
     
    function disAllowEnter (event:any) { 
        if (event.keyCode == 13) event.preventDefault()
    }

    function onInput (event:any) {
        const text = event.currentTarget.textContent
        setSearch(text)
    }

    function filter (arr:string[]) {
        return arr.filter((value:string, index:number) => {
            if (search === "") return true
            else return value.toLowerCase().includes(search.toLowerCase())
        }) 
    }
    
    function languageSelect (lang:string) {
        const ind = Object.values(langs).indexOf(lang)
        const key = Object.keys(langs)[ind]
        props.setLang(`${lang}|${key}`)
        props.setIsOpen(false)
    }

    return (
        <Modal 
            isOpen={props.isOpen}    
            onRequestClose={() => {props.setIsOpen(false)}}
            style={customStyles}
            ariaHideApp={false}
        >
            <h1 className="w-full text-center text-[20px] font-bold">Select a language for your organization</h1>
            <div className="relative top-[10px] w-full height-auto"> 
                {search === "" &&
                    <p onClick={() => hiddenInput.current!.focus()} className="absolute top-[50%] -translate-y-[50%] left-[calc(10%+10px)] text-[12px] text-slate-400">Search Language Here</p>
                }
                <p 
                    ref={hiddenInput}
                    className="text-[12px] px-[10px] mx-[10%] py-[5px] bg-slate-100 rounded-full outline-none" 
                    onInput={onInput} 
                    onKeyDown={(event:any) => disAllowEnter(event)} 
                    contentEditable 
                /> 
            </div>

            <br /> 
            {filter(Object.values(langs)).map((value:string, index:number) => 
                <div className="relative mt-[10px] text-[12px] border-2 border-slate-100 py-[5px] rounded-full pl-[10px] transition-all duration-300 hover:bg-slate-100 cursor-pointer" key={index} onClick={() => languageSelect(value)}>
                    {value}
                </div>
            )}
        </Modal>
    )
}