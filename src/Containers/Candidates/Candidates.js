import React, { useState, useEffect } from "react";
import { Form, Table, Button, Input, Select, Modal, message, Popconfirm } from "antd";
import moment from "moment";
import "./Candidates.css";

export default (props) => {
  const [form] = Form.useForm();

  // const FORM_LAYOUT = {
  //     labelCol: {
  //       xs: { span: 4 },
  //       sm: { span: 4 },
  //     },
  //     wrapperCol: {
  //       xs: { span: 14 },
  //       sm: { span: 14 },
  //     },
  //   };

  const [candidates, setCandidates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [visiblePopconfirm, setVisiblePopconfirm] = useState(false);

  useEffect(async () => {
    const candidatesList = await getCandidates();
    setCandidates(candidatesList);
  }, [candidates]);

  const getCandidates = async () => {
    const result = await fetch("https://localhost:44394/api/GetCandidate", {
      method: "GET",
    });
    return await result.json();
  };

  const handleDelete = async (record) => {
    try {
        deleteCandidate(record.Id)
        message.info('Excluido com sucesso')
        getCandidates();
    }catch(e) {
        message.error('Algo deu errado, tente novamente mais tarde.')
    }
  }

  const deleteCandidate = async (id) => {
      const result = await fetch(`https://localhost:44394/api/DeleteCandidate/${id}`, {method: "DELETE"})
      return await result
  }

  const columns = [
    {
      title: "Legenda",
      dataIndex: "Legenda",
      key: "Legenda",
    },
    {
      title: "Nome",
      dataIndex: "NomeCompleto",
      key: "NomeCompleto",
    },
    {
      title: "Vice",
      dataIndex: "NomeVice",
      key: "NomeVice",
    },
    {
      title: "Data de Registro",
      dataIndex: "DataRegistro",
      key: "DataRegistro",
      render: (value) => moment(value).format("DD/MM/yyyy"),
    },
    {
      title: "Tipo de Candidato",
      dataIndex: "TipoCandidato",
      key: "TipoCandidato",
      filters: [
        {
          text: "Prefeito",
          value: 1,
        },
        {
          text: "Vereador",
          value: 2,
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.TipoCandidato === value,
      render: (value) => (value === 1 ? "Prefeito" : "Vereador"),
    },
    {
      title: "Ações",
      render: (value, record) => (
        <div>
          <Button onClick={() => handleEdit(record)}>Editar</Button>
          <Popconfirm title="Deseja mesmo excluir?" okText="Sim" cancelText="Não" onCancel={() => setVisiblePopconfirm(false)} onConfirm={() => handleDelete(record)}>
            <Button >Excluir</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleAdd = (e) => {
    e.preventDefault();
    setShowModal(true);
    setModalTitle("Adicionar Candidato");
  };

  const handleEdit = async (record) => {
    try { 
        let candidate = await getCandidateByNumber(record.Legenda);
        form.setFieldsValue({
            name: candidate[0].NomeCompleto,
            number: candidate[0].Legenda,
            candidateType: `${candidate[0].TipoCandidato}`,
            viceCandidate: candidate[0].NomeVice
        })
        setModalTitle("Alterar Candidato")
        setShowModal(true)
    }catch(e){
        message.error("Algo deu errado, tente novamente mais tarde.")
    }
  }

  const getCandidateByNumber = async num => {
      const result = await fetch(`https://localhost:44394/api/GetCandidate/${num}`, { method: "GET" });

      return await result.json();
  }

  const putCandidate = async body => {
   const result = await fetch(`https://localhost:44394/api/Candidates/EditCandidate/${body.Legenda}`)
   return await result.json()   
  } 

  const handleOk = async () => {
    const body = {
      Legenda: form.getFieldValue("number"),
      NomeCompleto: form.getFieldValue("name"),
      typeCandidate: parseInt(form.getFieldValue("typeCandidate")),
      nomeVice:
        form.getFieldValue("typeCandidate") === "1"
          ? form.getFieldValue("viceCandidate")
          : null,
    };
    if(modalTitle === 'Alterar Candidato'){
        try {
          putCandidate(body);
          message.info("Alterado com sucesso")
          form.resetFields();
          setShowModal(false);
          getCandidates();
        }catch(e){
            message.error("Algo deu errado, tente novamente mais tarde")
        }
    }else{
        try {
          const postedCandidate = await postCandidate(body);
          if (postedCandidate.status) {
            message.info("cadastrado com sucesso");
            form.resetFields();
            setShowModal(false);
          } else {
              message.info("Tente novamente mais tarde")
          }
        } catch (e) {
          message.error("Algo deu errado. Tente novamente mais tarde");
        }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
  };

  const postCandidate = async (body) => {
    const result = await fetch(`https://localhost:44394/api/PostCandidate`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    return await result;
  };

  return (
    <div className="">
      <div className="tableHeader">
        <Button onClick={handleAdd}>Adicionar Candidato</Button>
      </div>
      <Table columns={columns} dataSource={candidates} />
      <Modal
        title={modalTitle}
        visible={showModal}
        onOk={handleOk}
        okText={"Confirmar"}
        cancelText={"Cancelar"}
        onCancel={handleCancel}
        width="75%"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="name"
            label="Nome Completo"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="number" label="Legenda" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="candidateType"
            label="Tipo de Candidato"
            rules={[{ required: true }]}
          >
            <Select placeholder="Selecione o tipo de candidato" onChange={""}>
              <Select.Option value="1">Prefeito</Select.Option>
              <Select.Option value="2">Vereador</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            shouldUpdate={(prev, curr) =>
              prev.candidateType !== curr.candidateType
            }
          >
            {({ getFieldValue }) => {
              return getFieldValue("candidateType") === "1" ? (
                <Form.Item name="viceCandidate" label="Vice">
                  <Input />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
