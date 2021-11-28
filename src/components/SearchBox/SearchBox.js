import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from 'react';

export const SearchBox = forwardRef((props, ref) => {
    const [selected, setSelected] = useState(props.selected)

    //update fn
    const updateSelected = useCallback((selected) => {
        setSelected(selected)
    }, [setSelected])

    //trigger fn
    useEffect(() => {
        updateSelected(props.selected);
    }, [props.selected])// eslint-disable-line

    //export fn
    useImperativeHandle(ref, () => ({
        update: (value) => {
            setSelected(value)
        }
    }), [setSelected])

    return (
        <div>
            {
                !!Object.keys(selected).length && ['name', 'height', 'mass', `hair_color`, `skin_color`, `eye_color`, `birth_year`, 'gender']
                    .map(key => {
                        return <div style={{display: 'flex'}}>
                            <div style={{width: '100px'}}>{key.replace('_', ' ')}</div>
                            :{selected[key]}</div>

                    })
            }
        </div>
    );
})

SearchBox.defaultProps = {
    selected: {}
}

