import React, {useEffect, useState} from 'react'

import { Column } from '@ant-design/charts';


export default (props) => {
    const [ votes, setVotes ] = useState([]);
    useEffect(async () => {
        const votesList = await getVotes()
        setVotes(votesList.sort((a, b) => b.QuantidadeVotos - a.QuantidadeVotos))
    }, [])
    
    const getVotes = async () => {
        const result = await fetch('https://localhost:44394/api/GetVotes', {method: 'GET'})
        return await result.json()
    }
    const config = {
        data: votes,
        xField: 'NomeCompleto',
        yField: 'QuantidadeVotos',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6
            }
        },
        meta: {
            QuantidadeVotos: {alias: 'Votos'},
            NomeCompleto: {alias: 'Nome'}
        }
       
    };

    return (
        <div>
            <Column {...config} />
        </div>
    )
}