import React, { useState } from 'react';
import { reject, lowerCase, upperFirst } from 'lodash';
import { Modal, notification, Spin } from 'antd';
import { Error } from '../generic/viewHelpers'
import { useMutation, useQuery } from '@apollo/react-hooks';

export default function GenericDelete(props) {
    const { typeId, typeName, typeLabel, deteleQuery, allQuery, getQuery } = props;
    const [modalVisible, setModalVisible] = useState(false);
    const { data, loading, error } = useQuery( getQuery, { variables : { id: typeId }, skip:!modalVisible||!typeId } );
    const typeData = data?data[typeName]:{name:"..."};  
    let typeNames = typeName + "s";  
    let getAllQueryName = upperFirst(typeNames);
    let deleteQueryName = "delete" + upperFirst(typeName);  

    const [deleteType] = useMutation(
        deteleQuery, {
        refetchQueries:[ getAllQueryName ],
        onCompleted() {   
            notification['success']({
            message: typeLabel + " deleted",
            duration: 5
            });
        },
        onError(error){
            notification['warning']({
            message: "There was an issue deleteing the " + typeLabel,
            description: error.message,
            duration: 5
            });
        }      
        }
    );

    if(error) return <Error />

    const onDelete = () => {
        let variables = { 
            variables: {
              id: typeId
            },
            optimisticResponse: {
                [ deleteQueryName ]: {
                id: typeId,
                __typename: "ProcessingType"
              },
            },
            update: (proxy, data ) => {
              let optimisticData = data["data"][ deleteQueryName ];
              data = proxy.readQuery({ query: allQuery });
              data[typeNames] = reject(data[typeNames], ['id', optimisticData.id]);
              proxy.writeQuery({ query: allQuery, data });
            }
        }
        
        deleteType(variables)
        setModalVisible(false);
    };

    return (
        <React.Fragment>
            <Modal
                onOk={e => onDelete()}
                destroyOnClose={true}
                onCancel={() => setModalVisible(false)}
                title={"Are you sure you what to delete " + typeData.name}
                visible={modalVisible}
                >
                <Spin tip="Loading..." spinning={loading}>
                    <div>By deleting this {lowerCase(typeLabel)}, "{typeData.name}" will be removed from and system. This action is unrecoverable.</div>               
                </Spin>
            </Modal>
            <button className="link" onClick={() => setModalVisible(true)}>Delete</button>  
        </React.Fragment>
    );
}