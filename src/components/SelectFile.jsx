import { useState } from 'react';

const SelectFile = (props) => {

    const [fileName, setFileName] = useState(null);
    const buttonLabelEnding=props.type==undefined?"...":" (."+props.type+")...";

    const getFile = async () => {
        var file = await window.api.getFile(props.type);
        if(file!=null){
            const filePathArray = file.path.split("\\");
            setFileName(filePathArray[filePathArray.length-1])
        }
        else
            setFileName(null)

        props.onChange(file);
    }


    return (
        <div className='selectionFile'>
            {fileName!=null?(<><b>Archivo: &nbsp;</b>{fileName}</>):""}
            <button className={fileName!=null?"small":""} 
                    onClick={getFile}>
            {fileName==null?("Seleccionar Archivo"+buttonLabelEnding)
                            :"Cambiar..."
            }
            </button>
        </div>
    );
}

export default SelectFile;