import React from 'react';
import { Table, Image, Button } from 'react-bootstrap';


const BannerPlatform = (props) => {
    let banners = props.banners;
    let banner = banners.filter(data => data.platform.name === props.platformName)
    let imgHash = Date.now();
    let tableData = banner.map((banner, index) =>
                                    <tr key={banner.uniqueSlug}>
                                        <td>{index + 1}</td>
                                        <td><Image src={`${banner.backgroundImageUrl}?${imgHash}`} width="100px" thumbnail></Image></td>
                                        <td>{banner.name}</td>
                                        <td><Button variant="primary">Edit</Button></td>
                                    </tr>
                                )
    return (
        <div>
            <Table responsive>
                <thead>
                    <tr>
                        <th>Sr. no</th>
                        <th>Banner Image</th>
                        <th>Banner Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    tableData.length === 0? 
                    <tr>
                        <td>No data</td>
                        <td>No data</td>
                        <td>No data</td>
                        <td>No data</td>
                    </tr>
                    :
                    tableData
                    }
                </tbody>
            </Table>
        </div>
    )
}


export default BannerPlatform;