import { React, useState } from "react";
import { Button, message } from "antd";
import moment from 'moment'
import "./Urna.css";

const Urna = (props) => {
  const [step, setStep] = useState(0);
  const [candidateNumber, setCandidateNumber] = useState("");
  const [disabledConfirm, setDisabledConfirm] = useState(true);
  const [candidate, setCandidate] = useState({});

  const handleChange = async (e) => {
        setCandidateNumber(e.target.value)
        if(e.target.value.length === 2 && step === 1) { 
            try {
                let candidate = await getCandidate(e.target.value)
                setCandidate(candidate[0])
                setDisabledConfirm(false)
                
            }
            catch(e) {
                console.log(e)
                setDisabledConfirm(true)
                setCandidate({
                    NomeCompleto: "",
                    NomeVice: ""
                })
            }
        }
        if(e.target.value.length === 5 && step === 2) {
            try {
                let candidate = await getCandidate(e.target.value)
                setCandidate(candidate[0])
                setDisabledConfirm(false)
                
            }
            catch(e) {
                console.log(e)
                setDisabledConfirm(true)
                setCandidate({
                    NomeCompleto: "",
                    NomeVice: ""
                })
            }
        }
    }

  const handleNotVote = (e) => {
    try {
        postVote(true)
        setCandidate({
            Legenda: "",
            NomeCompleto: "",
            NomeVice: ""
        })
        setCandidateNumber("")
    }catch (e) {

    }
    
    step === 1 ? setStep(2) : setStep(0);

  }

  const getCandidate = async (num) => {
    const result = await fetch(`https://localhost:44394/api/GetCandidate/${num}`, { method: "GET" });

    return await result.json();
  }

  const postVote = async (noVote) => {
      const ip = await (await fetch("https://api.ipify.org?format=json&callback=getIP")).json()
      const data = moment().format('yyyyMMDD')
      console.log(ip.ip, data)
      const body = {
        legenda: noVote ? 0 : candidate.Legenda,
        ip: ip.ip,
        data: data
    }
      const result = await fetch(`https://localhost:44394/api/PostVotes`, { method: "POST", body: JSON.stringify(body), headers: {'Content-Type': 'application/json'}})

      return await result
  }

  const handleConfirm = async (e) =>  {
    setDisabledConfirm(true)
    try {
        postVote(false)
        setCandidate({
            Legenda: "",
            NomeCompleto: "",
            NomeVice: ""
        })
        setCandidateNumber("")
    }catch (e){
        console.log(e)
    }
 
    step === 1 ? setStep(2) : setStep(0);

  }

  return (
    <div className="container">
      <div className="content">
        {step === 0 && (
          <Button onClick={() => setStep(1)} key="init">
            Iniciar
          </Button>
        )}
        {step === 1 && (
          <div className="voteContent">
            <div className="title">
              <span>SEU VOTO PARA</span>
            </div>
            <div className="candidateType">Vereador</div>
            <div className="candidateNumber">
              Número:
              <input type="number" min="00" max="99999" size="4" onChange={handleChange} value={candidateNumber}/>
            </div>
            <div className="candidateName">
              Nome:
              <input type="text" disabled value={candidate.NomeCompleto} />
            </div>
            {step === 1 && (
              <div className="viceCandidate">
                Vice:
                <input type="text" disabled value={candidate.NomeVice} />
              </div>
            )}
            <div>
              <div className="control">
                <Button onClick={handleNotVote}>Branco</Button>
                <Button onClick={() => {
                    setCandidateNumber("")
                    setCandidate({
                        NomeCompleto: "",
                        NomeVice: ""
                    })
                }}>Corrige</Button>
                <Button disabled={disabledConfirm} onClick={handleConfirm}>Confirma</Button>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="voteContent">
            <div className="title">
              <span>SEU VOTO PARA</span>
            </div>
            <div className="candidateType">Prefeito</div>
            <div className="candidateNumber">
              Número:
              <input type="number" min="00" max="99" size="2" onChange={handleChange} value={candidateNumber}/>
            </div>
            <div className="candidateName">
              Nome:
              <input type="text" disabled value={candidate.NomeCompleto} />
            </div>
            <div>
              <div className="control">
                <Button onClick={handleNotVote}>Branco</Button>
                <Button onClick={() => {
                    setCandidateNumber("")
                    setCandidate({
                        NomeCompleto: "",
                        NomeVice: ""
                    })
                }}>Corrige</Button>
                <Button disabled={disabledConfirm} onClick={handleConfirm}>Confirma</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Urna;
