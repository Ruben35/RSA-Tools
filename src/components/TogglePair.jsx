import { useState } from 'react';

const TogglePair = (props) => {

    const [active, setActive] = useState(props.firstOption);

    const toggle = (type) => {
        setActive(type);
        props.onChange(type);
    }

    return ( 
        <div className='toggleButtons'>
            <button className={active===props.firstOption?"active":""} onClick={() => toggle(props.firstOption)} >{props.firstOption}</button>
            <button className={active===props.secondOption?"active":""} onClick={() => toggle(props.secondOption)} >{props.secondOption}</button>
        </div>
    );
}

export default TogglePair;