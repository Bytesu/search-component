import {Search, SearchBox} from './components/'
import React, {useRef} from 'react';
import {getFn} from './libs/'

export default function App(props) {
    const searchBoxRef = useRef();
    return (
        <div>
            <Search
                searchFn={async (keyword) => {
                    let res = await getFn('/people/?search=' + keyword)
                    return res;
                }}
                resFn={(res) => {
                    searchBoxRef.current.update(res)
                }}
            ></Search>
            <SearchBox
                ref={searchBoxRef}
            >
            </SearchBox>
        </div>
    );
}

