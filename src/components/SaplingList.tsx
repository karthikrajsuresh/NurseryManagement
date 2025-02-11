import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { editNursery } from '../redux/nurserySlice';
import EditNurseryForm from './EditNurseryForm';
import { Nursery } from '../types';

const SaplingList = () => {
    const nurseries = useSelector((state: RootState) => state.nursery.nurseries);
    const [editingNurseryIndex, setEditingNurseryIndex] = useState<number | null>(null);
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');

    const handleEditNursery = (index: number) => {
        setEditingNurseryIndex(index);
    };

    const handleUpdateNursery = (updatedNursery: Nursery) => {
        if (editingNurseryIndex !== null) {
            dispatch(editNursery({ index: editingNurseryIndex, updateNursery: updatedNursery }));
            setEditingNurseryIndex(null);
        }
    };

    // const handleNavigate = (direction: 'prev' | 'next') => {
    //     if (editingNurseryIndex !== null) {
    //         const newIndex = direction === 'prev' ? editingNurseryIndex - 1 : editingNurseryIndex + 1;
    //         if (newIndex >= 0 && newIndex < nurseries.length) {
    //             setEditingNurseryIndex(newIndex);
    //         }
    //     }
    // };

    const handleSubmit = (nursery: Nursery) => {
        // console.log("Submitted Nursery Data:", JSON.stringify(nursery, null, 2));
        console.log(nursery);
        console.log(`${JSON.stringify(nursery)}`);
        alert(`${JSON.stringify(nursery)}`);
    };

    useEffect(() => {
        if (message) {
            alert(message);
            setMessage('');
        }
    }, [message]);

    return (
        <div className="max-lg mx-auto mt-6 p-4 bg-transparent rounded-lg shadow-lg bg-gradient-to-r from-white to-gray-100">
            {nurseries.length > 0 ? (
                nurseries.map((nursery, index) => (
                    <div key={index} className="max-lg mx-auto mt-6 p-4 bg-white rounded-lg shadow-lg mb-6">
                        <h2 className="text-2xl font-bold mb-2">{nursery.nursery}</h2>
                        <p className="text-lg text-gray-600 mb-4">District: {nursery.district_id}</p>
                        <h3 className="text-xl font-semibold mb-2">Saplings:</h3>
                        <table className="w-full table-auto border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2 text-lg">Sapling ID</th>
                                    <th className="border border-gray-300 p-2 text-lg text-gray-600">Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nursery.nursery_saplings.map((sapling, saplingIndex) => (
                                    <tr key={saplingIndex}>
                                        <td className="text-center border border-gray-300 p-2 text-lg">{sapling.sapling_id}</td>
                                        <td className="text-center border border-gray-300 p-2 text-lg text-gray-600">{sapling.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            type="button"
                            className="rounded-full uppercase text-xs cursor-pointer text-white font-bold py-2 px-3 bg-gradient-to-r from-pink-500 to-purple-700 w-1/2 mt-4 mb-2"
                            onClick={() => handleEditNursery(index)}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="rounded-full uppercase text-xs cursor-pointer text-white font-bold py-2 px-3 bg-gradient-to-r from-purple-700 to-pink-500 w-1/2 mt-4 mb-2"
                            onClick={() => handleSubmit(nursery)}
                        >
                            Submit
                        </button>
                        {/* <div className="flex justify-self-end mt-2">
                            <button
                                onClick={() => handleNavigate('prev')}
                                disabled={index === 0}
                                className="rounded-full uppercase text-xs cursor-pointer text-white font-bold py-2 px-3 bg-gradient-to-r from-purple-700 to-pink-500"

                            >
                                Previous
                            </button>
                            <button
                                onClick={() => handleNavigate('next')}
                                disabled={index === nurseries.length - 1}
                                className="rounded-full uppercase text-xs cursor-pointer text-white font-bold py-2 px-3 bg-gradient-to-r from-purple-700 to-pink-500"
                            >
                                Next
                            </button>
                        </div> */}
                    </div>
                ))
            ) : (
                <p className="text-lg text-gray-800 text-center p-4 bg-gradient-to-r from-white to-gray-100">
                    No nursery data available.
                </p>
            )}

            {editingNurseryIndex !== null && (
                <div className="popup">
                    {/* <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"> */}
                    <div className="popup-content">
                        {/* <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"> */}

                        <EditNurseryForm
                            nursery={nurseries[editingNurseryIndex]}
                            onSave={handleUpdateNursery}
                            onCancel={() => setEditingNurseryIndex(null)}
                        />

                    </div>
                </div>
            )}
        </div>
    );
};

export default SaplingList;