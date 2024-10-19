import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';

const GroupInfo = ({ groupId }) => {
    const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);
    const [groupInfo, setGroupInfo] = useState({name:'', code:'', adminName:'', description:''});

    useEffect(() => {
        fetchGroupInfo();
    }, []);

    const fetchGroupInfo = async () => {
        try {
            const response = await axios(`http://localhost:3000/api/group/${groupId}`);
            const groupData = await response.data;
            console.log(groupData);
            
            setGroupInfo({
                name: groupData.name,
                code: groupData.groupCode,
                adminName : groupData.admin.username,
                description: groupData.description
            });
        } catch (error) {
            console.error('Error fetching group info:', error);
        }
    };
    const handleOpenModal = () => {
        setShowGroupInfoModal(true);
    };

    const handleCloseModal = () => {
        setShowGroupInfoModal(false);
    };

    return (
        <>
            {/* Button to open the Modal */}
            <button
                onClick={handleOpenModal}
                className="ml-3 text-white"
            >
                ℹ️
            </button>

            {/* Modal for group information */}
            {showGroupInfoModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white w-96">
                    <h2 className="text-2xl font-bold mb-4 text-center">{groupInfo.name}</h2>
            
                    <div className="space-y-4">
                        <div className="flex">
                            <span className="font-semibold w-36">Group Code </span>
                            <span className="text-gray-300">{groupInfo.code}</span>
                        </div>
            
                        <div className="flex">
                            <span className="font-semibold w-36">Admin </span>
                            <span className="text-gray-300">{groupInfo.adminName}</span>
                        </div>
            
                        <div className="flex">
                            <span className="font-semibold w-36">Description </span>
                            <span className="text-gray-300">{groupInfo.description}</span>
                        </div>
                    </div>
            
                    <button
                        onClick={handleCloseModal}
                        className="mt-6 bg-cyan-600 p-2 w-full rounded-lg hover:bg-cyan-800 transition duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
            
            )}
        </>
    );
};

export default GroupInfo;
