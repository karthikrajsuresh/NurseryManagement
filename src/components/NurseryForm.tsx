import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNursery } from '../redux/nurserySlice';
import { RootState } from '../redux/store';

interface PredefinedNurseries {
    [key: number]: string[];
}

const NurseryForm = () => {
    const dispatch = useDispatch();
    const saplings = useSelector((state: RootState) => state.nursery.saplings);
    const districts = useSelector((state: RootState) => state.nursery.districts);
    // const nurseries = useSelector((state: RootState) => state.nursery.nurseries);

    const [nurseryName, setNurseryName] = useState('');
    const [districtId, setDistrictId] = useState(1);
    const [selectedSaplings, setSelectedSaplings] = useState<{ [key: number]: number }>({});
    const [predefinedNurseries, setPredefinedNurseries] = useState<PredefinedNurseries>({});
    const [nurseryNameError, setNurseryNameError] = useState('');
    const [saplingError, setSaplingError] = useState('');

    useEffect(() => {
        fetch('/data/predefinedNurseries.json')
            .then((response) => response.json())
            .then((data: PredefinedNurseries) => {
                setPredefinedNurseries(data);
            })
            .catch((error) => {
                console.error('Error fetching predefined nurseries:', error);
            });
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (nurseryName.trim() === '' && Object.keys(selectedSaplings).length === 0) {
            setNurseryNameError('Please enter a nursery name');
            setSaplingError('Please select at least one sapling');
            return;
        } else if (Object.keys(selectedSaplings).length === 0) {
            setSaplingError('Please select at least one sapling');
            return;
        }
        const nurseryData = {
            nursery: nurseryName,
            district_id: districtId,
            nursery_saplings: Object.keys(selectedSaplings).map((saplingId) => ({
                sapling_id: parseInt(saplingId),
                quantity: selectedSaplings[parseInt(saplingId)],
            })),
        };
        console.log(nurseryData);
        console.log(`${JSON.stringify(nurseryData)}`);
        //alert(`${JSON.stringify(nurseryData)}`);
        dispatch(addNursery(nurseryData));
    };

    const handleNurseryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        if (value === '') {
            setNurseryNameError('Please enter a nursery name');
        } else {
            setNurseryNameError('');
        }
        setNurseryName(value);
    };

    const handleSaplingSelection = (saplingId: number) => {
        const updatedSelectedSaplings = { ...selectedSaplings };
        if (updatedSelectedSaplings[saplingId]) {
            delete updatedSelectedSaplings[saplingId];
        } else {
            updatedSelectedSaplings[saplingId] = 1;
        }
        setSelectedSaplings(updatedSelectedSaplings);
        if (Object.keys(updatedSelectedSaplings).length > 0) {
            setSaplingError('');
        }
    };

    return (
        <form className="max-lg: mx-auto p-11 rounded-lg shadow-lg bg-gradient-to-r from-gray-100 to-white" onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-lg font-semibold" htmlFor="district">
                    District
                </label>
                <select className="mt-2 p-2 w-full border rounded-lg"
                    value={districtId}
                    onChange={(e) => setDistrictId(parseInt(e.target.value))}
                >
                    {districts.map((district) => (
                        <option key={district.district_id} value={district.district_id}>
                            {district.district}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-lg font-semibold">Nursery Name</label>
                <input
                    type="text"
                    placeholder='Enter nursery name or select from the options below'
                    className="mt-2 p-2 w-full border rounded-lg"
                    value={nurseryName}
                    onChange={(e) => handleNurseryNameChange(e)}
                />
                {nurseryNameError && (
                    <p className="text-red-500 text-sm mt-1">{nurseryNameError}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                    {predefinedNurseries[districtId as keyof typeof predefinedNurseries]?.map((nursery) => (
                        <button
                            key={nursery}
                            type="button"
                            className="bg-blue-200 text-blue-800 p-2 hover:bg-blue-300 rounded-full "
                            onClick={() => {
                                setNurseryName(nursery);
                                setNurseryNameError('');
                            }}
                        >
                            {nursery}
                        </button>
                    ))}
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-lg font-semibold mb-2" htmlFor="saplings">Select The Saplings</label>
                <div className="flex flex-wrap gap-2">
                    {saplings.map((sapling) => (
                        <button
                            key={sapling.sapling_id}
                            type="button"
                            className={`p-2 rounded-full ${selectedSaplings[sapling.sapling_id] ? 'bg-green-200' : 'bg-gray-200'} text-gray-800 hover:bg-gray-300`}
                            onClick={() => handleSaplingSelection(sapling.sapling_id)}
                        >
                            {sapling.sapling}
                        </button>
                    ))}
                </div>
                {saplingError && <p style={{ color: 'red' }}>{saplingError}</p>}
                {Object.keys(selectedSaplings).length > 0 && (
                    <div className="max-lg mx-auto mt-6 p-4 bg-white rounded-lg shadow-lg mb-6">
                        <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2 text-lg">Saplings</th>
                                    <th className="border border-gray-300 p-2 text-lg">Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(selectedSaplings).map((saplingId) => (
                                    <tr key={saplingId} className="border border-gray-300">
                                        <td className="text-center border border-gray-300 p-2 text-lg text-gray-700">
                                            {saplings.find(s => s.sapling_id === parseInt(saplingId))?.sapling}
                                        </td>
                                        <td className="text-center border border-gray-300 p-2 text-lg">
                                            <input
                                                type="number"
                                                placeholder='Enter quantity'
                                                min="1"
                                                value={selectedSaplings[parseInt(saplingId)]}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    const numericValue = parseInt(value);
                                                    if (isNaN(numericValue) || numericValue <= 0) {
                                                        alert('Please enter a valid quantity greater than 0');
                                                    } else {
                                                        setSelectedSaplings(prev => ({ ...prev, [parseInt(saplingId)]: numericValue }));
                                                    }
                                                }}
                                                className="p-1 border border-gray-300 rounded w-20 text-center"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <button
                type="submit"
                className="rounded-full uppercase text-xs cursor-pointer text-white font-bold py-2 px-3 bg-gradient-to-r from-pink-500 to-purple-700 w-full">
                Submit
            </button>
        </form>
    );
};

export default NurseryForm