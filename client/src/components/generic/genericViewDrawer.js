import React, { useState } from 'react';
import { List, Typography, Drawer, Spin } from 'antd';
import { useQuery } from '@apollo/react-hooks';

export default function GenericViewDrawerContent(props) {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const { typeId, typeName, getQuery } = props;
    const { data, loading, error } = useQuery( getQuery, { variables : { id: typeId }, skip:!drawerVisible||!typeId  } );
    const typeData = data?data[typeName]:{};  
    const { Title } = Typography;
    
    let list = [
        { lable: "Description", content: typeData.description }
    ]

    if(error){
        list = [{ lable: "Description", content: "There was an error fetching the data" }]
    }

    return(
        <React.Fragment>  
            <button key={typeId} className="link" onClick={() => setDrawerVisible(true)}>Details</button>
            <Drawer
                width={640}
                placement="right"
                closable={true}
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}
                bodyStyle={{ padding: 0 }}
                >
                <div style={{ margin: 24 }}>
                    <Spin tip="Loading..." spinning={loading}>
                        <List
                            header={<Title level={4}>{typeData.name}</Title>}
                            dataSource={list}
                            itemLayout="horizontal"
                            renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                title={item.lable}
                                description={item.content}
                                />
                            </List.Item>
                        )}/>
                    </Spin>
                </div>
            </Drawer>
        </React.Fragment>
    )
}