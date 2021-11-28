import React, {useCallback, useEffect, useState} from 'react';
import {debounce} from 'lodash'

export function Search(props) {
    const [keyword, setKeyword] = useState('')
    const [res, setRes] = useState({})
    const [selected, setSelected] = useState({})
    const suggestFn = useCallback(async (keyword) => {
        const res = await props.searchFn(keyword)
        console.log(res)
        setRes({
            ...res,
            [keyword]: res.data.results
        })
    }, [props, setRes, res])
    const debou = debounce(suggestFn, 500)
    useEffect(() => {
        if (keyword.length > 1) {
            suggestFn(keyword)
        }
    }, [keyword])
    return (
        <div>
            <div>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => {
                        setKeyword(e.target.value)
                    }}
                />
            </div>
            <div className="panel">
                {
                    (res[keyword] || []).map(item => {
                        let itemLightHight = new RegExp(keyword,'ig');
                        let match = item.name.match(itemLightHight);
                        return <div
                            dangerouslySetInnerHTML={{__html:item.name.replace(itemLightHight,'<span style="font-weight:bold">'+match[0]+'</span>')}}
                            onClick={() => props.resFn?.(item)}></div>
                    })
                }
            </div>
        </div>
    );
}

Search.defaultProps = {
    resFn: async (res) => {
    },
    searchFn: async (kw) => {
        console.log(kw)
    }
}

